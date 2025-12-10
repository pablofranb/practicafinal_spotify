'use client';

import Header from "@/components/Header";
import ArtistWidget from "@/components/widgets/ArtistWidget";
import TrackWidget from "@/components/widgets/TrackWidget";
import GenreWidget from "@/components/widgets/GenreWidget";
import DecadeWidget from "@/components/widgets/DecadeWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay";
import PopularityWidget from "@/components/widgets/PopularityWidget";
import HistorialWidget from "@/components/widgets/HistorialWidget";
import { useState, useEffect } from 'react';
import { generatePlaylist, mezclarCanciones } from "@/lib/spotify";

export default function DashboardPage() {
  const [accessToken, setAccessToken] = useState(null); //donde guardare el token
  const [artistasfav, Setartistasfav] = useState([]); //inicio vacio
  const [cancionesfav, Setcancionesfav] = useState([]); //inicio vacio
  const [generosfav, Setgenerosfav] = useState([]); //inicio vacio
  const [playlist, SetPlaylist] = useState([]);
  const [favoritosplaylist, Setfavoritosplaylist] = useState([]);
  const [decadasfav, Setdecadasfav] = useState([]); //inicio vacio
  const [popularityRange, setPopularityRange] = useState([0, 100]);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false); //mientras carga

  //parte de añadir
  const [mostrarTrackWidget, setMostrarTrackWidget] = useState(false); //con este controlo si muestro el widget de buscar cancion

  const [elegirpag, Setelegirpag] = useState("home");

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
  const generacionPlaylist = async () => {
    try {
      setLoadingPlaylist(true);
      const preferences = {
        artists: artistasfav,
        genres: generosfav,
        decades: decadasfav,
        popularity: popularityRange,
      };

      // Llamamos a la función de lib/spotify.js
      let lista = await generatePlaylist(preferences);

      // Mezclamos como tú quieres
      lista = mezclarCanciones(lista).slice(0, 30);

      // Guardamos en estado
      SetPlaylist(lista);
      setLoadingPlaylist(false);
    } catch (err) {
      console.error("Error generando playlist:", err);
    }
  };

  //<button className={styles.agregarcan} onClick={() => agregarcancion(track)}>AÑADIR CANCION</button>
  //funcion para abrir el widget con mostrarTrackWidget
  const abrirTrackWidget = () => {
    if (mostrarTrackWidget === false) {
      setMostrarTrackWidget(true);
    } else {
      setMostrarTrackWidget(false);
    }
  };

  const añadirCancionAPlaylist = (track) => {
    SetPlaylist(prev => [...prev, track]);
    setMostrarTrackWidget(false);
  };

  const Elegirpagina = () => {

  if (elegirpag === "home") {
    return (
      <>
        {/* artistGenreRow */}
        <div className="
          flex justify-center items-stretch gap-[50px] w-full 
          my-[40px] px-[40px]
          max-[900px]:flex-col max-[900px]:items-center max-[900px]:gap-[30px] max-[900px]:px-[20px]
        ">
          
          {/* PANEL ARTISTAS */}
          <div className="
            flex-1 max-w-[48%] p-[25px] rounded-[15px] bg-[#000000dd] 
            border border-[#1DB95444] box-border
            max-[900px]:max-w-full
          ">
            <ArtistWidget token={accessToken} artistasfav={artistasfav} Setartistasfav={Setartistasfav} />
          </div>

          {/* PANEL GÉNEROS */}
          <div className="
            flex-1 max-w-[48%] p-[25px] rounded-[15px] bg-[#000000dd] 
            border border-[#1DB95444] box-border
            max-[900px]:max-w-full
          ">
            <GenreWidget token={accessToken} generosfav={generosfav} Setgenerosfav={Setgenerosfav} />
          </div>

          {/* PANEL DÉCADAS + POPULARIDAD */}
          <div className="
            flex-1 max-w-[48%] bg-[#000000dd] p-[25px] rounded-[15px]
            border border-[#1DB95444] box-border 
            flex flex-col gap-[30px]
            max-[900px]:w-full
          ">
            <div className="bg-black border border-[#1DB95444] rounded-[12px] p-[20px]">
              <DecadeWidget token={accessToken} decadasfav={decadasfav} Setdecadasfav={Setdecadasfav} />
            </div>

            <div className="bg-black border border-[#1DB95444] rounded-[12px] p-[20px]">
              <PopularityWidget popularityRange={popularityRange} setPopularityRange={setPopularityRange} />
            </div>
          </div>
        </div>

        {/* BOTÓN GENERAR */}
        <div className="w-full flex justify-center my-[40px] mb-[20px]">
          <button
            onClick={generacionPlaylist}
            className="bg-[#1DB954] text-black px-[32px] py-[14px] rounded-[30px] text-[18px] font-bold cursor-pointer hover:bg-[#1ed760]"
          >
            Generar Playlist
          </button>

          {loadingPlaylist && <p className="text-[#1DB954] ml-4"> Generando playlist...</p>}
        </div>

        {/* PLAYLIST */}
        <PlaylistDisplay
          playlist={playlist}
          favoritosplaylist={favoritosplaylist}
          Setfavoritosplaylist={Setfavoritosplaylist}
          SetPlaylist={SetPlaylist}
          abrirTrackWidget={abrirTrackWidget}
        />

        {/* WIDGET PARA AÑADIR CANCIÓN */}
        {mostrarTrackWidget && (
          <TrackWidget
            token={accessToken}
            cancionesfav={cancionesfav}
            Setcancionesfav={Setcancionesfav}
            añadirCancionAPlaylist={añadirCancionAPlaylist}
          />
        )}
      </>
    );
  }

  if (elegirpag === "historial") {
    return (
      <div className="mt-10">
        <HistorialWidget SetPlaylist={SetPlaylist} />
      </div>
    );
  }
  //parte de favoritos
  if (elegirpag === "favoritos") {
    return (
      <div className="p-10 text-white">

        {/* FAVORITOS: ARTISTAS */}
        <h2 className="text-2xl font-bold mb-4">Artistas Favoritos</h2>
        {artistasfav.length === 0 ? (
          <p className="text-gray-400">No tienes artistas favoritos.</p>
        ) : (
          <div className="flex gap-6 flex-wrap">
            {artistasfav.map(art => (
              <div key={art.id} className="bg-[#111] p-4 rounded-lg border border-[#1DB954]">
                <img src={art.images?.[0]?.url} className="w-32 h-32 rounded-md object-cover" />
                <p className="mt-2 font-semibold">{art.name}</p>
              </div>
            ))}
          </div>
        )}

        {/* FAVORITOS: CANCIONES */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Canciones Favoritas</h2>
        {cancionesfav.length === 0 ? (
          <p className="text-gray-400">No tienes canciones favoritas.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {cancionesfav.map(track => (
              <div key={track.id} className="bg-[#111] p-4 rounded-lg border border-[#1DB954]">
                <img src={track.album.images?.[0]?.url} className="w-32 h-32 rounded-md" />
                <p className="mt-2 font-semibold">{track.name}</p>
                <p className="text-sm text-gray-400">{track.artists[0].name}</p>
              </div>
            ))}
          </div>
        )}

        {/* FAVORITOS: PLAYLIST */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Favoritos de la Playlist</h2>
        {favoritosplaylist.length === 0 ? (
          <p className="text-gray-400">No tienes canciones marcadas como favoritas.</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {favoritosplaylist.map(track => (
              <div key={track.id} className="bg-[#111] p-4 rounded-lg border border-[#1DB954]">
                <img src={track.album.images?.[0]?.url} className="w-32 h-32 rounded-md" />
                <p className="mt-2 font-semibold">{track.name}</p>
                <p className="text-sm text-gray-400">{track.artists[0].name}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    );
  }

  return null;
};


  return (
  <div>
    
    <Header elegirpag={elegirpag} Setelegirpag={Setelegirpag} />
    <div className="pt-[80px]">
    {Elegirpagina()}
    </div>
  </div>
);

}
