'use client';

import Header from "@/components/Header";
import ArtistWidget from "@/components/widgets/ArtistWidget";
import TrackWidget from "@/components/widgets/TrackWidget";
import GenreWidget from "@/components/widgets/GenreWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay";
import { useState, useEffect } from 'react';
import { getAccessToken } from "@/lib/auth";

export default function DashboardPage() {
  const [accessToken, setAccessToken] = useState(null);//donde guardare el token
  const[artistasfav,Setartistasfav]=useState([])//inicio vacio
  const[cancionesfav,Setcancionesfav]=useState([])//inicio vacio
  const[generosfav,Setgenerosfav]=useState([])//inicio vacio
  const[playlist,SetPlaylist]=useState([])
  const [favoritosplaylist,Setfavoritosplaylist]=useState([])
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

 const mezclarCanciones = (arr) => {
  let copia = [...arr];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]]; // intercambio correcto
  }

  return copia;
};


  const generacionPlaylist = async () => {
    if (!accessToken) {
      console.error("Token no disponible");
      return;
    }
    let listaFinal = [];
    // 1. CANCIONES FAVORITAS
        if (cancionesfav.length > 0) {
          const mezcladas = mezclarCanciones(cancionesfav); //mezclo las canciones
          listaFinal.push(...mezcladas.slice(0, 5)); //añado a la lista 5 atleatorias
        }
      // 2. TOP TRACKS ARTISTAS
    for (const artista of artistasfav) { //for para cada artista fav
        try {
          //fetch
          const resp = await fetch(
            `https://api.spotify.com/v1/artists/${artista.id}/top-tracks?market=ES`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        //transformo
        const datos = await resp.json();
        //sino hay datos salto
        if (!datos || !datos.tracks) {
          continue;
        }
        //mezclo
        const mezcladas = mezclarCanciones(datos.tracks);
        //añado
        listaFinal.push(...mezcladas.slice(0, 5));

      } catch (err) {
        console.error("Error:", artista.name, err);
        }
    }

  
  // 3. CANCIONES POR GÉNERO
  
  for (const genero of generosfav) {
    try {
        // Buscar canciones con el género en el nombre 
        const resp = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=${genero}&limit=50`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const datos = await resp.json();
        //compruebo que datos existe, que tiene tracks y que en traks hay items
        if (!datos || !datos.tracks || !datos.tracks.items) {
          continue;
        }
        const mezcladas = mezclarCanciones(datos.tracks.items);
        listaFinal.push(...mezcladas.slice(0, 5));

    } catch (err) {
      console.error("Error:", genero, err);
    }
  }
  // 4. LIMPIEZA FINAL
  listaFinal = listaFinal.filter(t => t.id!=null);
  // ELIMINAR DUPLICADOS POR ID
  listaFinal = listaFinal.filter(
    (track, index, self) =>
      index === self.findIndex(t => t.id === track.id)
  );
  SetPlaylist(listaFinal);
};

 //<button className={styles.agregarcan} onClick={() => agregarcancion(track)}>AÑADIR CANCION</button>

  return (
    <div>
      <Header />
      <ArtistWidget token={accessToken} artistasfav={artistasfav} Setartistasfav={Setartistasfav} />
      <TrackWidget token={accessToken} cancionesfav={cancionesfav} Setcancionesfav={Setcancionesfav} />
      <GenreWidget token={accessToken} generosfav={generosfav} Setgenerosfav={Setgenerosfav} />
      <button onClick={generacionPlaylist} className="botonGenerar">
        Generar Playlist
      </button>
      
      <PlaylistDisplay playlist={playlist}  favoritosplaylist={favoritosplaylist} Setfavoritosplaylist={Setfavoritosplaylist} SetPlaylist={SetPlaylist}/>
      
    </div>
  );
}
