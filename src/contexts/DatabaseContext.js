import { createContext, useContext, useState, useEffect } from 'react'
import { CanvasContext } from "./CanvasContext";
import API from '../utils/API'

export const DatabaseContext = createContext();

const DatabaseContextProvider = (props) => {
  // props: receives mapId & user from page MapBuilder
  const token = localStorage.getItem("token")
  const [userId, setUserId] = useState(props.user.id)

  const { settingsData } = useContext(CanvasContext);
  const { renderImage, setMapLayout } = settingsData;

  const [mapSaved, setMapSaved] = useState(null);

  let savedSettings = localStorage.getItem('dungen_map_settings') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_settings')) : null;
  let savedLayout = localStorage.getItem('dungen_map_tiles') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_tiles')) : null;
  let savedEncounters = localStorage.getItem('dungen_map_encounters') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_encounters')) : null;

  useEffect(() => {
    if(savedSettings.UserId === "" && userId !== "") {
      savedSettings.UserId = userId
    }
    localStorage.setItem('dungen_map_settings', JSON.stringify(savedSettings));
  }, [])

  const saveMapToDB = () => {
    savedSettings = localStorage.getItem('dungen_map_settings') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_settings')) : null;
    savedLayout = localStorage.getItem('dungen_map_tiles') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_tiles')) : null;
    savedEncounters = localStorage.getItem('dungen_map_encounters') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_encounters')) : null;

    savedSettings.image_url = localStorage.getItem('dungen_map_image') || "";

    API.saveMap(savedSettings)
    .then(res => {

      for(var i = 0; i < savedLayout.length; i++) {
        let tile = {
          x: savedLayout[i].x,
          y: savedLayout[i].y,
          rotation: savedLayout[i].rotation,
          mirror: typeof savedLayout[i].mirror === "string" ? savedLayout[i].mirror : JSON.stringify(savedLayout[i].scale),
          TileId: parseInt(savedLayout[i].TileId),
          MapId: parseInt(res.data.id)
        }

        API.saveMapTile(tile)
        .then(savedMapTile => {
          savedLayout[i].MapTileId = savedMapTile.data.id;
        })
        .catch(err => console.error(err));
      }

      // localStorage.setItem('dungen_map', JSON.stringify(savedMap));
      setMapSaved(res.data.id);
    })
    .catch(err => console.error(err))
  }

  const updateMapInDB = () => {
    savedSettings = localStorage.getItem('dungen_map_settings') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_settings')) : null;
    savedLayout = localStorage.getItem('dungen_map_tiles') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_tiles')) : null;
    savedEncounters = localStorage.getItem('dungen_map_encounters') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_encounters')) : null;

    savedSettings.image_url = localStorage.getItem('dungen_map_image') || "";
    console.log("db context, image_url", savedSettings.image_url);

    API.updateMap(savedSettings)
    .then(res => {
      const mapId = savedSettings.id;
    
      if(savedLayout !== null && savedLayout.length > 0) {
        API.getMapTilesForMap(mapId)
        .then(allMapTiles => {
          // all ids of MapTiles saved for this map
          const savedMapTileIds = allMapTiles.data.map(tile => tile.id);

          // these will be all the ids we want to keep
          let keepTheseTiles = [];
          for(var i = 0; i < savedLayout.length; i++) {
            let tile = {
              x: savedLayout[i].x,
              y: savedLayout[i].y,
              rotation: savedLayout[i].rotation,
              mirror: typeof savedLayout[i].mirror === "string" ? savedLayout[i].mirror : JSON.stringify(savedLayout[i].scale),
              TileId: parseInt(savedLayout[i].TileId),
              MapId: parseInt(mapId)
            }
    
            if(savedLayout[i].id !== undefined || savedLayout[i].MapTileId !== null) {
              tile.id = savedLayout[i].id !== undefined ? savedLayout[i].id : savedLayout[i].MapTileId;
              keepTheseTiles.push(parseInt(tile.id));

              API.updateMapTile(tile)
              .then(savedMapTile => {
                // don't have to do anything here!
                console.log("updated MapTile", tile.id)
              })
              .catch(err => console.error(err));
    
            } else {
              console.log("saving new MapTile", tile);
              API.saveMapTile(tile)
              .then(savedMapTile => {
                // console.log("saved a map tile on updating map:", mapId, savedMapTile)
                savedLayout[i].MapTileId = savedMapTile.data.id;
                keepTheseTiles.push(parseInt(savedMapTile.data.id));
                localStorage.setItem('dungen_map_tiles', JSON.stringify(savedLayout));
                setMapLayout(savedLayout);
              })
              .catch(err => console.error(err));
            }
          }

          // we filter the list of all saved maptile ids, removing the ones to keep
          // by finding the ids that do NOT exist in the keepTheseTiles array
          const deleteTheseTiles = savedMapTileIds.filter(id => !keepTheseTiles.includes(id));

          // docs say we can pass an array of ids as an argument, and they'll all be deleted!
          if(deleteTheseTiles.length > 0) {
            API.bulkDeleteMapTiles(deleteTheseTiles, token)
            .then(deletedTiles => console.log("deleted", deletedTiles.data))
            .catch(err => console.error(err));
          }
        })
        .catch(err => console.error(err))
      }

      // setMapSaved(res.data.id); // don't do this on update
      
    })
    .catch(err => console.error(err))
  }

  return (
    <DatabaseContext.Provider value={{ mapSaved, saveMapToDB, updateMapInDB }}>
      {props.children}
    </DatabaseContext.Provider>
  )
}

export default DatabaseContextProvider;