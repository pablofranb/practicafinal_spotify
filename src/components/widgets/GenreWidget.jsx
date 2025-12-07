'use client'
import { useState,useEffect } from "react"
const GenreWidget=({ token })=>{
    //const [todosgeneros,Settodosgeneros]=useState([]) cuando lo hice sin hardcodear
    const TODOS_LOS_GENEROS = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime',
  'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat',
  'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical',
  'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal',
  'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass',
  'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk',
  'forro', 'french', 'funk', 'garage', 'german', 'gospel', 'goth',
  'grindcore', 'groove', 'grunge', 'guitar', 'happy', 'hard-rock',
  'hardcore', 'hardstyle', 'heavy-metal', 'hip-hop', 'house', 'idm',
  'indian', 'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance',
  'j-idol', 'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin',
  'latino', 'malay', 'mandopop', 'metal', 'metal-misc', 'metalcore',
  'minimal-techno', 'movies', 'mpb', 'new-age', 'new-release', 'opera',
  'pagode', 'party', 'philippines-opm', 'piano', 'pop', 'pop-film',
  'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock', 'punk',
  'punk-rock', 'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 'road-trip',
  'rock', 'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa',
  'samba', 'sertanejo', 'show-tunes', 'singer-songwriter', 'ska', 'sleep',
  'songwriter', 'soul', 'soundtracks', 'spanish', 'study', 'summer',
  'swedish', 'synth-pop', 'tango', 'techno', 'trance', 'trip-hop',
  'turkish', 'work-out', 'world-music'];

    const [busqueda,Setbusqueda]=useState("")
    //const [generos,Setgeneros]=useState([])
    const [mostrar, setMostrar] = useState(false); //boton para listar
    const [artistas, Setartistas] = useState([]);

    /*cuando lo hice sin hardcodear
    useEffect(()=>{ 
    const listargeneros=async ()=>{
        const aux2 = await fetch("https://api.spotify.com/v1/recommendations/available-genre-seeds",
                                {headers: { Authorization: `Bearer ${token}` }}
                            );
        const datos = await aux2.json();
        Settodosgeneros(datos.genres || []);

    }
    listargeneros();
    },[token]);
    */
    const BuscarPorGenero = async (e) => {
        e.preventDefault();

        const resp = await fetch(
            `https://api.spotify.com/v1/search?type=artist&q=genre:${busqueda}&limit=10`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const datos = await resp.json();
        Setartistas(datos.artists.items || []);
    };
    const GuardarBusqueda = (e) =>{
        Setbusqueda(e.target.value)
    }
    /*const Buscarartistaporgenero=(busqueda)=>{
        let artistasaux=[...artistas]
        TODOS_LOS_GENEROS.map((item)=>{
            if(item===artistasaux.filter(a => a.genre === busqueda))
            artistasauxfinal=artistasauxfinal[artistasaux.filter(a => a.genre === busqueda)]

        })
    }
        */
    
    return(
        
        <div id="listageneros">
        <button className="botongeneros" onClick={() => setMostrar(!mostrar)}>
            {mostrar ? "Ocultar géneros" : "Mostrar géneros"}
        </button> 
         {mostrar && (
                <div>
                    {TODOS_LOS_GENEROS.map((item) => (
                        <li className="names">{item}</li>
                    ))}
                </div>
         )}

        <form className="forma" onSubmit={BuscarPorGenero}>
            <h1 className="forma">Buscador de canciones por genero</h1>
            <label className="forma">Buscador</label>
            <input type="text" onChange={GuardarBusqueda} value={busqueda} placeholder="Búsqueda de artistas filtrados por genero"></input> 
            
        </form>
         <div className="resultados">
                {artistas.map((artista) => (
                    <div key={artista.id} className="item">
                        <p>{artista.name}</p>
                        <img 
                            src={artista.images[0]?.url} 
                            width="80" 
                            alt={artista.name}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
export default GenreWidget;