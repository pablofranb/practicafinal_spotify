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
                <div key={artista.id}>
                    <p>{artista.name}</p>
                    <img src={artista.images[0]?.url} width="80" />
                    <button id="fav" onClick={() => favoritos(artista)}> { esFavorito(artista) ? "❤️" : "🤍"}</button>
                </div>
             ));
        }
    

return (
    <div className="Buscador">
      <form id="Forma" onSubmit={Buscarserie}>
        <h1 className="Forma">BUSCADOR DE ARTISTAS</h1>

        <label className="Forma"> Buscador </label>
        <input
          type="text"
          onChange={guardarBusqueda}
          value={busqueda}
          placeholder="Búsqueda de artistas"
        />
      </form>
      <div className="resultados">
        {aux}

        </div>
    </div>
)
}

export default ArtistWidget;