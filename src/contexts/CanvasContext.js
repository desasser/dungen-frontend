import { createContext, useState, useRef, useEffect } from 'react';

import API from "../utils/API";

export const CanvasContext = createContext();

const CanvasContextProvider = (props) => {

  const [stageRef, setStageRef] = useState(null);
  const [stageParentRef, setStageParentRef] = useState(null);
  
  const [savedMap, setSavedMap] = useState(localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null);

  const [mapSettings, setMapSettings] = useState({
    name: savedMap !== null ? savedMap.name : "",
    environment: savedMap !== null ? savedMap.environment : 1,
    infinite: savedMap !== null ? savedMap.infinite : true,
    rows: savedMap !== null ? savedMap.rows : 1,
    columns: savedMap !== null ? savedMap.columns : 1,
    public: savedMap !== null ? savedMap.public : false
  });

  let { tileSize, columns, rows, infinite } = savedMap !== null ? savedMap : {tileSize: 100, columns: 10, rows: 10, infinite: true};
  if(isNaN(rows)) { rows = 10; } else { rows = parseInt(rows) }
  if(isNaN(columns)) { columns = 10; } else { columns = parseInt(columns) }
  if(isNaN(tileSize)) { tileSize = 100; } else { tileSize = parseInt(tileSize) }

  const [grid, setGrid] = useState({
    tileSize: tileSize,
    infinite: infinite,
    columns: columns,
    rows: rows,
    containerWidth: tileSize * columns,
    containerHeight: tileSize * rows,
    startX: tileSize * columns * -tileSize,
    startY: tileSize * rows * -tileSize,
    endX: tileSize * columns * tileSize,
    endY: tileSize * rows * tileSize,
    // maxX: 999,
    // maxY: 999,
    // minX: -999,
    // minY: -999
  });

  const [stagePosition, setStagePosition] = useState({ 
    x: (window.innerWidth - (grid.tileSize * grid.columns) - grid.tileSize) / 2, 
    recenterX: (window.innerWidth - (grid.tileSize * grid.columns) - grid.tileSize) / 2, 
    y: 0,
    recenterY: 0
  });

  const [tilesLocked, setTilesLocked] = useState(false);
  const [gridCentered, setGridCentered] = useState(true);
  const [mapLayout, setMapLayout] = useState([]);

  const pinColors = {
    type1: 'forestgreen',
    type2: 'firebrick',
    type3: 'orchid',
    type4: 'dodgerblue',
    type5: 'salmon'
  }

  const [mapPins, setMapPins] = useState([]);
  const [pinsVisible, setPinsVisible] = useState(true);
  const [activePin, setActivePin] = useState(null);
  const [shadowPinParams, setShadowPinParams] = useState({
    left: activePin === null && -500,
    top: activePin === null && -500,
    backgroundColor: pinColors['type1']
    
  });

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

  const clearPins = () => {
    setMapPins([]);
    setActivePin(null);
  }

  const renderImage = () => {
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

    let sortedByXCoords = [...target.children].sort((a,b) => a.attrs.x < b.attrs.x ? 1 : -1);
    let sortedByYCoords = [...target.children].sort((a,b) => a.attrs.y < b.attrs.y ? 1 : -1);

    let x = sortedByXCoords[sortedByXCoords.length - 1].attrs.x;
    let y = sortedByYCoords[sortedByYCoords.length - 1].attrs.y;
    let mapWidth = (sortedByXCoords[0].attrs.x + grid.tileSize) - sortedByXCoords[sortedByXCoords.length - 1].attrs.x;
    let mapHeight = (sortedByYCoords[0].attrs.y + grid.tileSize) - sortedByYCoords[sortedByYCoords.length - 1].attrs.y;

    const uri = target.toDataURL({x: stagePosition.x + x, y: stagePosition.y + y, width: mapWidth, height: mapHeight}); // requires CORS!
    localStorage.setItem('dungen_map_image', uri);
  }

  const handleMapSubmit = event => {
    console.log("form submitted", event)
    API.saveMap(mapSettings).then(res => {
        console.log("trying to to save a map");
        setMapSettings(mapSettings);

    }).catch(err => console.error(err))
  }

  useEffect(() => {
    if(savedMap === null) {
      localStorage.setItem( 'dungen_map', JSON.stringify(mapSettings) )
    } else {
      localStorage.setItem( 'dungen_map', JSON.stringify({...savedMap, ...mapSettings}) )
    }
  }, [mapSettings]);

  const canvasData = {
    stageRef, setStageRef,
    stageParentRef, setStageParentRef,
    savedMap, setSavedMap,
    tileSize, columns, rows, infinite,
    grid, setGrid,
    stagePosition, setStagePosition,
    tilesLocked, setTilesLocked,
    gridCentered, setGridCentered,
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
      text: gridCentered ? "Grid is centered" : "Center Grid" 
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
    activePin, setActivePin, handlePinStatus, grid, stageRef, stagePosition
  }

  const settingsData = {
    mapSettings, setMapSettings, handleMapSubmit
  }

  return (
    <CanvasContext.Provider value={{ canvasData, controlsData, settingsData, handleDraggableItem }}>
      {props.children}
    </CanvasContext.Provider>
  )
}

export default CanvasContextProvider;