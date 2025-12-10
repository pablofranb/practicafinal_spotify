'use client'
import { useState,useEffect } from "react"

const GenreWidget=({ token, generosfav,Setgenerosfav})=>{
    const TODOS_LOS_GENEROS = [
  'acoustic','afrobeat','alt-rock','alternative','ambient','anime','black-metal',
  'bluegrass','blues','bossanova','brazil','breakbeat','british','cantopop',
  'chicago-house','children','chill','classical','club','comedy','country','dance',
  'dancehall','death-metal','deep-house','detroit-techno','disco','disney',
  'drum-and-bass','dub','dubstep','edm','electro','electronic','emo','folk','forro',
  'french','funk','garage','german','gospel','goth','grindcore','groove','grunge',
  'guitar','happy','hard-rock','hardcore','hardstyle','heavy-metal','hip-hop',
  'house','idm','indian','indie','indie-pop','industrial','iranian','j-dance',
  'j-idol','j-pop','j-rock','jazz','k-pop','kids','latin','latino','malay','mandopop',
  'metal','metal-misc','metalcore','minimal-techno','movies','mpb','new-age',
  'new-release','opera','pagode','party','philippines-opm','piano','pop','pop-film',
  'post-dubstep','power-pop','progressive-house','psych-rock','punk','punk-rock',
  'r-n-b','rainy-day','reggae','reggaeton','road-trip','rock','rock-n-roll',
  'rockabilly','romance','sad','salsa','samba','sertanejo','show-tunes',
  'singer-songwriter','ska','sleep','songwriter','soul','soundtracks','spanish',
  'study','summer','swedish','synth-pop','tango','techno','trance','trip-hop',
  'turkish','work-out','world-music'];

    const [busqueda,Setbusqueda]=useState("")
    const [mostrar, setMostrar] = useState(false);
    const [artistas, Setartistas] = useState([]);

    useEffect( () => {
        localStorage.setItem("favoritos", JSON.stringify(generosfav));
        console.log({generosfav})
    }, [generosfav]);   //cada vez que modifico favoritas lo añado al local storage

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

    const esGeneroFav = (genero) => {
        return generosfav.includes(genero); //includes porque es string
    };

    const favoritosGenero = (genero) => {
        let aux = [...generosfav];

        if (esGeneroFav(genero)) {
            // quitar
            aux = aux.filter(g => g !== genero);
        } else {
            // añadir
            aux.push(genero);
        }

        Setgenerosfav(aux);
    };

    return(
        
        <div className="bg-black p-5 rounded-xl text-[#1DB954] w-fit mx-auto mt-5 border border-[#1DB95440]">
        <button 
            className="bg-[#1DB954] border-none px-[18px] py-[10px] rounded-[8px] text-black font-bold cursor-pointer mb-[15px] transition hover:bg-[#18a84b]"
            onClick={() => setMostrar(!mostrar)}
        >
            {mostrar ? "Ocultar géneros" : "Mostrar géneros"}
        </button> 

        {mostrar && (
            <div className="flex flex-wrap gap-[12px] mb-[20px] max-h-[250px] overflow-y-auto pr-[5px]">
                {TODOS_LOS_GENEROS.map((genero) => (
                    <li 
                      className="bg-[#111] px-[12px] py-[8px] text-[#1DB954] flex items-center gap-[8px] rounded-[20px] border border-[#1DB95440] text-[14px] transition hover:bg-[#1DB95420] list-none"
                      key={genero}
                    >
                        {genero}
                        <button 
                          onClick={() => favoritosGenero(genero)}
                          className="bg-transparent cursor-pointer text-[#1DB954] text-[18px] border-none hover:text-white"
                        >
                            {esGeneroFav(genero) ? "❤️" : "🤍"}
                        </button>
                    </li>
                ))}
            </div>
        )}

        <form className="flex flex-col gap-[6px] mt-[20px] text-[#1DB954] font-bold" onSubmit={BuscarPorGenero}>
            <h1 className="flex flex-col gap-[6px]">Buscador de artistas por genero</h1>
            <label className="flex flex-col gap-[6px]">Buscador</label>
            <input 
                type="text" 
                onChange={GuardarBusqueda} 
                value={busqueda} 
                placeholder="Búsqueda de artistas filtrados por genero"
                className="p-[10px] rounded-[8px] border border-[#1DB95460] bg-black text-[#1DB954] w-[260px] text-[14px]"
            />
        </form>

        <div className="mt-[20px] flex gap-[20px] overflow-x-auto pb-[10px]">
            {busqueda && artistas.map((artista) => (
                <div 
                  key={artista.id} 
                  className="bg-[#111] p-[12px] rounded-[10px] min-w-[150px] text-center text-[#1DB954] border border-[#1DB95440]"
                >
                    <p>{artista.name}</p>
                    <img 
                        src={artista.images[0]?.url} 
                        width="80" 
                        alt={artista.name}
                        className="w-[120px] h-[120px] rounded-[10px] object-cover mt-2"
                    />
                </div>
            ))}
        </div>

        </div>
    )
}
export default GenreWidget;
