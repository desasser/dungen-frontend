import React from "react";
import { useParams, useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Stage, Layer, Group, Rect, Text, Path } from "react-konva";
import { Spring, config, animated } from 'react-spring/renderprops-konva'

import MapControls from '../MapControls';

import CanvasTile from "../MapTile";
import MapTileControls from "../MapTileControls";

// exporting image from canvas
const { v4: uuidv4 } = require('uuid');

const useStyles = makeStyles({
  mapCanvasContainer: {
    overflow: "hidden",
    position: "relative", 
    margin: "0 auto", 
    background: "white", 
    border: "4px solid black", 
  },
  shadowPin: {
    boxSizing: 'border-box',
    display: 'inline-block',
    position: 'absolute',
    backgroundColor: 'grey',
    width: 30,
    height: 30,
    borderRadius: '50% 50% 50% 0',
    transform: 'rotate(-45deg)',
    margin: '10px 5px 20px',

    '&:before': {
      content: '',
      width: 14,
      height: 14,
      margin: '8px 0 0 8px',
      position: 'absolute',
      borderRadius: '50%',
      textAlign: 'center'
    }
  },
})

// infinite grid demo: https://codesandbox.io/s/kkndq?file=/src/index.js:200-206
// snapping & shadow tile demo: https://codepen.io/pierrebleroux/pen/gGpvxJ?editors=0010
export default function InfiniteCanvas(props) {
  const classes = useStyles();

  const history = useHistory();

  let { tileSize, columns, rows } = props;
  
  if (tileSize === undefined || tileSize === null) {
    tileSize = 100;
  }
  if (columns === undefined || columns === null) {
    columns = 10;
  }
  if (rows === undefined || rows === null) {
    rows = 4;
  }

  const stageRef = React.useRef(null);
  const stageParentRef = React.useRef(null);
  const mapCanvasContainerRef = React.useRef(null);

  const [viewState, setViewState] = React.useState(false);

  const [activePin, setActivePin] = React.useState(null);
  const [draggingPin, setDraggingPin] = React.useState({x: 0, y: 0});
  const [mapPins, setMapPins] = React.useState([]);
  const [pinsVisible, setPinsVisible] = React.useState(true);
  const [contextMenuActive, setContextMenuActive] = React.useState(false);
  const [tileControlsPosition, setTileControlsPosition] = React.useState({top: 0, left: 0});

  const [activeTile, setActiveTile] = React.useState(null);

  const [tilesLocked, setTilesLocked] = React.useState(false);
  const [gridCentered, setGridCentered] = React.useState(true);
  const [stagePosition, setStagePosition] = React.useState({ x: 0, y: 0, recenterX: 0, recenterY: 0 });
  const [grid, setGrid] = React.useState({
    tileSize: tileSize,
    infinite: true,
    columns: columns,
    rows: rows,
    containerWidth: tileSize * columns,
    containerHeight: tileSize * rows,
    startX: tileSize * columns * -tileSize,
    startY: tileSize * rows * -tileSize,
    endX: tileSize * columns * tileSize,
    endY: tileSize * rows * tileSize,
    maxX: 999,
    maxY: 999,
    minX: -999,
    minY: -999
  });
  const [coordinateSquares, setCoordinateSquares] = React.useState([]);

  const [shadowTileParams, setShadowTileParams] = React.useState({
    x: 0,
    y: 0,
    width: grid.tileSize,
    height: grid.tileSize,
    fill: "#ff7b17",
    opacity: 0,
    stroke: "#cf6412",
    strokeWidth: 3,
    dash: [20, 2],
    visible: false,
  });
  const [lastLegitSquare, setLastLegitSquare] = React.useState({x: 0, y: 0});

  const pinColors = {
    type1: 'forestgreen',
    type2: 'firebrick',
    type3: 'orchid',
    type4: 'dodgerblue',
    type5: 'salmon'
  }
  // donjon has 19
  const environmentColors = {
    Environment_1: '#899D78',
    Environment_2: '#445640',
    Environment_3: '#048ba8',
    Environment_4: '#fcff6c'
  }

  const [shadowPinParams, setShadowPinParams] = React.useState({
    className: 'shadow-pin',
    left: 0,
    top: 0,
    backgroundColor: pinColors.type1,
    opacity: 0,
    // draggable: !tilesLocked,
    // strokeWidth: 0,
    // data: "M0,27 Q0,28 10,15 A15,15 0,1,0 -10,15 Q0,28 0,27",
    // visible: false
  })

  const [mapLayout, setMapLayout] = React.useState([]);

  const savedMap = localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null;
  const [mapData, setMapData] = React.useState(savedMap !== null ? {...savedMap} : {
    name: "", 
    rows: 0,
    columns: 0,
    infinite: true,
    environment: "Environment_1",
    layout: [], 
    pins: [], 
    pinsVisible: true, 
    public: false,
    userId: null
  });


  React.useEffect(() => {

    if(savedMap !== null && savedMap.name !== "" && savedMap.layout.length !== 0) {
      setMapData(savedMap);
    }

    if(props.init !== undefined && props.init !== null && savedMap !== null) {
      let newData = { ...savedMap }

      if(props.init.name !== "") { newData.name = props.init.name; }
      if(props.init.environment !== "") { newData.environment = props.init.environment; }
      if(props.init.infinite !== "") { newData.infinite = props.init.infinite; }
      if(props.init.rows !== "") { newData.rows = props.init.rows; }
      if(props.init.columns !== "") { newData.columns = props.init.columns; }
      if(props.init.public !== "") { newData.public = props.init.public; }

      localStorage.setItem('dungen_map', JSON.stringify(newData));
      setMapData(newData);

    } else if (savedMap === null && props.init !== undefined) {
      let newData = {...mapData, ...props.init}
      
      setMapData(newData);
      localStorage.setItem('dungen_map', JSON.stringify(newData));
    }
  }, [props.init]);

  /**
   * SETTING HEIGHT & WIDTH OF STAGE
   * based on stage container offset
   * 
   */
  React.useEffect(() => {
    if(stageParentRef.current) {
      let offsetTop = mapCanvasContainerRef.current.offsetTop;
      setGrid({
        ...grid,
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight - offsetTop - 2
      });

      stageParentRef.current.style.width = window.innerWidth - 2 + 'px';
      stageParentRef.current.style.height = window.innerHeight - offsetTop - 2 + 'px';

      if(savedMap !== null) {
        stageParentRef.current.style.backgroundColor = environmentColors[savedMap.environment]
      }
    }

    if(mapCanvasContainerRef.current) {
      let offsetTop = mapCanvasContainerRef.current.offsetTop;
      stageParentRef.current.style.width = window.innerWidth - 2 + 'px';
      stageParentRef.current.style.height = window.innerHeight - offsetTop - 2 + 'px';
    }
  
  }, [stageParentRef, mapCanvasContainerRef]);

  /**
   * LOADING MAP FROM LOCAL STORAGE
   * this only happens once, on page load!
   */
   React.useEffect(() => {
    if(savedMap !== null) {

      if(mapLayout.length === 0 && savedMap !== null && savedMap.layout !== undefined && savedMap.layout.length > 0) {
        setMapLayout([...savedMap.layout]);
      }

      if(mapPins.length === 0 && savedMap !== null && savedMap.pins !== undefined && savedMap.pins.length > 0) {
        setMapPins([...savedMap.pins]);
      }

      if(savedMap !== null) {
        setPinsVisible(savedMap.pinsVisible);
      }

      createGrid(savedMap.rows, savedMap.columns, savedMap.tileSize, savedMap.infinite);

    } else if(props.init !== null && props.init.name !== "") {
      console.log("::cMC.203:: props.init found!", props.init);
      // build canvas / make selections (blah blah blah) based on modal init input
      let gridProps = {...grid} 

      gridProps = {
        ...gridProps,
        infinite: props.init.infinite,
      }

      if(!props.init.infinite) {
        let r = isNaN(props.init.rows) ? 10 : parseInt(props.init.rows);
        let c = isNaN(props.init.columns) ? 10 : parseInt(props.init.columns);

        gridProps = {
          ...gridProps,
          infinite: false,
          startX: 0,
          startY: 0,
          columns: c,
          rows: r,
          endX: grid.tileSize * c,
          endY: grid.tileSize * r
        }

        setGrid({...gridProps})

        if(window.innerWidth > grid.tileSize * gridProps.columns) {
          const gridWidth = (window.innerWidth - (grid.tileSize * gridProps.columns)) / 2;
          setStagePosition({ ...stagePosition, x: gridWidth, recenterX: gridWidth })
        }

        if(window.innerHeight > grid.tileSize * gridProps.rows) {
          const gridHeight = (window.innerHeight - (grid.tileSize * gridProps.rows)) / 2;
          setStagePosition({ ...stagePosition, y: gridHeight, recenterY: gridHeight })
        }
      }

      createGrid(gridProps.rows, gridProps.columns, gridProps.tileSize, gridProps.infinite);

    }

  }, [mapData]);

  /**
   * INFINITE GRID *ONLY*
   */
  React.useEffect(() => {
    if(props.init === null || props.init.infinite || grid.infinite) {
      createGrid(null, null, grid.tileSize, true);
    }

  }, [stagePosition]);

  /**
   * FOR HANDLING EXTERNAL EVENTS
   * such as dragging a tile onto the map
   * from the tile drawer
   */
  // React.useEffect(() => {
  //   if(props.draggingTile) {
  //     setContextMenuActive(false);
  //     setActivePin(null);
  //     setShadowPinParams({
  //       ...shadowPinParams,
  //       opacity: 0,
  //       x: 0,
  //       y: 0
  //     })
  //   }
  // }, [props.draggingTile])

  /**
   * UPDATING LOCAL STORAGE
   * this happens when the map layout changes
   */
  React.useEffect(() => {
    console.log("::cMC.309:: mapData", mapData);

    const newData = {
      ...mapData,
      layout: mapLayout,
      pins: mapPins,
      pinsVisible: pinsVisible
    };
    setMapData(newData);

    localStorage.setItem('dungen_map', JSON.stringify(newData));

    // eslint-disable-next-line
  }, [mapLayout, mapPins, pinsVisible]);


  /**
   * MAP LAYOUT FOR PREVIOUSLY SAVED MAPS
   */
  // React.useEffect(() => {
  //   // does nothing for now
  // }, [mapLayout]);

  /**
   * DATE FUNCTION
   */
  const handleDateTime = (get='time') => {
    const dt = new Date();
    let month = (dt.getMonth() + 1);
    let date = dt.getDate();
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    let seconds = dt.getSeconds();

    if(month < 10) { month = `0${month}` };
    if(date < 10) { date = `0${date}`};
    if(hours < 10) { hours = `0${hours}`};
    if(minutes < 10) { minutes = `0${minutes}`};
    if(seconds < 10) { seconds = `0${seconds}`};

    let today = dt.getFullYear() +'-'+ month +'-'+ date;
    let timestamp = hours +':'+ minutes +':'+ seconds;

    if(get === 'time') {
      return timestamp;
    } else if(get === 'date') {
      return today;
    } else if(get === 'datetime' || get === 'both') {
      return `${today}T${timestamp}`;
    }

    return null;
  }

  /**
   * GENERAL FUNCTIONS
   */
  const handleMouseEnter = (e, target, cursorStyle) => {
    // if the tiles are locked (grid dragging enabled)
    // AND the target is the stage, change the cursor
    if(target === 'stage' && tilesLocked) {
      stageRef.current.container().style.cursor = cursorStyle

    } 
    // if the tiles are NOT locked (grid dragging DISABLED)
    // AND the target is NOT just the stage, change the cursor
    if(target !== 'stage' && !tilesLocked) {
      stageRef.current.container().style.cursor = cursorStyle
    }

    if(target === 'tile' && !tilesLocked && activePin !== null) {
      stageRef.current.container().style.cursor = "crosshair"
    }
  }

  const handleMouseMoveOverStage = () => {
    if(activePin !== null) {
      const mousePos = stageRef.current.getPointerPosition();

      setShadowPinParams({
        ...shadowPinParams,
        fill: pinColors[activePin],
        x: mousePos.x - stagePosition.x,
        y: mousePos.y - stagePosition.y - (grid.tileSize / 3),
        visible: true,
        opacity: 0.5
      })
    }
  }

  const handleMouseLeave = () => {
    // if tiles are locked, we actually want to change
    // the cursor back to "move" for the stage container.
    // otherwise we just change it back to default
    if(tilesLocked) {
      stageRef.current.container().style.cursor = 'move'

    } else {
      stageRef.current.container().style.cursor = 'default'

    }
  }

  /**
   * GRID METHODS
   */
  const createGrid = (rows, columns, tileSize, infinite=grid.infinite) => {
    const gridInit = infinite ? updateGridProps(stagePosition) : { ...grid, startX: 0, startY: 0, endX: tileSize * columns, endY: tileSize * rows };

    var i = 0;
    const gridColors = [
      ["rgba(0,0,0,0.15)", "transparent"],
      ["transparent", "rgba(0,0,0,0.15)"],
    ];
    const cSquares = [];
    for (var x = gridInit.startX; x < gridInit.endX; x += gridInit.tileSize) {
      for (var y = gridInit.startY; y < gridInit.endY; y += gridInit.tileSize) {
        if (i === 4) {
          i = 0;
        }

        const ix = Math.abs(x / gridInit.tileSize) % gridColors.length;
        const iy = Math.abs(y / gridInit.tileSize) % gridColors[0].length;

        cSquares.push(
          <Group key={`${x}-${y}`} name={`${x}-${y}`}>
            <Rect
              key={`cs-${x}-${y}`}
              className="coordinate-grid-tile"
              x={x}
              y={y}
              width={gridInit.tileSize}
              height={gridInit.tileSize}
              fill={gridColors[ix][iy]}
              strokeWidth={0}
              // stroke="gainsboro"
            />
            <Text
              key={`ct-${x}-${y}`}
              text={`${x / 100}, ${y / 100}`}
              x={x + 10}
              y={y + 10}
              fill="#373737"
              // strokeWidth={0}
            />
          </Group>
        );
      }
    }
    setCoordinateSquares(cSquares);
  }
  
  const updateGridProps = (position = null) => {
    if(position === null) { position = stagePosition; }

      const startX = Math.floor((-position.x - grid.containerWidth) / grid.tileSize) * grid.tileSize;
      const endX = Math.floor((-position.x + grid.containerWidth * 2) / grid.tileSize) * grid.tileSize;
      const startY = Math.floor((-position.y - grid.containerHeight) / grid.tileSize) *  grid.tileSize;
      const endY = Math.floor((-position.y + grid.containerHeight * 2) / grid.tileSize) * grid.tileSize;

    const gridInit = {
      ...grid,
      startX: startX,
      endX: endX,

      startY: startY,
      endY: endY,
    };
    setGrid(gridInit);
    return gridInit;
  };

  const handleGridDragEnter = (e) => {
    e.preventDefault()

    const mousePos = stageRef.current.getPointerPosition();
    
    setShadowTileParams({
      ...shadowTileParams,
      x: mousePos.x - stagePosition.x,
      y: mousePos.y - stagePosition.y,
      visible: true,
      opacity: 0.6
    });
  }

  const handleGridDragEnd = (e) => {
    if(tilesLocked && stageRef.current && e.currentTarget.x() !== 0 || e.currentTarget.y() !== 0) {
      setStagePosition({...stagePosition, x: e.currentTarget.x(), y: e.currentTarget.y()});
      setGridCentered(false);
      updateGridProps(e.currentTarget.position());
    }
  };

  const handleStageClick = (e) => {
    const target = e.target;
    
    setShadowTileParams({ ...shadowTileParams, opacity: 0, visible: false })

    if(e.evt.which === 3) {
      setActivePin(null);
 
    } else {
      setContextMenuActive(false);
    }

    if(activePin !== null && e.evt.which === 1 && target.attrs.className !== "map-pin") {
      setDraggingPin({x: 0, y: 0});
      const idx = uuidv4();

      const pin = {
        idx: idx,
        type: activePin,
        x: e.evt.clientX - stagePosition.x - 5,
        y: e.evt.clientY - stagePosition.y - grid.tileSize * 2,
        fill: pinColors[activePin],
        data: null,
      }
      setMapPins([...mapPins, pin]);
    }
  };

  /**
   * MAP CONTROL FUNCTIONS
   */
  const handleTileLock = () => {
    setTilesLocked((prev) => !prev);
  };

  const recenterGrid = () => {

    if (stagePosition.x !== stagePosition.recenterX || stagePosition.y !== stagePosition.recenterY) {
      setStagePosition({ ...stagePosition, x: stagePosition.recenterX, y: stagePosition.recenterY });
      setGridCentered(true);
    }
  };

  const clearMap = () => {
    setMapLayout([]);
  }

  /**
   * TILE METHODS
   */
  const handleTileDragStart = (e) => {
    // anything that should be done when the user STARTS dragging a tile
    // this is essentially also a SINGLE CLICK response, so be careful!
    const xCoord = Math.round(e.target.x() / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(e.target.y() / grid.tileSize) * grid.tileSize;
    setLastLegitSquare({x: xCoord, y: yCoord});
    setContextMenuActive(false);
    setActivePin(null);

    setShadowTileParams({
      ...shadowTileParams,
      x: xCoord,
      y: yCoord,
      visible: true,
      opacity: 0.6
    });
  };

  const handleTileDragMove = (e) => {
    const target = e.target;

    const xCoord = Math.round(target.x() / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(target.y() / grid.tileSize) * grid.tileSize;

    const layerChildren = stageRef.current.children[1].children;

    if(layerChildren.length === 1) {
      setLastLegitSquare({x: xCoord, y: yCoord});
      setShadowTileParams({
        ...shadowTileParams,
        x: xCoord,
        y: yCoord,
      });

    } else {
      const filteredChildren = layerChildren.filter(child => child.attrs.x === xCoord && child.attrs.y === yCoord)
      if(filteredChildren.length === 0) {
        setLastLegitSquare({x: xCoord, y: yCoord});
        setShadowTileParams({
          ...shadowTileParams,
          x: xCoord,
          y: yCoord,
        });
      }
    }
  }

  const handleTileDragEnd = (e) => {
    const target = e.target;
    const id = target.id();

    target.to({...lastLegitSquare, duration: 0});
    const {x, y} = lastLegitSquare;

    updateTileCoordinates(id, x, y);

    setShadowTileParams({
      ...shadowTileParams,
      visible: false,
      opacity: 0,
      x: 0,
      y: 0
    });
  };

  const updateTileCoordinates = (id, x, y) => {
    const layout = [...mapLayout];
    for(var i = 0; i < layout.length; i++) {
      let tile = layout[i];
      if(tile.idx === id) {
        tile.x = x / grid.tileSize;
        tile.y = y / grid.tileSize;
      }
    }
    
    setMapLayout(layout);
  };

  const handleNewTileDrop = (e) => {
    e.preventDefault();

    const tileData = JSON.parse(e.dataTransfer.getData("dropped_tile"));
    const idx = uuidv4();

    stageRef.current.setPointersPositions(e)

    const srPos = stageRef.current.getPointerPosition();

    const xCoord = Math.round((srPos.x - stagePosition.x) / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round((srPos.y - stagePosition.y) / grid.tileSize) * grid.tileSize;

    const tile = {
      idx: idx,
      imgKey: `tm-${tileData.TileId}`,
      TileId: tileData.TileId,
      x: xCoord / grid.tileSize,
      y: yCoord / grid.tileSize,
      image_src: tileData.image_src,
      rotation: 0,
      scale: { x: 1, y: 1 },
    };

    setMapLayout([
      ...mapLayout,
      tile
    ]);
  };

  /**
   * TILE CONTROLS "CONTEXT MENU"
   */
  const handleRightClick = (e) => {
    e.evt.preventDefault();

    setContextMenuActive(false);
    setActivePin(null);

    let target = e.target;
    if(target.attrs.className === 'tile-image') {
      target = target.parent;
      setContextMenuActive(true);
    }

    if (target.attrs.className === "tile-image-group") {
      setActiveTile(target);

      const xCoord = target.attrs.x;
      const yCoord = target.attrs.y;

      setTileControlsPosition({
        left: xCoord + stagePosition.x - 25,
        top: yCoord + stagePosition.y - 25
      });

      setContextMenuActive(true);
    }
  };

  const handleTileControlAction = (e) => {
    let action = e.target.closest("button") !== null ? e.target.closest("button").dataset.action : null;

    if(action !== null) {
      let tile = activeTile.children[0];
      let rotation = tile.attrs.rotation !== undefined ? tile.attrs.rotation : 0;
      let scale = tile.attrs.scaleX !== undefined ? {x: tile.attrs.scaleX, y: tile.attrs.scaleY} : {x: 1, y: 1};

      if(scale.x === -1) {
        if(e.target.closest("button").dataset.action === "rotateRight") {
          action = "rotateLeft"

        } else if(e.target.closest("button").dataset.action === "rotateLeft") {
          action = "rotateRight"
        }
      }

      if(action === "rotateRight") {
        if(rotation === 270) {
          rotation = 0;
        } else {
          rotation += 90;
        }
      }

      if(action === "rotateLeft") {
        if(rotation === 0) {
          rotation = 270;
        } else {
          rotation -= 90;
        }
      }

      if(action === "mirror") {
        const scaleX = scale.x * -1;
        const scaleY = scale.y * -1;
        scale = {x: rotation === 0 || rotation === 180 ? scaleX : scale.x, y: rotation === 90 || rotation === 270 ? scaleY : scale.y}
      }

      let newLayout = [...mapLayout];

      if(action !== "delete") {
        for(var i = 0; i < newLayout.length; i++) {
          if(newLayout[i].idx === activeTile.attrs.id) {
            newLayout[i].rotation = rotation;
            newLayout[i].scale = scale;
          }
        }
      } else {
        newLayout = mapLayout.filter(tile => tile.idx !== activeTile.attrs.id);
        setContextMenuActive(false);
      }

      setMapLayout(newLayout);
    }
  }

  /**
   * PINS
   */
  const handlePinClick = (e) => {
    const pinType = e.target.closest('button').dataset.pintype;
 
    if(pinsVisible && (activePin !== pinType || activePin === null)) {
      setActivePin(pinType);
      setShadowPinParams({
        ...shadowPinParams,
        visible: true
      })

    } else {
      setActivePin(null);
      setShadowPinParams({
        ...shadowPinParams,
        visible: false
      })
    }
  }

  const handlePinDragEnd = (e) => {
    const idx = e.target.id();

    const pins = [...mapPins];
    for(var i = 0; i < pins.length; i++) {
      let pin = pins[i];
      if(pin.idx === idx) {
        pin.x = e.target.x();
        pin.y = e.target.y();
      }
    }
    
    setMapPins(pins);
    setDraggingPin({x: 0, y: 0});
  }

  const handlePinOnClick = (e) => {
    console.log("::cMC.781:: pin onClick", e);
  }

  const clearPins = () => {
    setMapPins([]);
    setActivePin(null);
  }

  const togglePins = e => {
    setPinsVisible(e.target.checked)
  }

  /**
   * RENDER / SAVE / ETC. HANDLING
   */
  const renderImage = (renderWithPins) => {
    let target = stageRef.current.children[2];
    console.log("::cMC.798:: render target", target)
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

  return (
    <div ref={mapCanvasContainerRef} style={{position: 'relative', margin: 0, padding: 0}}>
      <MapControls
        controlsData={{ 
          toggleTileLock: { 
            props: {checked: tilesLocked, onChange: handleTileLock, name: "toggleTileLock"}, 
            args: { visible: props.infiniteGrid }
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
            props: {onClick: handlePinClick},
            activePin: activePin
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
          }
        }} 
      />

      {/* MAP CANVAS CONTAINER */}
      <div
        ref={stageParentRef}
        id="map-builder-stage-container"
        className={classes.mapCanvasContainer}
        onDrop={(e) => handleNewTileDrop(e)}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => handleGridDragEnter(e)}
        style={{
          width: grid.containerWidth, 
          height: grid.containerHeight,
          backgroundColor: savedMap !== null && savedMap.environment !== "" ? environmentColors[savedMap.environment] : 'grey'
        }}
      >
        <Stage
          container="#map-builder-stage-container"
          ref={stageRef}
          width={window.innerWidth + grid.tileSize}
          height={window.innerHeight + grid.tileSize}
          draggable={tilesLocked}
          x={stagePosition.x}
          y={stagePosition.y}
          onClick={(e) => handleStageClick(e)}
          onContextMenu={(e) => handleRightClick(e)}
          onDragEnd={(e) => handleGridDragEnd(e)}
          onMouseEnter={(e) => handleMouseEnter(e, 'stage', 'move')}
          onMouseMove={() => handleMouseMoveOverStage()}
          onMouseLeave={handleMouseLeave}
        >
          {/* grid coordinate/"checkerboard" squares layer */}
          <Layer visible={!props.viewState}>
            {coordinateSquares}
          </Layer>

          {/* SHADOW TILE (MUST be on it's own layer or it interferes rendering!) */}
          <Layer id="shadow-tile-container" x={0} y={0}>
          <Rect {...shadowTileParams} />
          </Layer>

          {/* TILES + PINS */}
          <Layer id="tiles-layer" x={0} y={0} >
      
            {/* TILES */}
            {mapLayout.map((tile) => 
              <CanvasTile
                key={tile.idx}
                id={tile.idx}
                draggable={!tilesLocked}
                imgKey={tile.imgKey}
                image_src={tile.image_src}
                width={grid.tileSize}
                height={grid.tileSize}
                rotation={tile.rotation}
                scale={tile.scale}
                x={tile.x * grid.tileSize}
                y={tile.y * grid.tileSize}
                onDragStart={handleTileDragStart}
                onDragMove={handleTileDragMove}
                onDragEnd={handleTileDragEnd}
                onMouseEnter={(e) => handleMouseEnter(e, 'tile', 'move')}
                onMouseLeave={handleMouseLeave}
              />
            )}
            {/* PINS */}
            {mapPins.map(pin => {
              let x = pin.x; let y = pin.y;
              if(draggingPin.x === 0 && draggingPin.y === 0) {
                x = pin.x;
                y = pin.y - (grid.tileSize / 5);
              } else {
                x = pin.x;
                y = pin.y;
              }
              return (<Spring
                key={`$pin-{pin.x}-${pin.y}`}
                // native
                from={{ 
                  opacity: draggingPin ? 0 : 1,
                  x: x,
                  y: y,
                }}
                to={{ y: pin.y, opacity: 1, x: pin.x }}
                config={{velocity: 5, friction: 10, mass: 2}}
                // config={{mass: 2, tension: 270, friction: 40, clamp: false, velocity: 2}}
                draggable={!tilesLocked}
              >
                {props => (
                  <animated.Path
                  className="map-pin"
                  id={pin.idx}
                  x={props.x} 
                  y={props.y} 
                  fill={pin.fill}
                  draggable={!tilesLocked}
                  strokeWidth={0}
                  data="M0,27 Q0,28 10,15 A15,15 0,1,0 -10,15 Q0,28 0,27" 
                  visible={pinsVisible}
                  onClick={(e) => handlePinOnClick(e)}
                  onDragStart={(e) => setDraggingPin({x: e.target.x(), y: e.target.y()})}
                  onDragEnd={(e) => handlePinDragEnd(e)}
                  onMouseEnter={(e) => handleMouseEnter(e, 'pin', 'pointer')}
                  onMouseLeave={handleMouseLeave}
                />
                )}
              </Spring>)
            })}
          </Layer>
          
          {/* MAP PINS */}
          {/* <Layer id="pins-layer" x={0} y={0} visible={pinsVisible}>
           
          </Layer> */}
        
          {/* "shadow" pin (for placement) */}
          {/* <Layer id="shadow-pin-container" x={0} y={0}>
            <Path {...shadowPinParams} />
          </Layer> */}
        </Stage>
      </div>
      {/* NOT Canvas elements */}
      <MapTileControls id="tile-controls" contextMenuActive={contextMenuActive} top={tileControlsPosition.top} left={tileControlsPosition.left} handleTileControlAction={handleTileControlAction} />
    </div>
  );
}
