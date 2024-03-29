import { createContext, useState, useEffect } from 'react';

import API from "../utils/API";

export const CanvasContext = createContext();

const CanvasContextProvider = (props) => {
  // props: receives mapId & user from page MapBuilder
  const MapId = props.mapId !== undefined ? parseInt(props.mapId) : null;
  const UserId = props.user.id;

  const [stageRef, setStageRef] = useState(null);
  const [stageParentRef, setStageParentRef] = useState(null);

  const tileSize = 100;

  const settingsDefaults = {
    name: "",
    rows: 20,
    columns: 40,
    infinite: false,
    EnvironmentId: 1,
    public: false,
    id: null,
    UserId: UserId
  }

  const stagePositionDefault = { x: 0, y: 0, recenterX: 0, recenterY: 0 }

  const gridDefaults = {
    tileSize: tileSize,
    infinite: settingsDefaults.infinite,
    rows: settingsDefaults.rows, // 30 tiles tall
    columns: settingsDefaults.columns, // 50 tiles wide
    containerWidth: tileSize * settingsDefaults.columns,
    containerHeight: tileSize * settingsDefaults.rows,
    startX: 0,
    startY: 0,
    endX: tileSize * settingsDefaults.columns - tileSize,
    endY: tileSize * settingsDefaults.rows - tileSize
  }

  // const [mapSettings, setMapSettings] = useState( JSON.parse(localStorage.getItem('dungen_map_settings')) || settingsDefaults );
  const [mapSettings, setMapSettings] = useState( settingsDefaults );

  const [grid, setGrid] = useState(gridDefaults);

  // const [stagePosition, setStagePosition] = useState(JSON.parse(localStorage.getItem('dungen_stageposition')) || stagePositionDefault);
  const [stagePosition, setStagePosition] = useState( stagePositionDefault );

  // const [mapLayout, setMapLayout] = useState(JSON.parse(localStorage.getItem('dungen_map_tiles')) || []);
  const [mapLayout, setMapLayout] = useState( [] );

  const [mapPins, setMapPins] = useState([]);
  
  // "view" the map without coordinate tiles ("build" would be with the grid)
  const [viewState, setViewState] = useState(false);

  const [tilesLocked, setTilesLocked] = useState(false);
  const [gridCentered, setGridCentered] = useState(true);
  
  const pinColors = [
    'black', // placeholder, 0
    'forestgreen', // environmental, 1
    'firebrick', // combat, 2
    'orchid', // trap, 3
    'dodgerblue', // social, 4
    'salmon', // other, 5
  ]

  const [pinsVisible, setPinsVisible] = useState(true);
  const [activePin, setActivePin] = useState(null);
  const [shadowPinParams, setShadowPinParams] = useState({
    left: activePin === null && -500,
    top: activePin === null && -500,
    backgroundColor: pinColors[0]
    
  });

  const [mapData, setMapData] = useState({
    ...mapSettings, 
    ...grid, 
    MapTiles: mapLayout,
    MapEncounters: mapPins,
    pinsVisible: true
  })

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('dungen_map_settings')) || null;
    const savedLayout = JSON.parse(localStorage.getItem('dungen_map_tiles')) || null;
    const savedEncounters = JSON.parse(localStorage.getItem('dungen_map_encounters')) || null;
    const savedGrid = JSON.parse(localStorage.getItem('dungen_map_grid')) || null;
    const savedStagePosition = JSON.parse(localStorage.getItem('dungen_stageposition')) || null;

    if(MapId !== null) {
      API.getSingleMap(MapId)
      .then((res) => {
        if (res.data !== "") {
          if(savedSettings !== null && ( (savedSettings.id === MapId && savedSettings.updatedLocallyAt < res.data.updatedAt) || savedSettings.id === null) ) {

            const dateTime = getDateTimestamp();

            const mapSettings = {
              name: res.data.name,
              rows: res.data.rows,
              columns: res.data.columns,
              infinite: res.data.rows === null || res.data.columns === null ? true : false,
              EnvironmentId: res.data.EnvironmentId,
              public: res.data.public,
              id: parseInt(res.data.id),
              UserId: res.data.UserId,
              updatedLocallyAt: dateTime
            }

            setMapSettings(mapSettings);
            setMapLayout(res.data.MapTiles);

            if(savedGrid !== null) {
              const newGrid = {
                ...savedGrid,
                rows: mapSettings.rows,
                columns: mapSettings.columns,
                infinite: mapSettings.infinite,
                containerWidth: mapSettings.columns * savedGrid.tileSize,
                containerHeight: mapSettings.rows * savedGrid.tileSize,
                startX: (savedGrid.tileSize * mapSettings.columns - savedGrid.tileSize) * -1,
                startY: (savedGrid.tileSize * mapSettings.rows - savedGrid.tileSize) * -1,
                endX: (savedGrid.tileSize * mapSettings.columns - savedGrid.tileSize),
                endY: (savedGrid.tileSize * mapSettings.rows - savedGrid.tileSize),
              }

              setGrid(newGrid);
            }

            const xOffset = ((window.innerWidth - 380) - (savedGrid.tileSize * savedGrid.columns)) / 2;
            const yOffset = ((window.innerHeight - 75) - (savedGrid.tileSize * savedGrid.rows)) / 2;
            const gridWidth = savedGrid.tileSize * savedGrid.columns;
            const gridHeight = savedGrid.tileSize * savedGrid.rows;

            let newStagePosition = {x: 0, y: 0, recenterX: 0, recenterY: 0}

            if(window.innerWidth > gridWidth) {
              newStagePosition = {...newStagePosition, x: xOffset, recenterX: xOffset}
            } else {
              newStagePosition = { ...newStagePosition, x: 0, recenterX: 0 }
            }

            if(window.innerHeight > gridHeight) {
              newStagePosition = {...newStagePosition, y: yOffset, recenterY: yOffset}
            } else {
              newStagePosition = { ...newStagePosition, y: 0, recenterY: 0 }
            }

            setStagePosition(newStagePosition);

          }
        }
      })
      .catch(err => console.error(err));
    } else if( savedSettings !== null && savedSettings.id === null && MapId === null && (savedSettings.UserId === UserId || savedSettings.UserId === "" || UserId === "") ) {
      if(UserId !== "") {
        savedSettings.UserId = props.user.id;
        localStorage.setItem('dungen_map_settings', JSON.stringify(savedSettings));
      }

      // if(savedLayout !== null && savedLayout.length > 0) { setMapLayout(savedLayout); }
      if(savedEncounters !== null && savedLayout.length > 0) { setMapPins(savedEncounters); }
      if(savedGrid !== null && savedLayout.length > 0) { setGrid(savedGrid); }
      if(savedStagePosition !== null) { setStagePosition(savedStagePosition); }

      setMapSettings(savedSettings);
    }
    
    // if( MapId === null && savedSettings.id !== null ) {
    //   setMapSettings(settingsDefaults);
    //   setGrid(gridDefaults);
    //   setMapLayout([]);
    //   setMapPins([]);
    //   setStagePosition(stagePositionDefault);
    // }

  }, [props]);

  useEffect(() => {
    updateLocalStorage();

  }, [mapSettings, grid, mapLayout, mapPins, pinsVisible, stagePosition])

  const updateLocalStorage = () => {
    setMapData({...mapSettings, ...grid, MapTiles: mapLayout, MapEncounters: mapPins, pinsVisible});

    const dateTime = getDateTimestamp;

    localStorage.setItem('dungen_map_settings', JSON.stringify({...mapSettings, updatedLocallyAt: dateTime}));
    localStorage.setItem('dungen_map_grid', JSON.stringify(grid))
    localStorage.setItem('dungen_map_tiles', JSON.stringify(mapLayout))
    localStorage.setItem('dungen_map_encounters', JSON.stringify(mapPins))
  }

  const getDateTimestamp = () => {
    const dt = new Date();
    const year = dt.getFullYear();
    const month = (dt.getMonth() + 1).toString().padStart(2, '0');
    const day = dt.getDate().toString().padStart(2, '0');
    const hour = dt.getHours().toString().padStart(2, '0');
    const min = dt.getMinutes().toString().padStart(2, '0');
    const sec = dt.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
  }

  const recenterGrid = () => {
    if (stagePosition.x !== stagePosition.recenterX || stagePosition.y !== stagePosition.recenterY) {
      setStagePosition({ ...stagePosition, x: stagePosition.recenterX, y: stagePosition.recenterY });
      setGridCentered(true);
    }
  };

  const clearMap = () => {
    setMapLayout([]);
  }

  const handleTileLock = () => {
    setTilesLocked((prev) => !prev);
  };
  
  const handleDraggableItem = (e) => {
    const tileData = {
      TileId: e.target.dataset.tileid,
      image_src: e.target.src
      // image_src: e.target.style.backgroundImage.substring(5, e.target.style.backgroundImage.length - 2)
    }
    e.dataTransfer.setData('dropped_tile', JSON.stringify(tileData));
  };

  const handlePinStatus = (e) => {
    e.preventDefault();
    // e.stopPropagation();

    console.log("handlePinStatus", e);

    let pinType = e.target.closest('button') !== null ? e.target.closest('button').dataset.pintype : null;
    if(pinType === null && e.key !== undefined) {
      pinType = `type${e.key}`;
    }
    
    console.log("pinType", pinType, "activePin", activePin);
    if(pinType === activePin) {
      setActivePin(null);
    } else {
      setActivePin(pinType);
    }

  }
    
  const togglePins = e => {
    setPinsVisible(e.target.checked);
    setActivePin(null);
  }

  const toggleViewState = (e) => {
    setViewState(!viewState)
  }

  const clearPins = () => {
    setMapPins([]);
    setActivePin(null);
  }

  const renderImage = (updateDB=true) => {
    let uri = "";
    // 0 === coordgrid, 1 === shadow tile, 2 === map tiles + pins
    let target = stageRef.current.children[2];
    /**
     * LEAVING IN CASE WE ADD MORE LAYERS THAT NEED TO BE RENDERED
     * WITH MAP TILES + PINS LAYER
     * took var indicating whether or not to include the extra layer
     * this is now redundant, b/c pins are visible/hidden individually
     */
    // if(renderWithPins && mapPins.length > 0) {
    //   let layer = stageRef.current.children[2];
    //   for(var i = 0; i < pinsLayer.children.length; i++) {
    //     layer.children.push(pinsLayer.children[i])
    //   }
    //   target = layer;
    // }

    if(target.children.length > 0) {
      let sortedByXCoords = [...target.children].sort((a,b) => a.attrs.x < b.attrs.x ? 1 : -1);
      let sortedByYCoords = [...target.children].sort((a,b) => a.attrs.y < b.attrs.y ? 1 : -1);

      let x = sortedByXCoords[sortedByXCoords.length - 1].attrs.x;
      let y = sortedByYCoords[sortedByYCoords.length - 1].attrs.y;
      let mapWidth = (sortedByXCoords[0].attrs.x + grid.tileSize) - sortedByXCoords[sortedByXCoords.length - 1].attrs.x;
      let mapHeight = (sortedByYCoords[0].attrs.y + grid.tileSize) - sortedByYCoords[sortedByYCoords.length - 1].attrs.y;

      uri = target.toDataURL({x: stagePosition.x + x, y: stagePosition.y + y, width: mapWidth, height: mapHeight}); // requires CORS!
      
    }

    localStorage.setItem('dungen_map_image', uri);

    if(updateDB && mapSettings.id !== null) {
      API.updateMap({ id: mapSettings.id, image_url: uri })
      .then(updatedMap => {
        // console.log("saved image", updatedMap);
        // localStorage.setItem('dungen_map_image', uri);
        // return uri;
      })
      .catch(err => console.error(err));
    }

    return uri;
  }

  const canvasData = {
    stageRef, setStageRef,
    stageParentRef, setStageParentRef,
    mapSettings, mapData,
    gridDefaults, grid, setGrid,
    stagePosition, setStagePosition,
    tilesLocked, setGridCentered,
    mapLayout, setMapLayout,
    mapPins, setMapPins,
    pinsVisible, setPinsVisible,
    activePin, setActivePin,
    shadowPinParams, setShadowPinParams,
    pinColors
  }

  const controlsData = {
    toggleTileLock: { 
      props: {checked: tilesLocked, onChange: handleTileLock, name: "toggleTileLock"}, 
      args: { visible: grid.infinite }
    },
    centerGrid: { 
      props: {onClick: recenterGrid}, 
      args: {gridCentered: gridCentered}, 
      text: gridCentered ? "Grid centered" : "Center Grid" 
    }, 
    clearMap: {
      props: {onClick: clearMap},
      args: { mapLayoutLength: mapLayout.length },
      text: mapLayout.length > 0 ? 'Clear Map' : 'Map Empty'
    },
    pins: {
      props: {onClick: handlePinStatus},
    },
    clearPins: {
      props: {onClick: clearPins},
      args: { mapPinsLength: mapPins.length },
      text: mapPins.length > 0 ? 'Clear Pins' : 'No Pins'
    },
    togglePins: {
      props: {onClick: togglePins},
      pinsVisible: pinsVisible
    },
    renderImage: {
      onClick: renderImage,
      args: {mapLayoutLength: mapLayout.length},
      text: mapLayout.length > 0 ? 'render Image' : 'Nothing to render'
    },
    activePin, setActivePin, handlePinStatus, grid, stageRef, stagePosition, viewState, toggleViewState
  }

  const settingsData = { settingsDefaults, mapSettings, setMapSettings, mapLayout, grid, renderImage, setMapLayout, setStagePosition, stageRef }

  const tabData = { tilesLocked, setTilesLocked }

  return (
    <CanvasContext.Provider value={{ canvasData, controlsData, settingsData, tabData, handleDraggableItem }}>
      {props.children}
    </CanvasContext.Provider>
  )
}

export default CanvasContextProvider;