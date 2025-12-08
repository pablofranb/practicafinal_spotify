"use client";
import { useState } from "react";
import styles from "./PlaylistDisplay.module.css";


const PlaylistDisplay = ({ playlist }) => {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className={styles.playlistDisplay}>
        <h2>Playlist Generada</h2>
        <button className={styles.botonPlaylist} onClick={() => setMostrar(!mostrar)}>
        {mostrar ? "Ocultar Playlist" : "Mostrar Playlist"}
        </button>
        {mostrar && (
            <div className={styles.listaPlaylist}>
                {playlist.length === 0 ? (
                    <p>No hay canciones aún.</p>
                ) : (playlist.map(track => (
                        <div key={track.id} className={styles.trackItem}>
                        <img src={track.album?.images?.[0]?.url || "/no-image.png"}width="90"/>

            <div className={styles.info}>
              <p className={styles.titulo}>{track.name}</p>
              <p className={styles.artista}>
                {track.artists?.[0]?.name || "Artista desconocido"}
                    </p>
                    </div>
                </div>
                ))
            )}
            </div>
        )}
        </div>

    );
};

export default PlaylistDisplay;
