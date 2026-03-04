const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateToken(length = 12): string {
  let result = "";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  Array.from(array).forEach((byte) => {
    result += CHARS[byte % CHARS.length];
  });
  return result;
}

export function isValidToken(token: string): boolean {
  return /^[a-z0-9]{12}$/.test(token);
}
