
import { getAccessToken } from "@/lib/auth";
// Mezcla un array al azar 
export function mezclarCanciones(arr) {
  let copia = [...arr];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // 1. Obtener top tracks de artistas seleccionados
  for (const artist of artists) {
    const tracks = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await tracks.json();
    allTracks.push(...data.tracks);
  }

  // 2. Buscar por géneros
  for (const genre of genres) {
    const results = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await results.json();
    allTracks.push(...data.tracks.items);
  }

  // 3. Filtrar por década
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados y limitar a 30 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}


/* 
FUNCION PROPIA YA QUE NO HABIA VISTO ESTE ARCHIVO

 const mezclarCanciones = (arr) => {
  let copia = [...arr];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]]; // intercambio correcto
  }

  return copia;
};

const generacionPlaylist = async () => {
    if (!accessToken) {
      console.error("Token no disponible");
      return;
    }
    let listaFinal = [];
    // 1. CANCIONES FAVORITAS
        if (cancionesfav.length > 0) {
          const mezcladas = mezclarCanciones(cancionesfav); //mezclo las canciones
          listaFinal.push(...mezcladas.slice(0, 5)); //añado a la lista 5 atleatorias
        }
      // 2. TOP TRACKS ARTISTAS
    for (const artista of artistasfav) { //for para cada artista fav
        try {
          //fetch
          const resp = await fetch(
            `https://api.spotify.com/v1/artists/${artista.id}/top-tracks?market=ES`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        //transformo
        const datos = await resp.json();
        //sino hay datos salto
        if (!datos || !datos.tracks) {
          continue;
        }
        //mezclo
        const mezcladas = mezclarCanciones(datos.tracks);
        //añado
        listaFinal.push(...mezcladas.slice(0, 5));

      } catch (err) {
        console.error("Error:", artista.name, err);
        }
    }

  
  // 3. CANCIONES POR GÉNERO
  
  for (const genero of generosfav) {
    try {
        // Buscar canciones con el género en el nombre 
        const resp = await fetch(
          `https://api.spotify.com/v1/search?type=track&q=${genero}&limit=50`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const datos = await resp.json();
        //compruebo que datos existe, que tiene tracks y que en traks hay items
        if (!datos || !datos.tracks || !datos.tracks.items) {
          continue;
        }
        const mezcladas = mezclarCanciones(datos.tracks.items);
        listaFinal.push(...mezcladas.slice(0, 5));

    } catch (err) {
      console.error("Error:", genero, err);
    }
  }
  // 4. LIMPIEZA FINAL
  listaFinal = listaFinal.filter(t => t.id!=null);
  // ELIMINAR DUPLICADOS POR ID
  listaFinal = listaFinal.filter(
    (track, index, self) =>
      index === self.findIndex(t => t.id === track.id)
  );
  SetPlaylist(listaFinal);
};*/