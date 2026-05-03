'use client';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase/client';

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="card w-full max-w-md text-center">
        <h1 className="text-2xl font-bold">Ingresar a Bruno Doctor</h1>
        <button className="mt-4 rounded bg-brand-500 px-4 py-2 text-white" onClick={() => signInWithPopup(auth, googleProvider)}>
          Continuar con Google
        </button>
      </div>
    </main>
  );
}
