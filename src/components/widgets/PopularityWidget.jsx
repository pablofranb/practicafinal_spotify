'use client'
import { useState, useEffect } from "react";
import styles from "./PopularityWidget.module.css";

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
    <div className={styles.popularidad}>
      <button
        className={styles.botonpopularidad}
        onClick={() => setMostrar(!mostrar)}
      >
        {mostrar ? "Ocultar popularidad" : "Mostrar popularidad"}
      </button>

      {mostrar && (
        <ul className={styles.lista}>
          {OPTIONS.map(opt => (
            <li className={styles.item} key={opt.label}>
              {opt.label}

              <button onClick={() => elegiropcion(opt.min, opt.max)}>
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
