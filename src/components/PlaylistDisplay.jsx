"use client";
import { useState, useEffect } from "react";

const PlaylistDisplay = ({ playlist, favoritosplaylist, Setfavoritosplaylist, SetPlaylist, abrirTrackWidget }) => {
  const [mostrar, setMostrar] = useState(false);

  //añadir al localstorage
  useEffect(() => {
    localStorage.setItem("favoritos palylist", JSON.stringify(favoritosplaylist));
    console.log({ favoritosplaylist });
  }, [favoritosplaylist]);   //cada vez que modifico favoritas lo añado al local storage

  // Guarda cada playlist generada
  useEffect(() => {
    if (playlist.length === 0) return;

    let prev = JSON.parse(localStorage.getItem("historial") || "[]");

    prev.unshift({
      fecha: new Date().toLocaleString(),
      lista: playlist
    });

    localStorage.setItem("historial", JSON.stringify(prev));
  }, [playlist]);


  const esFavorito = (cancion) => {
    return favoritosplaylist.some(f => f.id === cancion.id);
  };

  const favoritos = (track) => {
    const existe = esFavorito(track);
    let auxfav = [...favoritosplaylist];

    if (!existe) auxfav.push(track);
    else auxfav = auxfav.filter(a => a.id !== track.id);

    Setfavoritosplaylist(auxfav);
  };

  const eliminarcancion = (track) => {
    let auxeliminar = [...playlist];
    auxeliminar = auxeliminar.filter(a => a.id !== track.id);
    SetPlaylist(auxeliminar);
  };

  return (
    <div className="bg-black p-5 rounded-xl text-white max-w-[700px] mx-auto">
      <h2>Playlist Generada</h2>

      <button
        className="bg-[#1DB954] border-none px-[18px] py-[10px] rounded-[8px] font-bold cursor-pointer text-black mb-[10px] hover:bg-[#1ed760]"
        onClick={() => setMostrar(!mostrar)}
      >
        {mostrar ? "Ocultar Playlist" : "Mostrar Playlist"}
      </button>

      <button
        className="float-right mr-[15px] bg-transparent border border-[#1DB954] text-[#1DB954] px-[12px] py-[6px] rounded-[6px] cursor-pointer hover:bg-[#1DB954] hover:text-black"
        onClick={abrirTrackWidget}
      >
        + Añadir canción
      </button>

      {mostrar && (
        <div className="mt-[15px] flex flex-col gap-[10px] max-h-[450px] overflow-y-auto pr-[5px]">
          {playlist.length === 0 ? (
            <p>No hay canciones aún.</p>
          ) : (
            playlist.map(track => (
              <div
                key={track.id}
                className="flex items-center gap-[15px] bg-[#111] px-[14px] py-[10px] rounded-[8px] border border-[#222]"
              >
                <img
                  src={track.album?.images?.[0]?.url || "/no-image.png"}
                  width="90"
                  className="w-[60px] h-[60px] rounded-[6px] object-cover"
                />

                <button
                  className="bg-transparent border-none text-[22px] ml-auto text-white hover:scale-125 hover:text-[#1DB954]"
                  onClick={() => favoritos(track)}
                >
                  {esFavorito(track) ? "❤️" : "🤍"}
                </button>

                <div className="flex flex-col flex-1 justify-center">
                  <p className="m-0 font-bold text-[15px]">{track.name}</p>
                  <p className="m-0 text-[13px] text-[#b3b3b3]">
                    {track.artists?.[0]?.name || "Artista desconocido"}
                  </p>
                </div>

                <button
                  className="bg-transparent border border-[#ff4d4d] text-[#ff4d4d] px-[12px] py-[6px] rounded-[6px] text-[12px] cursor-pointer hover:bg-[#ff4d4d] hover:text-white"
                  onClick={() => eliminarcancion(track)}
                >
                  ELIMINAR
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistDisplay;

