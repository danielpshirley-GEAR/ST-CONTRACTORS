import { cookies } from 'next/headers';

const ADMIN_TOKEN_COOKIE = 'apex_admin_session';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ApexAdmin2026!Secure';
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || 'super-secret-admin-token-change-in-production';

export interface AdminSession {
  isAuthenticated: boolean;
  username: string;
  role: 'admin';
}

export async function verifyAdminAuth(): Promise<AdminSession> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_TOKEN_COOKIE)?.value;

  if (token && token === ADMIN_SECRET) {
    return {
      isAuthenticated: true,
      username: 'ST Contractors Director',
      role: 'admin',
    };
  }

  return {
    isAuthenticated: false,
    username: '',
    role: 'admin',
  };
}

export function validateAdminCredentials(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function getAdminToken(): string {
  return ADMIN_SECRET;
}

export { ADMIN_TOKEN_COOKIE };
