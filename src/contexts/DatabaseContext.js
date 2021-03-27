import { createContext, useState, useEffect } from 'react'
import API from '../utils/API'

export const DatabaseContext = createContext();

const DatabaseContextProvider = ({ children }) => {
  const savedMap = useState(localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null);
  const [mapData, setMapData] = useState(savedMap);
  const [mapSaved, setMapSaved] = useState(null);

  const saveMapToDB = (mapSettings) => {
    const newMap = {...mapSettings, image_url: ""};
    console.log("save to db", newMap);

    // API.saveMap(newMap)
    // .then(res => {
    //   console.log("saved new map", res.data);
    //   savedMap.id = res.data.id;
    //   setMapData(res.data);
    //   localStorage.setItem('dungen_map', JSON.stringify({...savedMap, ...res.data}));
    //   setMapSaved(res.data.id);
    // })
    // .catch(err => console.error(err))
  }

  const updateMapInDB = (mapSettings) => {
    console.log('update map in db', mapSettings);
    if(savedMap.id === null) {
      savedMap.id = mapSettings.id;
      localStorage.setItem('dungen_map', JSON.stringify(savedMap));
    }
  }

  const saveMapTiles = () => {
    console.log('save map tiles (called from save/update map)')
  }

  const updateMapTiles = () => {
    console.log('update map tiles (called from save/update map)')
  }

  const saveEncounters = () => {
    console.log('save encounters to encounters & mapencounters')
  }

  const updateEncounters = () => {
    console.log('update encounters in encounters & mapencounters')
  }

  return (
    <DatabaseContext.Provider value={{ mapData, mapSaved, setMapSaved, saveMapToDB, updateMapInDB, saveMapTiles, updateMapTiles, saveEncounters, updateEncounters }}>
      {children}
    </DatabaseContext.Provider>
  )
}

export default DatabaseContextProvider;