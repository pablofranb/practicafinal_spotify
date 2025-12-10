'use client';
import HomePage from "./dashboard/page";


import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
      <>  
         <h1 className="text-xl font-semibold text-white">🎵 Spotify Taste Mixer</h1>
        <button className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400 transition" onClick={handleLogin}>INICIAR SESION </button>
      </>  
  );
}