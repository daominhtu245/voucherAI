"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/useUser";
import { logoutUser } from "@/lib/auth/fakeUser";
import { PlusCircle, User, Gift, LogOut, Ticket } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-gradient">VoucherAI</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-primary" : "text-gray-600 hover:text-primary"}`}
          >
            Trang chủ
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/create"
                className="hidden sm:flex items-center gap-2 bg-primary text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-500 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Tạo voucher
              </Link>

              {/* User menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-50 transition-colors">
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user.full_name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {user.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user.full_name}
                  </span>
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4" />
                    Hồ sơ của tôi
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Gift className="w-4 h-4" />
                    Voucher của tôi
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="btn-primary text-sm py-2 px-4"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* Mobile bottom bar */}
      {user && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-50">
          <Link href="/" className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-500 hover:text-primary transition-colors">
            <Gift className="w-5 h-5" />
            <span className="text-xs">Trang chủ</span>
          </Link>
          <Link href="/create" className="flex-1 flex flex-col items-center py-3 gap-1">
            <div className="w-10 h-10 -mt-5 bg-primary rounded-full flex items-center justify-center shadow-voucher">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-primary font-medium">Tạo</span>
          </Link>
          <Link href="/profile" className="flex-1 flex flex-col items-center py-3 gap-1 text-gray-500 hover:text-primary transition-colors">
            <User className="w-5 h-5" />
            <span className="text-xs">Hồ sơ</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
