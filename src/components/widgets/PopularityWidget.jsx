'use client'
import { useState, useEffect } from "react";

const PopularityWidget = ({ popularityRange, setPopularityRange }) => {

  const [mostrar, setMostrar] = useState(false);

  const OPTIONS = [
    { label: "Mainstream (80-100)", min: 80, max: 100 },
    { label: "Popular (50-80)", min: 50, max: 80 },
    { label: "Underground (0-50)", min: 0, max: 50 }
  ];

  // Saber si esta opción está activa
  const estactivada = (min, max) =>
    popularityRange[0] === min && popularityRange[1] === max;

  // Guardar selección
  const elegiropcion = (min, max) => {
    setPopularityRange([min, max]);
  };

  return (
    <div className="flex flex-col w-full">
      <button
        className="bg-[#1DB954] border-none px-[18px] py-[10px] rounded-[8px] text-black font-bold cursor-pointer mb-[12px]"
        onClick={() => setMostrar(!mostrar)}
      >
        {mostrar ? "Ocultar popularidad" : "Mostrar popularidad"}
      </button>

      {mostrar && (
        <ul className="flex flex-col gap-[12px] list-none pl-0">
          {OPTIONS.map(opt => (
            <li
              className="flex items-center justify-between bg-[#111] text-[#1DB954] px-[12px] py-[8px] rounded-[8px] border border-[#1DB95444]"
              key={opt.label}
            >
              {opt.label}

              <button
                onClick={() => elegiropcion(opt.min, opt.max)}
                className="bg-transparent cursor-pointer text-[20px]"
              >
                {estactivada(opt.min, opt.max) ? "❤️" : "🤍"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PopularityWidget;

