'use client';

export default function OnboardingPage() {
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-4">Onboarding de Paciente</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 card">
        {['Nombre completo', 'WhatsApp', 'Email', 'Dirección', 'DNI'].map((f) => (
          <label key={f} className="text-sm">{f}<input className="mt-1 w-full rounded border p-2" /></label>
        ))}
      </form>
    </main>
  );
}
