const { v4: uuidv4 } = require('uuid');

export const canvasReducer = (state, action) => {
  const history = useHistory();

  const stageRef = useRef(null);
  const stageParentRef = useRef(null);
  
  const [savedMap, setSavedMap] = useState(localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null);

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
    left: 0,
    top: 0,
    backgroundColor: pinColors['type1']
    
  });

  recenterGrid: () => {
    if (stagePosition.x !== stagePosition.recenterX || stagePosition.y !== stagePosition.recenterY) {
      setStagePosition({ ...stagePosition, x: stagePosition.recenterX, y: stagePosition.recenterY });
      setGridCentered(true);
    }
    return gridCentered;
  };

  clearMap: () => {
    setMapLayout([]);
    return mapLayout;
  }

  handleTileLock: () => {
    setTilesLocked((prev) => !prev);
    return tilesLocked;
  };
  
  handleDraggableItem: (e) => {
    const tileData = {
      TileId: e.target.dataset.tileid,
      image_src: e.target.src
      // image_src: e.target.style.backgroundImage.substring(5, e.target.style.backgroundImage.length - 2)
    }
    e.dataTransfer.setData('dropped_tile', JSON.stringify(tileData));
  };

  handlePinStatus: (e) => {
    if(e !== null) {
      e.preventDefault();
      e.stopPropagation()
    }

    let pinType = e.target.closest('button') !== null ? e.target.closest('button').dataset.pintype : null;

    if(e.ctrlKey) { pinType = `type${e.key}`; }

    // e.key === <DIGIT> (e.code === "Digit1"), e.ctrlKey === true; e.key === "Escape"
    if( pinType === activePin || e.key === "Escape" ) {
      setActivePin(null);

      setShadowPinParams({
        ...shadowPinParams,
        display: 'none',
        top: -500,
        left: -500
      });

    } else if( pinType !== null && pinType !== activePin ) {
    
      if(activePin === null) {
        setShadowPinParams({
          ...shadowPinParams,
          display: 'inline-block',
          backgroundColor: pinColors[activePin]
        });

      }

      setActivePin(pinType);
    }

    return activePin;
    
  }

  togglePins: (e) => {
    setPinsVisible(e.target.checked);
    setActivePin(null);

    return pinsVisible;
  }

  clearPins: () => {
    setMapPins([]);
    setActivePin(null);

    return mapPins;
  }

  renderImage: () => {
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

    history.push(`/preview`);
  }
}