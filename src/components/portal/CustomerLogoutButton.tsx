'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function CustomerLogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/customer/auth/logout', { method: 'POST' });
      router.push('/portal/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-750"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  );
}
