'use client';

import Header from "@/components/Header";
import ArtistWidget from "@/components/widgets/ArtistWidget";
import TrackWidget from "@/components/widgets/TrackWidget";
import GenreWidget from "@/components/widgets/GenreWidget";
import DecadeWidget from "@/components/widgets/DecadeWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay";
import PopularityWidget from "@/components/widgets/PopularityWidget";
import { useState, useEffect } from 'react';
import { getAccessToken } from "@/lib/auth";
import { generatePlaylist, mezclarCanciones } from "@/lib/spotify";

export default function DashboardPage() {
  const [accessToken, setAccessToken] = useState(null);//donde guardare el token
  const[artistasfav,Setartistasfav]=useState([])//inicio vacio
  const[cancionesfav,Setcancionesfav]=useState([])//inicio vacio
  const[generosfav,Setgenerosfav]=useState([])//inicio vacio
  const[playlist,SetPlaylist]=useState([])
  const [favoritosplaylist,Setfavoritosplaylist]=useState([])
  const[decadasfav,Setdecadasfav]=useState([])//inicio vacio
  const [popularityRange, setPopularityRange] = useState([0, 100]);
  //parte de añadir
  const [mostrarTrackWidget, setMostrarTrackWidget] = useState(false); //con este controlo si muestro el widget de buscar cancion
  
  //parte de generar
  const preferences = {
  artists: artistasfav,
  genres: generosfav,
  decades: [],         // si no usas décadas, se deja vacío
  popularity: null     // si no usas popularidad, va null
};

  
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
  try {
    const preferences = {
      artists: artistasfav,
      genres: generosfav,
      decades: decadasfav,
      popularity: popularityRange,
    };

    // Llamamos a la función de lib/spotify.js
    let lista = await generatePlaylist(preferences);

    // Mezclo
    lista = mezclarCanciones(lista).slice(0, 30);

    SetPlaylist(lista);

  } catch (err) {
    console.error("Error generando playlist:", err);
  }
};


 //<button className={styles.agregarcan} onClick={() => agregarcancion(track)}>AÑADIR CANCION</button>
 //funcion para abrir el widget con mostrarTrackWidget
const abrirTrackWidget = () => {
  if(mostrarTrackWidget===false){ 
  setMostrarTrackWidget(true);
  }
  else{
    setMostrarTrackWidget(false)
  }
};

const añadirCancionAPlaylist = (track) => {
  SetPlaylist(prev => [...prev, track]);
  setMostrarTrackWidget(false);
};

  return (
    <div>
      <Header />
      <div className="artistGenreRow">
      <ArtistWidget token={accessToken} artistasfav={artistasfav} Setartistasfav={Setartistasfav} />
      <GenreWidget token={accessToken} generosfav={generosfav} Setgenerosfav={Setgenerosfav} />
       
      <DecadeWidget token={accessToken} decadasfav={decadasfav} Setdecadasfav={Setdecadasfav} />
     
      
      </div>
      <div className="generateWrapper">
      <button onClick={generacionPlaylist} className="botonGenerar">
        Generar Playlist
      </button>
      </div>
      <PlaylistDisplay playlist={playlist}  favoritosplaylist={favoritosplaylist} Setfavoritosplaylist={Setfavoritosplaylist} SetPlaylist={SetPlaylist} abrirTrackWidget={abrirTrackWidget} />
      {mostrarTrackWidget && (
          <TrackWidget token={accessToken} cancionesfav={cancionesfav} Setcancionesfav={Setcancionesfav}  añadirCancionAPlaylist={añadirCancionAPlaylist}/>
        )
      }

    </div>
  );
}
