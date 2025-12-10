"use client";
import { useState, useEffect } from "react";

export default function HistorialWidget({ SetPlaylist }) {
  const [historial, setHistorial] = useState([]);
  const [mostrar, setMostrar] = useState(false);

  // Cargar historial al iniciar
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("historial") || "[]");
    setHistorial(data);
  }, []);

  const cargarPlaylist = (lista) => {
    SetPlaylist(lista);
  };

  return (
    <div className="bg-black p-5 rounded-xl border border-[#1DB95455] mt-[25px] text-[#1DB954]">
      <button
        className="bg-[#1DB954] text-black px-[20px] py-[10px] rounded-[8px] font-bold cursor-pointer border-none transition ease-in-out hover:bg-[#1ed760] hover:scale-105"
        onClick={() => setMostrar(!mostrar)}
      >
        {mostrar ? "Ocultar historial" : "Ver historial"}
      </button>

      {mostrar && (
        <div className="mt-[15px] flex flex-col gap-[12px]">
          {historial.length === 0 ? (
            <p className="text-[#aaa] italic">No hay playlists guardadas.</p>
          ) : (
            historial.map((item, i) => (
              <div
                key={i}
                className="bg-[#111] p-[12px] rounded-[10px] border border-[#1DB95433] flex justify-between items-center"
              >
                <p className="text-white text-[14px]">{item.fecha}</p>

                <button
                  className="bg-transparent border border-[#1DB954] text-[#1DB954] px-[12px] py-[6px] rounded-[6px] cursor-pointer transition ease-in-out hover:bg-[#1DB954] hover:text-black"
                  onClick={() => cargarPlaylist(item.lista)}
                >
                  Cargar playlist
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
