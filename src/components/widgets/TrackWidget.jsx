'use client'
import {useState, useEffect} from 'react'
import styles from "./TrackWidget.module.css";

const TrackWidget = ({token,cancionesfav,Setcancionesfav}) =>{
    const [Busqueda,SetBusqueda]=useState("")
    const [canciones,SetCanciones]=useState([])
    let aux
    //añadir al localstorage
    useEffect( () => {
        localStorage.setItem("favoritos", JSON.stringify(cancionesfav));
        console.log({cancionesfav})
    }, [cancionesfav]);   //cada vez que modifico favoritas lo añado al local storage


    const guardarBusqueda=(e)=>{
        SetBusqueda(e.target.value)
    }

    const BuscarCancion =async (e)=>{
        const aux2= await fetch(`https://api.spotify.com/v1/search?type=track&q=${Busqueda}&limit=5`,
                {
                headers: { Authorization: `Bearer ${token}` }
                });
        
        const datos= await aux2.json()
        SetCanciones(datos.tracks?.items || []);
    }
    const eslacancionfavorita =(cancion) =>{
        return cancionesfav.some(a => a.id === cancion.id)
    }

    const favoritos=(cancion)=>{
        const existe=eslacancionfavorita(cancion)
        let auxfav=[...cancionesfav] //le paso la lista de favoritos
        if(existe===false){
            auxfav.push(cancion)
        }
        else{
            
            auxfav = auxfav.filter(a => a.id !== cancion.id);//nueva lista con los que tienen un id distinto al que necesito
        }
        Setcancionesfav(auxfav)
    }
    //debug
    useEffect(() => {
        const t = setTimeout(() => {
        if (Busqueda.length > 0) BuscarCancion(); 
         }, 400);
        return () => clearTimeout(t);
    }, [Busqueda]);
    if(canciones.length===0){
        aux=<p>NO HAY RESULTADOS</p>
    }

    else{
    aux= canciones.map((cancion)=>(
        <div key={cancion.id}>
        <p>{cancion.name}</p>
        <p>{cancion.artists[0]?.name}</p>
        <img src={cancion.album.images[0]?.url} width="80" />
        <button onClick={() => favoritos(cancion)}> {eslacancionfavorita(cancion) ? "❤️" : "🤍"} </button>
        </div>
    ));
    }


    return(
    <div id="cancionesbuscador">
        <form className={styles.forma} onSubmit={BuscarCancion}>
            <h1 className={styles.forma}>Buscador de canciones</h1>
            <label className={styles.forma}>Buscador</label>
            <input type="text" onChange={guardarBusqueda} value={Busqueda} placeholder="Búsqueda de CANCIONES"></input> 
            
        </form>
        <div className={styles.resultados}>{aux}</div>

    </div>


    )













}
export default TrackWidget;