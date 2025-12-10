'use client'
import {useEffect,useState} from "react"

const DecadeWidget=({token,decadasfav,Setdecadasfav})=>{ 
   const[mostrar,setMostrar]=useState(false)

    useEffect( () => {
            localStorage.setItem("decadasfavoritos", JSON.stringify(decadasfav));
            console.log({decadasfav})
    }, [decadasfav]);   //cada vez que modifico favoritas lo añado al local storage
    
    const DECADAS = ["1950","1960","1970","1980","1990","2000","2010","2020"];

    const esDecadafav = (decada) => {
        return decadasfav.includes(decada); //includes porque es string
    };

    const favoritosDecada = (decada) => {
        let aux = [...decadasfav];

        if (esDecadafav(decada)) {
            // quitar
            aux = aux.filter(g => g !== decada);
        } else {
            // añadir
            aux.push(decada);
        }

        Setdecadasfav(aux);
    };

    return(
        <div className="bg-black p-5 rounded-xl border border-[#1DB95444] text-[#1DB954] w-full min-h-[260px] flex flex-col">
        <button 
            className="bg-[#1DB954] border-none px-[18px] py-[10px] rounded-[8px] font-bold cursor-pointer text-black mb-[15px] w-fit text-[16px] hover:bg-white hover:text-[#1DB954]"
            onClick={() => setMostrar(!mostrar)}
        >
            {mostrar ? "Ocultar decadas" : "Mostrar decadas"}
        </button> 

        {mostrar && (
            <div className="flex flex-wrap gap-[12px] overflow-y-auto max-h-[220px] pr-[6px]">
                {DECADAS.map((decada) => (
                    <li 
                      className="bg-[#111] px-[14px] py-[10px] rounded-[10px] text-[#1DB954] flex items-center justify-between gap-[12px] list-none text-[16px] min-w-[90px]"
                      key={decada}
                    >
                        {decada}
                        <button 
                          onClick={() => favoritosDecada(decada)}
                          className="bg-transparent border-none cursor-pointer text-[20px] text-[#1DB954] hover:text-white"
                        >
                            {esDecadafav(decada) ? "❤️" : "🤍"}
                        </button>
                    </li>
                ))}
            </div>
        )}
    </div>
    )
}

export default DecadeWidget;
