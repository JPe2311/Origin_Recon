import { Sidebar } from '@/components/layout/sidebar';
import { DayCalendar } from '@/components/calendar/day-calendar';

export default function AppointmentsPage() {
  return <div className="flex"><Sidebar role="SECRETARIA" /><main className="flex-1 p-6"><DayCalendar appointments={[]} /></main></div>;
}
