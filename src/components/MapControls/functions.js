const saveMapToDB = (render) => {
  let savedMap = JSON.parse(localStorage.getItem('dungen_map'));
  console.log(id, id === null, id === undefined);
  console.log('check me', props);
  let results;

  if (logIn === false) {
    setAuthState(true)
  }
  if (id === null || id === undefined) {
    console.log("NO ID, SAVING NEW MAP")
    // console.log(e.target);
    const mapLayout = savedMap.layout;

    results = API.saveMap({ UserId: props.users.id, name: mapTitle, image_url: "" })
      .then(savedMap => {
        // console.log(savedMap.data);
        const newMapId = savedMap.data.id;

        const newMapTiles = createMapTiles(newMapId);

        for (var i = 0; i < newMapTiles.length; i++) {
          if (newMapTiles[i].TileId !== null) {
            API.saveMapTile(newMapTiles[i])
              .then(savedMapTile => {
                // mapTile successfully saved!
              })
              .catch(err => console.error(err));
          }
        }
        setSavedState(true);

        console.log("TO RENDER, OR NOT TO RENDER?", render);
        if (render) {
          history.push(`/render/${newMapId}`);
        } else {
          history.push(`/builder/${newMapId}`);
        }
      })
      .catch(err => console.error(err));

  } else {
    console.log("ID PROVIDED, SAVING MAP TILES FOR SPECIFIED MAP")
    // we should probably ask the user if they want to save a NEW map
    // or save over the existing map
    // but that's a "later guy" problem, imho
    if (savedMap.mapTitle !== mapTitle) {
      results = API.updateMap({ id: id, name: mapTitle })
        .then(results => {
          setSavedState(true)
          // map title updated!
        })
        .catch(err => console.error(err));
    }

    API.deleteAllMapTilesForMap(id)
      .then(results => {
        console.log(results);
        for (var i = 0; i < savedMap.layout.length; i++) {
          // console.log(savedMap.layout[i]);
          let tile = newMapTile(id, savedMap.layout[i]);
          API.saveMapTile(tile)
            .then(results => {
              setSavedState(true)
              console.log(results);
            })
            .catch(err => console.error(err));
        }
        console.log("TO RENDER, OR NOT TO RENDER?", render);
        if (render) {
          history.push(`/render/${id}`);
        } else {
          history.push(`/builder/${id}`);
        }
      })
      .catch(err => console.error(err));
    // for(var i = 0; i < savedMap.layout.length; i++) {
    //   // console.log(savedMap.layout[i]);
    //   let tile = newMapTile(id, savedMap.layout[i]);
    //   API.saveMapTile(tile)
    //   .then(results => {
    //     console.log(results);
    //   })
    //   .catch(err => console.error(err));

    //   // if(tile.mapTileId === undefined || tile.mapTileId === null) {
    //   //   API.saveMapTile(tile)
    //   //   .then(results => {
    //   //     console.log(results);
    //   //   })
    //   //   .catch(err => console.error(err));

    //   // } else {
    //   //   API.updateMapTile(tile)
    //   //   .then(results => {
    //   //     console.log(results.data);
    //   //   })
    //   //   .catch(err => console.error(err));
    //   // }
    // }
  }
}

const newMapTile = (mapId, tileData) => {
  // console.log("tileData -> newMapTile", tileData);
  let newTile = {
    MapId: parseInt(mapId),
    TileId: parseInt(tileData.tileId),
    xCoord: parseInt(tileData.x),
    yCoord: parseInt(tileData.y),
    orientation: tileData.orientation,
    mirror: tileData.mirror
  }
  // console.log(newTile);
  return newTile;
}

const createMapTiles = (mapId) => {
  const mapLayout = JSON.parse(localStorage.getItem('dungen_map')).layout;
  let mapTiles = [];
  for (var i = 0; i < mapLayout.length; i++) {
    const tile = newMapTile(mapId, mapLayout[i]);
    mapTiles.push(tile);
  }
  return mapTiles;
}