# Deploy VoucherAI lên Vercel

## ⚠️ Vấn đề quan trọng: SQLite không hoạt động trên Vercel

`better-sqlite3` là native module, **không tương thích với Vercel Serverless Functions**. Cần migrate storage trước khi deploy production.

Có 2 lựa chọn:

| Option | Chi phí | Độ phức tạp | Khuyến nghị |
|--------|---------|-------------|-------------|
| **Vercel KV (Upstash Redis)** | Free tier có | Thấp | ✅ MVP nhanh nhất |
| **Supabase PostgreSQL** | Free tier có | Trung bình | ✅ Production-ready |

---

## Option A — Migrate sang Vercel KV (Upstash Redis)

### 1. Cài dependency

```bash
npm install @vercel/kv
```

### 2. Thay thế `lib/voucher/db.ts`

```typescript
import { kv } from "@vercel/kv";
import { Voucher } from "@/types/voucher";

export async function saveVoucher(v: Voucher): Promise<void> {
  await kv.set(`voucher:token:${v.claim_token}`, v);
  await kv.set(`voucher:id:${v.id}`, v.claim_token);
  // Index by user
  await kv.lpush(`user:${v.creator_id}:vouchers`, v.claim_token);
}

export async function getVoucherByToken(token: string): Promise<Voucher | null> {
  return kv.get<Voucher>(`voucher:token:${token}`);
}

export async function getUserVouchers(userId: string): Promise<Voucher[]> {
  const tokens = await kv.lrange<string>(`user:${userId}:vouchers`, 0, -1);
  if (!tokens.length) return [];
  const vouchers = await Promise.all(
    tokens.map((t) => kv.get<Voucher>(`voucher:token:${t}`))
  );
  return vouchers.filter(Boolean) as Voucher[];
}

export async function updateVoucher(
  token: string,
  patch: Partial<Voucher>
): Promise<Voucher | null> {
  const existing = await getVoucherByToken(token);
  if (!existing) return null;
  const updated = { ...existing, ...patch, updated_at: new Date().toISOString() };
  await saveVoucher(updated);
  return updated;
}
```

### 3. Cập nhật tất cả API routes sang `async`

Các hàm db hiện tại là sync (SQLite), sau khi migrate sang KV sẽ là async. Cần thêm `await`:

**`app/api/vouchers/route.ts`:**
```typescript
saveVoucher(voucher);
// → thay thành:
await saveVoucher(voucher);

getUserVouchers(userId)
// → thay thành:
await getUserVouchers(userId)
```

**`app/api/claim/[token]/route.ts`:**
```typescript
getVoucherByToken(params.token)
// → thay thành:
await getVoucherByToken(params.token)

updateVoucher(...)
// → thay thành:
await updateVoucher(...)
```

### 4. Tạo KV Store trên Vercel

Sau khi deploy (bước dưới), vào Vercel Dashboard:
- Tab **Storage** → **Create Database** → **KV**
- Chọn region gần nhất (Singapore)
- Click **Connect to Project** → tự inject env vars

---

## Option B — Migrate sang Supabase

### 1. Tạo project Supabase

1. Vào [supabase.com](https://supabase.com) → New Project
2. Lưu lại: **Project URL**, **anon key**, **service_role key**

### 2. Chạy migration SQL

Vào Supabase Dashboard → SQL Editor → chạy:

```sql
CREATE TABLE IF NOT EXISTS vouchers (
  id TEXT PRIMARY KEY,
  claim_token TEXT UNIQUE NOT NULL,
  creator_id TEXT,
  creator_name TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  fine_print TEXT,
  occasion TEXT NOT NULL,
  tone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  recipient_name TEXT,
  theme_id TEXT DEFAULT 'retro',
  primary_color TEXT DEFAULT '#FF6B6B',
  font_family TEXT DEFAULT 'Nunito',
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  claimed_by TEXT,
  used_at TIMESTAMPTZ,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- Public read cho claim page (không cần auth)
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active vouchers" ON vouchers FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON vouchers USING (true) WITH CHECK (true);
```

### 3. Cài dependency

```bash
npm install @supabase/supabase-js
```

### 4. Thay thế `lib/voucher/db.ts`

```typescript
import { createClient } from "@supabase/supabase-js";
import { Voucher } from "@/types/voucher";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function saveVoucher(v: Voucher): Promise<void> {
  await supabase.from("vouchers").upsert(v);
}

export async function getVoucherByToken(token: string): Promise<Voucher | null> {
  const { data } = await supabase
    .from("vouchers")
    .select("*")
    .eq("claim_token", token)
    .single();
  return data;
}

export async function getUserVouchers(userId: string): Promise<Voucher[]> {
  const { data } = await supabase
    .from("vouchers")
    .select("*")
    .eq("creator_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function updateVoucher(
  token: string,
  patch: Partial<Voucher>
): Promise<Voucher | null> {
  const existing = await getVoucherByToken(token);
  if (!existing) return null;
  const updated = { ...existing, ...patch, updated_at: new Date().toISOString() };
  const { data } = await supabase
    .from("vouchers")
    .upsert(updated)
    .select()
    .single();
  return data;
}
```

---

## Deploy lên Vercel

### Bước 1 — Push code lên GitHub

```bash
cd /Users/tudm/TEST/voucher-ai
git init
git add .
git commit -m "feat: VoucherAI MVP"
gh repo create voucher-ai --public --source=. --push
# hoặc tạo repo thủ công trên github.com rồi git remote add origin ...
```

### Bước 2 — Import vào Vercel

1. Vào [vercel.com](https://vercel.com) → **Add New Project**
2. Import repo GitHub vừa tạo
3. Framework: **Next.js** (tự detect)
4. Root Directory: để trống (nếu repo root là project)

### Bước 3 — Set Environment Variables

Trong Vercel → Project Settings → **Environment Variables**, thêm:

| Key | Value | Environment |
|-----|-------|-------------|
| `OPENAI_API_KEY` | `sk-proj-...` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-app-git-main.vercel.app` | Preview |
| `NEXT_PUBLIC_APP_NAME` | `VoucherAI` | All |

**Nếu dùng Vercel KV** (thêm sau khi tạo KV store — tự inject):
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

**Nếu dùng Supabase:**
- `SUPABASE_URL` — `https://xxx.supabase.co`
- `SUPABASE_SERVICE_KEY` — service_role key (không phải anon key)

### Bước 4 — Xoá config SQLite khỏi next.config.mjs

Sau khi migrate xong storage, xoá dòng sau trong `next.config.mjs`:

```js
// Xoá dòng này:
serverComponentsExternalPackages: ["better-sqlite3"],
```

### Bước 5 — Deploy

Click **Deploy** trên Vercel. Build log sẽ hiện ở dashboard.

Build thành công khi thấy:
```
✓ Compiled successfully
✓ Generating static pages
```

---

## Chạy local với production config

```bash
# Test với env vars production
OPENAI_API_KEY=sk-... NEXT_PUBLIC_APP_URL=http://localhost:3000 npm run build && npm start
```

---

## Custom Domain

Vercel Dashboard → Project → **Settings** → **Domains** → Add domain.

Cần trỏ DNS:
- `CNAME` record: `www` → `cname.vercel-dns.com`
- `A` record: `@` → `76.76.21.21`

---

## Troubleshooting

| Lỗi | Nguyên nhân | Fix |
|-----|-------------|-----|
| `Cannot find module 'better-sqlite3'` | Native module không support | Migrate sang KV/Supabase (bắt buộc) |
| `OPENAI_API_KEY is not defined` | Chưa set env var | Thêm vào Vercel Environment Variables |
| `fetch failed` khi gọi OpenAI | Network timeout | Tăng `maxDuration` trong route: `export const maxDuration = 30;` |
| Claim link 404 | `NEXT_PUBLIC_APP_URL` sai | Set đúng domain production |
| Build fail: `Type error` | TypeScript strict | Chạy `npm run build` local trước khi push |

---

## Giới hạn Vercel Free Tier

| Giới hạn | Free | Pro |
|----------|------|-----|
| Serverless function timeout | 10s | 60s |
| Bandwidth | 100GB/tháng | 1TB/tháng |
| Deployments | Unlimited | Unlimited |
| Custom domains | Unlimited | Unlimited |

> **Lưu ý:** OpenAI call có thể mất 5–8s. Nếu timeout, thêm `export const maxDuration = 30;` vào `app/api/ai/generate/route.ts` (chỉ có trên Pro plan).
