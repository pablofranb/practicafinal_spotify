'use client'
import {useState,useEffect} from 'react'
import { getAccessToken,refreshAccessToken } from "@/lib/auth";

const ArtistWidget = ({token, artistasfav,Setartistasfav})=>{

    const[artistas,Setartistas]=useState([])
    const[busqueda,Setbusqueda]=useState("")
    let aux;
    
    
    //añadir al localstorage
    useEffect( () => {
        localStorage.setItem("favoritos", JSON.stringify(artistasfav));
        console.log({artistasfav})
    }, [artistasfav]);   //cada vez que modifico favoritas lo añado al local storage
    
    
    //al pulsar el boton guardo la busqueda
    const guardarBusqueda=(e)=>{
        Setbusqueda(e.target.value)
    };
    //compruebo si estaba en favoritos porque ante me guardaba todos o ninguno
    const esFavorito = (artista) => {
      return artistasfav.some(a => a.id === artista.id);
    };
    const favoritos=(artista)=>{
        const existe=esFavorito(artista)
        let auxfav=[...artistasfav] //le paso la lista de favoritos
        if(existe===false){
            auxfav.push(artista)
        }
        else{
            
            auxfav = auxfav.filter(a => a.id !== artista.id);//nueva lista con los que tienen un id distinto al que necesito
        }
        Setartistasfav(auxfav)
    }
    //debug
    useEffect(() => {
        const t = setTimeout(() => {
        if (busqueda.length > 0) Buscarserie(); 
         }, 400);
        return () => clearTimeout(t);
    }, [busqueda]);
    
    //con esto guardo las series
    const Buscarserie=async ()=>{
        //fetch
        const aux2=await fetch(`https://api.spotify.com/v1/search?type=artist&q=${busqueda}&limit=5`,
                {
                headers: { Authorization: `Bearer ${token}` }
                });
        //paso los datos a json
        const datos= await aux2.json() //necesito el json no el array
        //los guardo en artistas
        Setartistas(datos.artists.items || []);
        
        //si la dimension de artistas es 0
        }
        if (artistas.length === 0) {
             aux = <p>No hay resultados</p>;
        } 
        else {
            //mapeo y enseño el nombre y la imagen
            aux = artistas.map((artista) => (
                <div key={artista.id} className="flex flex-col items-center">
                    <p className="mt-1 mb-1 text-[16px] font-bold text-[#1DB954] text-center">{artista.name}</p>
                    <img 
                      src={artista.images[0]?.url} 
                      width="80" 
                      className="w-[120px] h-[120px] rounded-[10px] object-cover border border-[#1DB95440]"
                    />
                    <button 
                      id="fav" 
                      onClick={() => favoritos(artista)}
                      className="mt-[6px] bg-transparent border-none text-[22px] cursor-pointer text-[#1DB954] hover:text-white"
                    >
                        { esFavorito(artista) ? "❤️" : "🤍"}
                    </button>
                </div>
             ));
        }
    

return (
   
    <div className="bg-black p-5 rounded-xl text-[#1DB954] w-fit mx-auto mt-5 border border-[#1DB95440]">
      <form className="flex flex-col gap-[6px] mb-[10px] text-[#1DB954]" onSubmit={Buscarserie}>
        <h1 className="flex flex-col gap-[6px] mb-[10px] text-[#1DB954]">BUSCADOR DE ARTISTAS</h1>

        <label className="flex flex-col gap-[6px] mb-[10px] text-[#1DB954]"> Buscador </label>
        <input
          type="text"
          onChange={guardarBusqueda}
          value={busqueda}
          placeholder="Búsqueda de artistas"
          className="p-[10px] rounded-[8px] border border-[#1DB95460] bg-black text-[#1DB954] w-[250px] text-[14px]"
        />
      </form>

        <div className="mt-5 flex gap-5 py-[10px] overflow-x-auto">  
            {busqueda.length > 0 && aux}
        </div>

    </div>
)
}

export default ArtistWidget;
