"use client";
import { useState, useEffect } from "react";
import styles from "./HistorialWidget.module.css";

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
    <div className={styles.historialBox}>
      <button className={styles.toggleButton} onClick={() => setMostrar(!mostrar)}>
        {mostrar ? "Ocultar historial" : "Ver historial"}
      </button>

      {mostrar && (
        <div className={styles.historialLista}>
          {historial.length === 0 ? (
            <p className={styles.empty}>No hay playlists guardadas.</p>
          ) : (
            historial.map((item, i) => (
              <div key={i} className={styles.historialItem}>
                <p className={styles.fecha}>{item.fecha}</p>

                <button
                  className={styles.loadButton}
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
