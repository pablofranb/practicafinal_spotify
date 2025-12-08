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
  const[generosfav,Setgenerosfav]=useState([])//inicio vacio
  const[playlist,SetPlaylist]=useState([])
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

 //GENERACION DE MI PLAYLIST

 const mezclarCanciones = (canciones) => {
  let copia = [...canciones]; 

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // índice aleatorio
    copia[i] = [copia[j]]   // intercambio
    copia[j]= copia[i]
  }

  return copia;
};


  const generacionPlaylist=async ()=>{
    let cancionesaux=[]
    let cancionesartistaaux=[]
    let cancionesgenero=[]
    let listafinalaux=[]
    cancionesaux.push(...cancionesfav)//primero guardo las canciones favoritas
    cancionesaux=mezclarCanciones(cancionesaux)//las mezclo para luegocoger las mejroes
    listafinalaux.push(...cancionesaux.slice(0, 5)); //añado las 5 primeras canciones de la lista mezclada
    //voy a cger las 5 mejores canciones de cada artista
    //fetch
    for(const artista of artistasfav){  
      const aux = await fetch(
      `https://api.spotify.com/v1/artists/${artista.id}/top-tracks?market=ES`,
      { headers: { Authorization: `Bearer ${token}` } }
      );
    const datos= await aux.json();
    cancionesartistaaux.push(...datos.tracks) //array
    cancionesartistaaux=mezclarCanciones(cancionesartistaaux) //mezclo el orden 
    //desempaquetar los elementos de un array dentro de otro array, antes hacia el set pero aqui añado los array y sin los puntos meto array en array y no los datos de dentro
    listafinalaux.push(...cancionesartistaaux.slice(0, 5));
    }
    //añadiremos a la playlist las 5 canciones de cada genero 
    for(const genero of generosfav){ 
    const aux = await fetch(
            `https://api.spotify.com/v1/search?type=track&q=genre:${genero}&limit=50`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    const datos = await aux.json()
    cancionesgenero.push(...datos.tracks.items) //objeto
    cancionesgenero=mezclarCanciones(cancionesgenero)
    listafinalaux.push(...cancionesgenero.slice(0, 5));
    }
    SetPlaylist(listafinalaux)

  }
  return (
    <div>
      <Header />
      <ArtistWidget token={accessToken} artistasfav={artistasfav} Setartistasfav={Setartistasfav} />
      <TrackWidget token={accessToken} cancionesfav={cancionesfav} Setcancionesfav={Setcancionesfav} />
      <GenreWidget token={accessToken} generosfav={generosfav} Setgenerosfav={Setgenerosfav} />
    </div>
  );
}
