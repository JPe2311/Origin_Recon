import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardPage() {
  return (
    <div className="flex">
      <Sidebar role="MEDICO" />
      <main className="flex-1 p-6 space-y-4">
        <h1 className="text-2xl font-bold">Panel de Analítica</h1>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {['Total citas', 'Completadas', 'No-show %', 'Canceladas'].map((k) => (
            <article key={k} className="card"><p className="text-sm text-slate-500">{k}</p><p className="text-2xl font-semibold">--</p></article>
          ))}
        </section>
      </main>
    </div>
  );
}
