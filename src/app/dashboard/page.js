'use client';

import Header from "@/components/Header";
import ArtistWidget from "@/components/widgets/ArtistWidget";
import TrackWidget from "@/components/widgets/TrackWidget";
import GenreWidget from "@/components/widgets/GenreWidget";
import { useState, useEffect } from 'react';
import { getAccessToken } from "@/lib/auth";

export default function DashboardPage() {
  const [accessToken, setAccessToken] = useState(null);//donde guardare el token
  const[artistasfav,Setartistasfav]=useState([])//inicio vacio
  const[cancionesfav,Setcancionesfav]=useState([])//inicio vacio
  useEffect(() => {
  async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    //comprueba si existe refresh token
    if (!refreshToken) {
          console.error("No hay refresh token, redirigiendo al login...");
          window.location.href = "/";
          return null;
      }
  const response = await fetch('/api/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  const data = await response.json();
  //MANEJAR ERRORES FETCH
   if (!response.ok) {
        console.error("Error al refrescar token:", data.error);
        window.location.href = "/";
        return null;
      }
  localStorage.setItem('spotify_token', data.access_token);
  const expirationTime = Date.now() + data.expires_in * 1000;
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
  
  return data.access_token;
} 
  
  async function loadToken() {
    const newToken = await refreshAccessToken();
    setAccessToken(newToken);
  }
  loadToken(); 
  }, []);

  if (!accessToken) return <p>Cargando Spotify...</p>;
  return (
    <div>
      <Header />
      <ArtistWidget token={accessToken} artistasfav={artistasfav} Setartistasfav={Setartistasfav} />
      <TrackWidget token={accessToken} cancionesfav={cancionesfav} Setcancionesfav={Setcancionesfav} />
      <GenreWidget token={accessToken} />
    </div>
  );
}
