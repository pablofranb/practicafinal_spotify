'use client'
import {useState, useEffect} from 'react'

const TrackWidget = ({token,cancionesfav,Setcancionesfav,añadirCancionAPlaylist}) =>{
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
        let auxfav=[...cancionesfav] 
        if(existe===false){
            auxfav.push(cancion)
        }
        else{
            auxfav = auxfav.filter(a => a.id !== cancion.id);
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
            <div key={cancion.id} className="flex flex-col items-center gap-2">
                <p className="text-[#1DB954] font-bold text-[16px] text-center">{cancion.name}</p>
                <p className="text-[#1DB954] font-bold text-[16px] text-center">{cancion.artists[0]?.name}</p>
                <img 
                    src={cancion.album.images[0]?.url} 
                    width="80" 
                    className="rounded-[10px] w-[120px] h-[120px] object-cover"
                />
                <button 
                    onClick={() => favoritos(cancion)}
                    className="mt-[6px] bg-transparent border-none text-[22px] cursor-pointer text-[#1DB954] hover:text-white"
                > 
                    {eslacancionfavorita(cancion) ? "❤️" : "🤍"} 
                </button>

                <button
                    onClick={() => añadirCancionAPlaylist(cancion)}
                    className="bg-[#1DB954] text-black px-3 py-1 rounded-md font-semibold hover:bg-[#1ed760] transition"
                >
                    Añadir a playlist
                </button>
            </div>
        ));
    }

    return(
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-5 rounded-xl text-[#1DB954] w-[450px] max-h-[70vh] overflow-y-auto border border-[#1DB954] shadow-[0_0_30px_rgba(0,0,0,0.7)] z-[9999]">
        
        <form className="flex flex-col gap-[6px] text-[#1DB954] mb-[10px]" onSubmit={BuscarCancion}>
            <h1 className="flex flex-col gap-[6px] text-[#1DB954]">Buscador de canciones</h1>

            <label className="flex flex-col gap-[6px] text-[#1DB954]">Buscador</label>

            <input 
                type="text" 
                onChange={guardarBusqueda} 
                value={Busqueda} 
                placeholder="Búsqueda de CANCIONES"
                className="p-[10px] rounded-[8px] border border-gray-400 bg-black text-[#1DB954] w-[250px] text-[14px]"
            />
        </form>

        <div className="mt-[20px] flex flex-col justify-between w-full gap-[20px] py-[10px]">
            {Busqueda.length > 0 && aux}
        </div>

    </div>
    )
}
export default TrackWidget;
