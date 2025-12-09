'use client'
import {useEffect,useState} from "react"
import styles from "./DecadeWidget.module.css";
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
        <div className={styles.decadas}>
        <button className={styles.botondecadas} onClick={() => setMostrar(!mostrar)}>
            {mostrar ? "Ocultar decadas" : "Mostrar decadas"}
        </button> 
        {mostrar && (
            <div className={styles.namescontainer}>
                {DECADAS.map((decada) => (
                    <li className={styles.names} key={decada}>
                        {decada}
                        <button onClick={() => favoritosDecada(decada)}>
                            {esDecadafav(decada) ? "❤️" : "🤍"}
                        </button>
                    </li>
                ))}
            </div>
            )
        }
    </div>
    )
}
export default DecadeWidget;