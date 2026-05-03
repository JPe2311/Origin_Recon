import { Appointment } from '@/lib/types/domain';

export function DayCalendar({ appointments }: { appointments: Appointment[] }) {
  return (
    <div className="card">
      <h2 className="mb-3 text-lg font-semibold">Calendario Diario</h2>
      <div className="space-y-2">
        {appointments.map((a) => (
          <div key={a.id} className="rounded border p-3">
            <p className="font-medium">{a.patientName} - {a.status}</p>
            <p className="text-sm text-slate-600">{a.date} · {a.durationMinutes} min</p>
          </div>
        ))}
      </div>
    </div>
  );
}
