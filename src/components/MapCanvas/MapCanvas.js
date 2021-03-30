import { useState, useRef, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Stage, Layer, Group, Rect, Text, Path } from "react-konva";
import { Spring, animated } from 'react-spring/renderprops-konva'

import CanvasTile from "../MapTile";
import MapTileControls from "../MapTileControls";
import { CanvasContext } from "../../contexts/CanvasContext";

import GeneralFunctions from '../../utils/GeneralFunctions'

// for exporting image from canvas
const { v4: uuidv4 } = require('uuid');

const useStyles = makeStyles({
  mapCanvasContainer: {
    overflow: "hidden",
    position: "relative", 
    margin: 0,
    padding: 0,
    background: "white", 
    // border: "4px solid black",
  },
  shadowPin: {
    boxSizing: 'border-box',
    display: 'none',
    position: 'absolute',
    backgroundColor: 'white',
    opacity: 0.6,
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
  shadowDivTile: {
    position: 'absolute',
    background: '#ff7b17',
    border: '3px dashed #cf6412',
    zIndex: 500,
    width: 100,
    height: 100,
    opacity: 0.6,
    display: 'block'
  }
})

// infinite grid demo: https://codesandbox.io/s/kkndq?file=/src/index.js:200-206
// snapping & shadow tile demo: https://codepen.io/pierrebleroux/pen/gGpvxJ?editors=0010
export default function MapCanvas(props) {
  const classes = useStyles();

  // for loading a specific map from saved maps
  const { id } = useParams();

  const { canvasData } = useContext(CanvasContext);

  const {
    mapSettings, mapData,
    setStageRef, setStageParentRef,
    gridDefaults, grid, setGrid,
    stagePositionDefault, stagePosition, setStagePosition,
    tilesLocked, setGridCentered,
    mapLayout, setMapLayout,
    mapPins, setMapPins,
    pinsVisible,
    activePin, setActivePin,
    shadowPinParams, setShadowPinParams,
    pinColors, viewState
  } = canvasData

  let { stageRef, stageParentRef } = canvasData;
  stageRef = useRef(null);
  stageParentRef = useRef(null);

  // const [draggingPin, setDraggingPin] = useState({x: 0, y: 0});

  const [contextMenuActive, setContextMenuActive] = useState(false);
  const [tileControlsPosition, setTileControlsPosition] = useState({top: 0, left: 0});

  const [activeTile, setActiveTile] = useState(null);
  
  const [coordinateSquares, setCoordinateSquares] = useState([]);

  const [shadowTileParams, setShadowTileParams] = useState({
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

  const [lastLegitSquare, setLastLegitSquare] = useState({x: 0, y: 0});

  // donjon has 19
  const environmentColors = [
    "white", // default (0 index)
    "#cde6f5", // arctic
    "#f7bfb4", // coastal
    "#cec075", // desert
    "#295135", // forest
    "#9fcc2e", // grassland 90a959
    "#7daf9c", // hill
    "#3f7d20", // jungle
    "#454955", // mountain
    "#5a6650", // swamp
    "#0d0a0b", // underdark
    "#0081af", // underwater
    "#59656f", // urban
    "#745296", // celestial plane
    "#1d1e2c", // abyssal plane 151515
    "#a63d40", // infernal plane
    "#6494aa", // elemental air
    "#554640", // elemental earth
    "#dc602e", // elemental fire
    "#05a8aa", // elemental water
  ]

  // for now, just resets everything to "blank" if the stuff in localStorage is for a saved map
  // and we're opening the builder page "raw" (not loading a saved map)
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('dungen_map_settings')) || null;

    if(savedSettings !== null && savedSettings.id !== null && props.mapId === undefined) {
      setMapLayout([]);
      setMapPins([]);
      setGrid(gridDefaults);
      setStagePosition(stagePositionDefault)
    }

  }, [props])

  useEffect(() => {
    updateStagePosition()
  }, [mapLayout]);

  /**
   * SETTING HEIGHT & WIDTH OF STAGE
   * to fill window, with no overflow
   * 
   */
   useEffect(() => {
    if(stageParentRef.current) {
      setStageParentRef(stageParentRef);
      setGrid({
        ...grid,
        containerWidth: window.innerWidth - 380, // 380 = width of superdrawer
        containerHeight: window.innerHeight - 75, // 75 = navbar height
      });

      if(mapSettings !== null) {
        setStageRef(stageRef);
        stageParentRef.current.style.backgroundColor = environmentColors[mapSettings.EnvironmentId]
      }
    }
  
  }, [stageParentRef, stageRef]);

  /**
   * checking props.init & mapSettings for changes
   * e.g. to environment or # of rows/columns
   */
  useEffect(() => {
    const rows = mapSettings.rows !== null ? mapSettings.rows : 20;
    const columns = mapSettings.columns !== null ? mapSettings.columns : 40

    const newGrid = {
      ...grid,
      rows: rows,
      columns: columns,
      infinite: mapSettings.infinite,
      startX: 0,
      startY: 0,
      endX: grid.tileSize * grid.columns - grid.tileSize,
      endY: grid.tileSize * grid.rows - grid.tileSize,
    };

    setGrid(newGrid);

    createGrid();
    updateStagePosition();

  }, [mapSettings]);

  /**
   * REBUILD GRID & SAVE DATA TO LOCALSTORAGE
   */
  useEffect(() => {
    createGrid();

    localStorage.setItem('dungen_stageposition', JSON.stringify(stagePosition));

  }, [stagePosition]);

  /**
   * UPDATING LOCAL STORAGE
   * this happens when the map layout changes
   */
  useEffect(() => {
    
    createGrid();

    // eslint-disable-next-line
  }, [mapLayout, mapPins, pinsVisible]);

  /**
   * MAP LAYOUT FOR PREVIOUSLY SAVED MAPS
   */
  // useEffect(() => {
  //   // does nothing for now
  // }, [mapLayout]);

  const updateStagePosition = () => {
    
    if(!mapData.infinite) {
      const gridWidth = grid.tileSize * grid.columns;
      const gridHeight = grid.tileSize * grid.rows;

      const xOffset = ((window.innerWidth - 380) - (grid.tileSize * grid.columns)) / 2;
      const yOffset = ((window.innerHeight - 75) - (grid.tileSize * grid.rows)) / 2;

      let newStagePosition = {...stagePosition}

      if(window.innerWidth - 380 > gridWidth) {
        newStagePosition = {...newStagePosition, x: xOffset, recenterX: xOffset}
      } else {
        newStagePosition = { ...newStagePosition, x: 0, recenterX: 0 }
      }

      if(window.innerHeight - 75 > gridHeight) {
        newStagePosition = {...newStagePosition, y: yOffset, recenterY: yOffset}
      } else {
        newStagePosition = { ...newStagePosition, y: 0, recenterY: 0 }
      }
      setStagePosition(newStagePosition);
      localStorage.setItem('dungen_stageposition', JSON.stringify(newStagePosition));
    }
    createGrid();
  }

  const createGrid = () => {
    const gridInit = grid.infinite ? grid : { ...grid, startX: 0, startY: 0, endX: grid.tileSize * grid.columns, endY: grid.tileSize * grid.rows };
    
    var i = 0;

    const environmentColor = environmentColors[mapSettings.EnvironmentId];
    const textColor = GeneralFunctions.contrastColor(environmentColor);
    let cSquareColor = "#00000033";
    // if text is light, bg is dark, let's make cSquares less transparent (so they're darker)
    if(textColor === "#eeeeee") {
      cSquareColor = "#00000077";
    }

    const gridColors = [
      [cSquareColor, "transparent"],
      ["transparent", cSquareColor],
    ];

    const cSquares = [];

    for (var x = gridInit.startX; x < gridInit.endX; x += gridInit.tileSize) {
      for (var y = gridInit.startY; y < gridInit.endY; y += gridInit.tileSize) {
        if (i === 4) {
          i = 0;
        }

        const ix = Math.abs(x / gridInit.tileSize) % gridColors.length;
        const iy = Math.abs(y / gridInit.tileSize) % gridColors[0].length;

        //let textColor = "#373737";
        //const darkEnvironments = [4,7,8,9,10,11,12,13,14,15,16,19,17,18] // 9 (swamp), 11 (underwater), 16 (elemental air), 19 (elemental water)
        

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
              fill={textColor}
              // strokeWidth={0}
            />
          </Group>
        );
      }
    }

    if(cSquares.length > 0) {
      setCoordinateSquares(cSquares);
    }
  }
  
  // const updateGridProps = (position = null) => {
  //   if(position === null) { position = stagePosition; }
  //   // let { containerWidth, containerHeight } = grid;
  //   // if(mapData.infinite) {
  //   //   containerWidth = window.innerWidth - 380;
  //   //   containerHeight = window.innerHeight - 75;
  //   // }

  //   // const startX = 0;
  //   // const startY = 0;
  //   // const endX = (grid.tileSize * grid.rows) + stagePosition.x;
  //   // const endY = (grid.tileSize * grid.columns) + stagePosition.y;

  //   // const gridInit = {
  //   //   ...grid,
  //   //   startX: 0,
  //   //   endX: 0,

  //   //   startY: 0,
  //   //   endY: 0,
  //   // };

  //   // setGrid(gridInit);
  //   // return gridInit;
  // };

  /**
   * GENERAL FUNCTIONS
   */
  const handleMouseEnter = (e, target, cursorStyle) => {
    // console.log("mapcanvas.418 handleMouseEnter event", e);

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
    // console.log("activePin?", activePin);
    if(activePin !== null) {
      const mousePos = stageRef.current.getPointerPosition();

      setShadowPinParams({
        ...shadowPinParams,
        left: mousePos.x,
        top: mousePos.y
        // left: mousePos.x - 20,
        // top: mousePos.y - 48
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

  const handleGridDragEnter = (e) => {
    e.preventDefault();

    setContextMenuActive(false);

    setShadowTileParams({
      ...shadowTileParams,
      opacity: 0.6,
      visible: true
    })
  }

  const handleGridDragOver = (e) => {
    e.preventDefault();
    // Math.round(pos.x / grid.tileSize) * grid.tileSize
    checkTileIntersects({ 
      x: Math.round(e.pageX / grid.tileSize) * grid.tileSize, 
      y: (Math.round(e.pageY / grid.tileSize) * grid.tileSize) - grid.tileSize 
    });
  }

  const handleGridDragEnd = (e) => {
    if(tilesLocked && (e.currentTarget.x() !== 0 || e.currentTarget.y() !== 0)) {
      setStagePosition({...stagePosition, x: e.currentTarget.x(), y: e.currentTarget.y()});
      setGridCentered(false);
      // updateGridProps(e.currentTarget.position());
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
      // setDraggingPin({x: 0, y: 0});
      const idx = uuidv4();

      const pin = {
        idx: idx,
        EncounterType: (activePin).substr(4,1),
        x: e.evt.clientX - stagePosition.x,
        y: e.evt.clientY - stagePosition.y - grid.tileSize,
        fill: pinColors[(activePin).substr(4,1)],
        data: null,
      }
      setMapPins([...mapPins, pin]);
    }
  };

  /**
   * TILE METHODS
   */
  const tilePos = (pos) => {
    let xCoord = Math.round((pos.x - stagePosition.x) / grid.tileSize) * grid.tileSize;
    let yCoord = Math.round((pos.y - stagePosition.y) / grid.tileSize) * grid.tileSize;

    // if(grid.infinite) {
    //   xCoord = Math.round((pos.x) / grid.tileSize) * grid.tileSize;
    //   yCoord = Math.round((pos.y) / grid.tileSize) * grid.tileSize;
    // }

    return { x: xCoord, y: yCoord }
  }

  const handleTileDragStart = (e) => {
    // anything that should be done when the user STARTS dragging a tile
    // this is essentially also a SINGLE CLICK response, so be careful!
    // console.log("mapcanvas.598:: e.target.attrs", e.target.attrs.x, e.target.attrs.y);
    const currentPosition = { x: e.target.attrs.x, y: e.target.attrs.y }
    const { x, y } = currentPosition;

    setLastLegitSquare({x: x, y: y});
    setContextMenuActive(false);
    setActivePin(null);

    setShadowTileParams({
      ...shadowTileParams,
      x: x,
      y: y,
      visible: true,
      opacity: 0.6
    });
  };

  const handleTileDragMove = (e) => {
    checkTileIntersects({ 
      x: e.target.x() + stagePosition.x, 
      y: e.target.y() + stagePosition.y
    });
  }

  const checkTileIntersects = (pos) => {
    const { x, y } = tilePos(pos);

    // basically, if the x && y coordinates are within the defined grid space, check for intersections
    // otherwise, the tile simply can't be placed there
    // console.log("tile intersects", grid.startX, grid.endX)
    if( x >= grid.startX && x <= grid.endX && y >= grid.startY && y <= grid.endY ) {
      // 0 === coordgrid, 1 === shadow tile, 2 === map tiles + pins
      const layerChildren = stageRef.current.children[2].children;

      if(layerChildren.length === 1) {
        setLastLegitSquare({x: x, y: y});
        setShadowTileParams({
          ...shadowTileParams,
          x: x,
          y: y,
        });

      } else {
        const filteredChildren = layerChildren.filter(child => child.attrs.x === x && child.attrs.y === y)
        if(filteredChildren.length === 0) {
          setLastLegitSquare({x: x, y: y});
          setShadowTileParams({
            ...shadowTileParams,
            x: x,
            y: y,
          });
        }
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
    const layout = [...mapLayout]

    for(var i = 0; i < layout.length; i++) {
      let tile = layout[i];
      if(tile.idx === id || tile.id === id) {
        tile.x = x / grid.tileSize;
        tile.y = y / grid.tileSize;
      }
    }
    
    setMapLayout(layout);
  };

  const handleNewTileDrop = (e) => {
    e.preventDefault();

    // console.log("::cMC.643:: new tile drop", e);

    const tileData = JSON.parse(e.dataTransfer.getData("dropped_tile"));
    const idx = uuidv4();

    stageRef.current.setPointersPositions(e)

    const tile = {
      idx: idx,
      imgKey: `tm-${tileData.TileId}`,
      TileId: tileData.TileId,
      MapTileId: null,
      x: lastLegitSquare.x / grid.tileSize,
      y: lastLegitSquare.y / grid.tileSize,
      image_src: tileData.image_src,
      rotation: 0,
      scale: { x: 1, y: 1 },
    };

    setMapLayout([
      ...mapLayout,
      tile
    ]);

    setShadowTileParams({
      ...shadowTileParams,
      x: -500,
      y: -500,
      visible: false,
      opacity: 0
    });
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
      target = target.getParent();
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

    if(target.attrs.className === "map-pin") {
      target.remove();
    }
  };

  const handleTileControlAction = (e) => {
    let action = e.target.closest("button") !== null ? e.target.closest("button").dataset.action : null;
    let tile = activeTile .attrs.className === "tile-image-group" ? activeTile.children[0] : activeTile.attrs.className === "tile-image" ? activeTile : null;

    if(action !== null && tile !== null) {
      let newLayout = [...mapLayout];

      if(action !== "delete") {
        let rotation = tile.attrs.rotation !== undefined ? tile.attrs.rotation : 0;
        let scale = tile.attrs.scaleX !== undefined && tile.attrs.scaleY !== undefined ? {x: tile.attrs.scaleX, y: tile.attrs.scaleY} : {x: 1, y: 1};
        // console.log("STARTING rotation & scale", rotation, scale)
        
        // if(scale.x === -1) {
        //   console.log("scale.x === -1, rotateRight = rotateLeft / rotateLeft = rotateRight")
        //   if(e.target.closest("button").dataset.action === "rotateRight") {
        //     action = "rotateLeft"

        //   } else if(e.target.closest("button").dataset.action === "rotateLeft") {
        //     action = "rotateRight"
        //   }
        // }

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
        
        // console.log("NEW rotation & scale", rotation, scale)

        for(var i = 0; i < newLayout.length; i++) {
          if(newLayout[i].idx === activeTile.attrs.id || (newLayout[i].id !== undefined && newLayout[i].id === activeTile.attrs.id)) {
            newLayout[i].rotation = rotation;
            newLayout[i].scale = scale;
          }
        }
      } else {
        newLayout = mapLayout.filter(tile => tile.idx !== undefined ? tile.idx !== activeTile.attrs.id : tile.id !== activeTile.attrs.id);
        setContextMenuActive(false);

      }

      setMapLayout(newLayout);
    }
  }

  /**
   * PINS
   */

  const handlePinDragStart = (e) => {
    setActivePin(null);
    setShadowPinParams({
      ...shadowPinParams,
      display: 'none',
      top: -500,
      left: -500,
      opacity: 0
    })
    // setDraggingPin({x: e.target.x(), y: e.target.y()});
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
    // setDraggingPin({x: 0, y: 0});
  }

  const handlePinOnClick = (e) => {
    console.log("::cMC.781:: pin onClick", e);
  }

  return (
    <div style={{position: 'relative', margin: 0, padding: 0}}>

      {/* MAP CANVAS CONTAINER */}
      <div
        ref={stageParentRef}
        id="map-builder-stage-container"
        className={classes.mapCanvasContainer}
        onDrop={(e) => handleNewTileDrop(e)}
        onDragOver={(e) => handleGridDragOver(e)}
        onDragEnter={(e) => handleGridDragEnter(e)}
        style={{
          maxWidth: window.innerWidth,
          maxHeight: window.innerHeight - 77,
          backgroundColor: mapSettings !== null && mapSettings.EnvironmentId !== "" ? environmentColors[mapSettings.EnvironmentId] : environmentColors[0]
        }}
      >
        <Stage
          container="#map-builder-stage-container"
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
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
          <Layer visible={!viewState} name="coordinateGrid">
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
                key={tile.id !== undefined ? tile.id : tile.idx}
                id={tile.id !== undefined ? tile.id : tile.idx}
                draggable={!tilesLocked}
                imgKey={`img_${tile.id !== undefined ? tile.id : tile.idx}`}
                image_src={tile.Tile !== undefined ? tile.Tile.image_url : tile.image_src}
                width={grid.tileSize}
                height={grid.tileSize}
                rotation={tile.rotation}
                scale={tile.mirror !== undefined ? JSON.parse(tile.mirror) : tile.scale}
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
              let x = pin.x; let y = pin.y - (grid.tileSize / 5);
              return (
                // <Path
                //   className="map-pin"
                //   id={pin.id !== undefined ? pin.id : pin.idx}
                //   x={pin.x} 
                //   y={pin.y} 
                //   fill={pin.fill}
                //   draggable={!tilesLocked}
                //   strokeWidth={0}
                //   data="M0,27 Q0,28 10,15 A15,15 0,1,0 -10,15 Q0,28 0,27" 
                //   visible={pinsVisible}
                //   onClick={(e) => handlePinOnClick(e)}
                //   onDragStart={(e) => handlePinDragStart(e)}
                //   onDragEnd={(e) => handlePinDragEnd(e)}
                //   onMouseEnter={(e) => handleMouseEnter(e, 'pin', 'pointer')}
                //   onMouseLeave={handleMouseLeave}
                // />
              <Spring
                key={pin.idx}
                // native
                from={{ 
                  opacity: 1,
                  x: x,
                  y: y,
                }}
                to={{ y: pin.y, opacity: 1, x: pin.x }}
                config={{velocity: 1, friction: 21, mass: 2, delay: 100}}
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
                  onDragStart={(e) => handlePinDragStart(e)}
                  onDragEnd={(e) => handlePinDragEnd(e)}
                  onMouseEnter={(e) => handleMouseEnter(e, 'pin', 'pointer')}
                  onMouseLeave={handleMouseLeave}
                />
                )}
              </Spring>
              )
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

      <div id="shadowPin" className={classes.shadowPin} style={{...shadowPinParams, backgroundColor: activePin !== null ? pinColors[activePin] : 'grey'}}></div>
      {/* <div id="shadowDivTile" className={classes.shadowDivTile} style={{...shadowDivTileParams}}></div> */}
    </div>
  );
}
