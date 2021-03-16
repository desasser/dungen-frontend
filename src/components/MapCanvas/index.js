import React from "react";
import { useParams, useHistory } from 'react-router-dom';
import { Stage, Layer, Group, Rect, Text, Path } from "react-konva";
import { Spring, config, animated } from 'react-spring/renderprops-konva'

import MapControlsDrawer from './MapControlsDrawer';

import CanvasTile from "../Tile/CanvasTile";
import TileControls from "./TileControls";

// exporting image from canvas
// import imageDataURI from 'image-data-uri'
const { v4: uuidv4 } = require('uuid');

// infinite grid demo: https://codesandbox.io/s/kkndq?file=/src/index.js:200-206
// snapping & shadow tile demo: https://codepen.io/pierrebleroux/pen/gGpvxJ?editors=0010
export default function InfiniteCanvas(props) {
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

  const [viewState, setViewState] = React.useState(false);
  const [todaysDate, setTodaysDate] = React.useState();

  const [activePin, setActivePin] = React.useState(null);
  const [draggingPin, setDraggingPin] = React.useState({x: 0, y: 0});
  const [mapPins, setMapPins] = React.useState([]);
  const [pinsVisible, setPinsVisible] = React.useState(true);
  const [contextMenuActive, setContextMenuActive] = React.useState(false);

  const [tilesLocked, setTilesLocked] = React.useState(false);
  const [gridCentered, setGridCentered] = React.useState(true);
  const [stagePosition, setStagePosition] = React.useState({ x: 0, y: 0, recenterX: 0, recenterY: 0 });
  const [grid, setGrid] = React.useState({
    tileSize: tileSize,
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
    opacity: 0.6,
    stroke: "#cf6412",
    strokeWidth: 3,
    dash: [20, 2],
    visible: false,
  });
  const [lastLegitSquare, setLastLegitSquare] = React.useState({x: 0, y: 0});

  const [mapLayout, setMapLayout] = React.useState([]);

  /**
   * SETTING HEIGHT & WIDTH OF STAGE
   * based on stage container offset
   * 
   * also updates todaysDate & timestamp variables
   */
  React.useEffect(() => {
    handleDateTime();
    
    if(stageParentRef.current) {
      let offsetTop = stageParentRef.current.offsetTop;

      setGrid({
        ...grid,
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight - offsetTop - 8
      });

      stageParentRef.current.style.width = window.innerWidth - 9 + 'px';
      stageParentRef.current.style.height = window.innerHeight - offsetTop - 9 + 'px';
    }

    if(!props.infiniteGrid) {
      setGrid({
        ...grid,
        startX: 0,
        startY: 0,
        endX: grid.tileSize * grid.columns,
        endY: grid.tileSize * grid.rows
      });

      if(window.innerWidth > grid.tileSize * grid.columns) {
        const gridWidth = (window.innerWidth - (grid.tileSize * grid.columns)) / 2;
        setStagePosition({ ...stagePosition, x: gridWidth, recenterX: gridWidth })
      }

      if(window.innerHeight > grid.tileSize * grid.rows) {
        const gridHeight = (window.innerHeight - (grid.tileSize * grid.rows)) / 2;
        setStagePosition({ ...stagePosition, y: gridHeight, recenterY: gridHeight })
      }
    }

    // create grid on page load
    createGrid();
  
  }, [stageParentRef]);

  /**
   * INFINITE GRID *ONLY*
   */
  React.useEffect(() => {
    // console.log("infinite grid?", props.infiniteGrid, "coordinateSquares.length?", coordinateSquares.length);
    if(props.infiniteGrid) {
      createGrid();
    }

  }, [stagePosition]);

  /**
   * LOADING MAP FROM LOCAL STORAGE
   * this only happens once, on page load!
   */
   React.useEffect(() => {
    // console.log("LOCAL STORAGE", localStorage.getItem('dungen_map'));
    if(!props.init) {
      const savedMap = localStorage.getItem('dungen_map') !== null ? JSON.parse(localStorage.getItem('dungen_map')) : null;
      if(mapLayout.length === 0 && savedMap !== null && savedMap.layout !== undefined && savedMap.layout.length > 0) {
        setMapLayout([...savedMap.layout]);
      }

      if(mapPins.length === 0 && savedMap !== null && savedMap.pins !== undefined && savedMap.pins.length > 0) {
        setMapPins([...savedMap.pins]);
      }
    }
  }, []);

  /**
   * UPDATING LOCAL STORAGE
   * this happens when the map layout changes
   */
  React.useEffect(() => {
    // console.log("map layout changed", mapLayout);
    const savedMap = localStorage.getItem('dungen_map') !== null ? JSON.parse(localStorage.getItem('dungen_map')) : null;
    let mapData = {
      layout: mapLayout,
      pins: mapPins
    }
    if(savedMap === null || (savedMap.layout !== undefined && savedMap.layout !== mapLayout && mapLayout.length > 0) || (savedMap.pins !== undefined && savedMap.pins !== mapPins && mapPins.length > 0)) {
      localStorage.setItem('dungen_map', JSON.stringify(mapData));
    }
    
    // eslint-disable-next-line
  }, [mapLayout, mapPins]);

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

    if(today !== todaysDate) { setTodaysDate(today); }

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
   * GRID METHODS
   */
  const createGrid = () => {
    const gridInit = props.infiniteGrid ? updateGridProps(stagePosition) : { ...grid, startX: 0, startY: 0, endX: props.tileSize * props.columns, endY: props.tileSize * props.rows };

    var i = 0;
    const gridColors = [
      ["rgba(200,200,200,0.5)", "transparent"],
      ["transparent", "rgba(200,200,200,0.5)"],
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
              fill="grey"
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

  const handleGridDragEnd = (e) => {
    if(tilesLocked && stageRef.current && e.currentTarget.x() !== 0 || e.currentTarget.y() !== 0) {
      setStagePosition({...stagePosition, x: e.currentTarget.x(), y: e.currentTarget.y()});
      setGridCentered(false);
      updateGridProps(e.currentTarget.position());
    }
  };

  const handleStageClick = (e) => {
    setContextMenuActive(false);

    const target = e.target;

    if (target.attrs.className !== "tile-image") {
      const menuNode = document.querySelector("#tile-controls");
      menuNode.style.display = "none";
      setContextMenuActive(false);
    }

    if(activePin !== null && e.evt.which === 1 && target.attrs.className !== "map-pin") {
      setDraggingPin({x: 0, y: 0});
      const idx = uuidv4();

      let fillColor = 'forestgreen'; // type1
      if(activePin === 'type2') { fillColor = 'firebrick'; }
      if(activePin === 'type3') { fillColor = 'orchid'; }
      if(activePin === 'type4') { fillColor = 'dodgerblue'; }
      if(activePin === 'type5') { fillColor = 'salmon'; }

      const pin = {
        idx: idx,
        type: activePin,
        x: e.evt.clientX - stagePosition.x - 5,
        y: e.evt.clientY - stagePosition.y - grid.tileSize * 1.9,
        fill: fillColor,
        data: null,
      }
      setMapPins([...mapPins, pin]);
      setContextMenuActive(false);
    }
    console.log(contextMenuActive)
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

    // localStorage.setItem('dungen_map', JSON.stringify({layout: []}));
  }

  /**
   * TILE METHODS
   */
  const handleTileDragStart = (e) => {
    console.log("handleTileDragStart", e);
    // anything that should be done when the user STARTS dragging a tile
    // this is essentially also a SINGLE CLICK response, so be careful!
    const xCoord = Math.round(e.target.x() / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(e.target.y() / grid.tileSize) * grid.tileSize;
    setLastLegitSquare({x: xCoord, y: yCoord});
    setActivePin(null);

    setShadowTileParams({
      ...shadowTileParams,
      x: xCoord,
      y: yCoord,
      visible: true,
    });
    document.querySelector("#tile-controls").style.display = "none";
  };

  const handleTileDragMove = (e) => {
    const target = e.target;

    const xCoord = Math.round(target.x() / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(target.y() / grid.tileSize) * grid.tileSize;

    const layerChildren = stageRef.current.children[2].children;

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
    const target = e.target;
    console.log(target);

    const menuNode = document.querySelector("#tile-controls");

    if (target === stageRef || target.attrs.className !== "tile-image") {
      menuNode.style.display = "none";
      setActivePin(null);
      return;
    }

    if (target.attrs.className === "tile-image") {
      target.strokeWidth(2);
      target.stroke("red");
      console.log(target.strokeWidth());
      const xCoord = Math.floor(e.evt.clientX / grid.tileSize) *  grid.tileSize;
      const yCoord = Math.round(e.evt.clientY / grid.tileSize) *  grid.tileSize;

      menuNode.style.display = "initial";
      menuNode.style.top = yCoord - (grid.tileSize) + 'px';
      menuNode.style.left = xCoord - (grid.tileSize) + 'px';
      setContextMenuActive(true);
    }
  };

  /**
   * PINS
   */
  const handlePinClick = (e) => {
    const pinType = e.target.closest('button').dataset.pintype;
    console.log(pinType);
 
    if(activePin !== pinType || activePin === null) {
      setActivePin(pinType);
    } else {
      setActivePin(null);
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
    console.log("handlePinOnClick", e);
  }

  const clearPins = () => {
    setMapPins([]);
    setActivePin(null);
  }

  const togglePins = e => {
    setPinsVisible(e.target.checked)
  }

  /**
   * PREVIEW / SAVE / ETC. HANDLING
   */
  const previewImage = (previewWithPins) => {
    let target = stageRef.current.children[2];

    if(previewWithPins && mapPins.length > 0) {

      let layer = stageRef.current.children[2];
      const pinsLayer = stageRef.current.children[3];

      // console.log("pins layer", pinsLayer);
      for(var i = 0; i < pinsLayer.children.length; i++) {
        layer.children.push(pinsLayer.children[i])
      }

      target = layer;
    }

    let sortedByXCoords = [...target.children].sort((a,b) => a.attrs.x < b.attrs.x ? 1 : -1);
    let sortedByYCoords = [...target.children].sort((a,b) => a.attrs.y < b.attrs.y ? 1 : -1);

    let x = sortedByXCoords[sortedByXCoords.length - 1].attrs.x;
    let y = sortedByYCoords[sortedByYCoords.length - 1].attrs.y;
    let mapWidth = (sortedByXCoords[0].attrs.x + grid.tileSize) - sortedByXCoords[sortedByXCoords.length - 1].attrs.x;
    let mapHeight = (sortedByYCoords[0].attrs.y + grid.tileSize) - sortedByYCoords[sortedByYCoords.length - 1].attrs.y;

    // console.log("map height / width", mapHeight, mapWidth, "xy", x, y);

    const uri = target.toDataURL({x: stagePosition.x + x, y: stagePosition.y + y, width: mapWidth, height: mapHeight}); // requires CORS!
    localStorage.setItem('dungen_map_image', uri);
    // console.log(uri);

    history.push(`/preview`);
  }

  return (
    <>
      <MapControlsDrawer 
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
        previewImage: {
          onClick: previewImage,
          args: {mapLayoutLength: mapLayout.length},
          text: mapLayout.length > 0 ? 'Preview Image' : 'Nothing to Preview'
        }
        }} 
      />

        {/* MAP CANVAS CONTAINER */}
        <div
          ref={stageParentRef}
          id="map-builder-stage-container"
          onDrop={(e) => handleNewTileDrop(e)}
          onDragOver={(e) => e.preventDefault()}
          style={{overflow: "hidden", position: "relative", margin: "0 auto", background: "white", border: "4px solid black", width: grid.containerWidth, height: grid.containerWidth}}
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
            // onDragStart={(e) => {console.log("started dragging grid from", e.currentTarget.position())}}
            onDragEnd={(e) => handleGridDragEnd(e)}
            onMouseEnter={(e) => tilesLocked ? stageRef.current.container().style.cursor = 'move' : stageRef.current.container().style.cursor = 'default'}
            onMouseLeave={(e) => stageRef.current.container().style.cursor = 'default'}
          >
            {/* grid coordinate/"checkerboard" squares layer */}
            <Layer visible={!props.viewState}>
              {coordinateSquares}
            </Layer>

            {/* "shadow" tiles */}
            <Layer id="shadow-tile-container" x={0} y={0}>
            <Rect {...shadowTileParams} />
            </Layer>

            {/* ACTUAL TILES LAYER */}
            <Layer
            id="tiles-layer"
            x={0}
            y={0}
            
            >
            {
              mapLayout.map((tile) => 
                <Spring
                  key={tile.idx}
                  from={{ dash: 100 }}
                  to={{ dash: 0 }}
                >
                  {props => (
                    <CanvasTile
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
                      // stroke path props
                      strokeDashoffset={contextMenuActive ? props.dash : 0}
                    />
                  )}
                </Spring>
              )
            }
            </Layer>
            {/* MAP PINS */}
            <Layer id="pins-layer" x={0} y={0} visible={pinsVisible}>
              {
              mapPins.map(pin => {
                let x = pin.x; let y = pin.y;
                if(draggingPin.x === 0 && draggingPin.y === 0) {
                  x = pin.x;
                  y = pin.y - (grid.tileSize / 5);
                } else {
                  x = draggingPin.x > pin.x ? pin.x + (grid.tileSize / 10) : pin.x - (grid.tileSize / 10);
                  y = draggingPin.y > pin.y ? pin.y + (grid.tileSize / 10) : pin.y - (grid.tileSize / 10);
                }
                // console.log("spring xy", x, y);
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
                    onClick={(e) => handlePinOnClick(e)}
                    onDragStart={(e) => setDraggingPin({x: e.target.x(), y: e.target.y()})}
                    onDragEnd={(e) => handlePinDragEnd(e)}
                  />
                  )}
                </Spring>)
              })
              }
            </Layer>
          </Stage>
        
          {/* NOT Canvas elements */}
          <TileControls id="tile-controls" display="none" />
        </div>
    </>
  );
}
