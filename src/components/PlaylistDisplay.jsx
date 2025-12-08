"use client";
import { useState, useEffect } from "react";
import styles from "./PlaylistDisplay.module.css";


const PlaylistDisplay = ({ playlist,favoritosplaylist,Setfavoritosplaylist}) => {
  const [mostrar, setMostrar] = useState(false);
  //añadir al localstorage
      useEffect( () => {
          localStorage.setItem("favoritos", JSON.stringify(favoritosplaylist));
          console.log({favoritosplaylist})
      }, [favoritosplaylist]);   //cada vez que modifico favoritas lo añado al local storage
  
    const esFavorito=(cancion)=>{
        return favoritosplaylist.some(f => f.id === cancion.id);
    }
    const favoritos=(track)=>{
        const existe=esFavorito(track)
        let auxfav=[...favoritosplaylist] //le paso la lista de favoritos
        if(existe===false){
            auxfav.push(track)
        }
        else{
            
            auxfav = auxfav.filter(a => a.id !== track.id);//nueva lista con los que tienen un id distinto al que necesito
        }
        Setfavoritosplaylist(auxfav)
    }
  
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
                        <button className={styles.favButton} onClick={() => favoritos(track)}> { esFavorito(track) ? "❤️" : "🤍"}</button>

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
