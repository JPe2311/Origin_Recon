'use client';
import Link from 'next/link';
import { Role } from '@/lib/types/domain';

export function Sidebar({ role }: { role: Role }) {
  const links = {
    MEDICO: ['/dashboard', '/appointments', '/patients'],
    SECRETARIA: ['/dashboard', '/appointments', '/patients'],
    PACIENTE: ['/appointments']
  }[role];

  return (
    <aside className="w-64 min-h-screen border-r bg-white p-4">
      <h1 className="text-xl font-bold text-brand-700">Bruno Doctor</h1>
      <nav className="mt-6 space-y-2">
        {links.map((href) => <Link className="block rounded px-3 py-2 hover:bg-slate-100" href={href} key={href}>{href}</Link>)}
      </nav>
    </aside>
  );
}
