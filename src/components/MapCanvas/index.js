import React from 'react'
import { Stage, Layer } from 'react-konva'

import ActionButton from '../ActionButton'
import CoordinateGrid from './CoordinateGrid'

import TileControls from './TileControls'

import SliderDrawer from '../SliderDrawer'

export default function MapCanvas() {
  const stageRef = React.useRef();

  const [tilesLocked, setTilesLocked] = React.useState(false);
  const [gridCentered, setGridCentered] = React.useState(true);
  const [stagePosition, setStagePosition] = React.useState({ x: 0, y: 0 });
  const [grid, setGrid] = React.useState({
    tileSize: 100,
    columns: 10,
    rows: 6,
    windowWidth: 100 * 10,
    windowHeight: 100 * 6,
    startX: (100 * 10) * -100,
    startY: (100 * 6) * -100,
    endX: (100 * 10) * 100,
    endY: (100 * 6) * 100
  });
  
  const [shadowTileParams, setShadowTileParams] = React.useState({
    x: 0,
    y: 0,
    width: grid.tileSize,
    height: grid.tileSize,
    fill: '#ff7b17',
    opacity: 0.6,
    stroke: '#cf6412',
    strokeWidth: 3,
    dash: [20, 2],
    visible: false
  });

  // eslint-disable-next-line
  const [mapLayout, setMapLayout] = React.useState([]);
  /**
   * MAP LAYOUT UPDATES
   */
   React.useEffect(() => {
    console.log("map layout use effect triggered");
    if(mapLayout.length === 0) {
      const layout = [
        {
          groupKey: 'tg-1',
          imgKey: 'tm-1',
          x: 0,
          y: 0,
          image_src: "http://localhost:3030/assets/dungeon/LowRes/2EDC01.jpg",
          rotation: 0,
          scale: {x: 1, y: 1}
        },
        {
          groupKey: 'tg-2',
          imgKey: 'tm-2',
          x: 1,
          y: 1,
          image_src: "http://localhost:3030/assets/dungeon/LowRes/2EDC02.jpg",
          rotation: 0,
          scale: {x: 1, y: 1}
        }
      ];
  
      setMapLayout(layout);
    }
  
  // eslint-disable-next-line
  }, [mapLayout]);

  /**
   * GRID METHODS
   */
  const updateGridProps = () => {
    const wWidth = window.innerWidth - 20;
    const wHeight = window.innerHeight - 84;

    const gridInit = {
      ...grid,
      windowWidth: wWidth, // tileSize * columns
      windowHeight: wHeight, // tileSize * rows
      startX: Math.floor( ( -stagePosition.x - (wWidth) ) / grid.tileSize ) * grid.tileSize,
      endX: Math.floor( ( -stagePosition.x + (wWidth) * 2 ) / grid.tileSize ) * grid.tileSize,

      startY: Math.floor( ( -stagePosition.y - (wHeight) ) / grid.tileSize ) * grid.tileSize,
      endY: Math.floor( ( -stagePosition.y + (wHeight) * 2 ) / grid.tileSize ) * grid.tileSize
      // windowWidth: grid.tileSize * grid.columns, // tileSize * columns
      // windowHeight: grid.tileSize * grid.rows, // tileSize * rows
      // startX: Math.floor( ( -stagePosition.x - windowWidth ) / grid.tileSize ) * grid.tileSize,
      // endX: Math.floor( ( -stagePosition.x + windowWidth * 2 ) / grid.tileSize ) * grid.tileSize,
      // startY: Math.floor( ( -stagePosition.y - windowHeight ) / grid.tileSize ) * grid.tileSize,
      // endY: Math.floor( ( -stagePosition.y + windowHeight * 2 ) / grid.tileSize ) * grid.tileSize
    };
    setGrid(gridInit);
    return gridInit;
  }

  const handleGridLock = () => {
    setTilesLocked((prev) => !prev);
    // console.log(tilesLocked);
  }

  const recenterGrid = () => {
    if(stagePosition.x !== 0 || stagePosition.y !== 0) {
      setStagePosition({x: 0, y: 0})
      setGridCentered(true);
    }
  }

  const handleGridDrag = (e) => {
    // const x = e.currentTarget.x();
    // const y = e.currentTarget.y();
    if(tilesLocked) {
      setStagePosition(e.currentTarget.position());
      setGridCentered(false);
      updateGridProps();
    }
  }

  const handleStageClick = (e) => {
    // console.log(e.target.attrs.className !== "tile-image")
    const target = e.target;
    if(target.attrs.className !== "tile-image") {
      const menuNode = document.querySelector("#tile-controls");
      menuNode.style.display = "none";
    }
  }

  /**
   * TILE METHODS
  */
  const handleTileDragStart = (e) => {
    // anything that should be done when the user STARTS dragging a tile
    // this is essentially also a SINGLE CLICK response, so be careful!
    setShadowTileParams({
      ...shadowTileParams,
      x: e.target.x(),
      y: e.target.y(),
      visible: true
    });
    document.querySelector("#tile-controls").style.display = "none";
  }
  
  const handleTileDragMove = (e) => {
    const xCoord = Math.round(e.target.x() / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(e.target.y() / grid.tileSize) * grid.tileSize;

    setShadowTileParams({
      ...shadowTileParams,
      x: xCoord > grid.maxX ? grid.maxX : xCoord < 0 ? 0 : xCoord,
      y: yCoord > grid.maxY ? grid.maxY : yCoord < 0 ? 0 : yCoord,
    })
  }
  
  const handleTileDragEnd = (e) => {
    const id = e.target.id();

    const xCoord = Math.round(e.target.x() / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(e.target.y() / grid.tileSize) * grid.tileSize;
    const x = xCoord > grid.maxX ? grid.maxX : xCoord < 0 ? 0 : xCoord;
    const y = yCoord > grid.maxY ? grid.maxY : yCoord < 0 ? 0 : yCoord;
  
    e.target.to({
      x: x,
      y: y,
      duration: 0
    })

    updateTileCoordinates(id, x, y);

    setShadowTileParams({
      ...shadowTileParams,
      visible: false
    })
  }

  const updateTileCoordinates = (id, x, y) => {
    // console.log("id, x, y", id, x, y)
    const layout = [...mapLayout];
    for(var i = 0; i < layout.length; i++) {
      let tile = layout[i];
      if(tile.groupKey);
    }
  }

  /**
   * TILE CONTROLS "CONTEXT MENU"
   */
  const handleRightClick = (e) => {
    e.evt.preventDefault();

    const target = e.target;
    const containerRect = stageRef.container().getBoundingClientRect();
    const menuNode = document.querySelector("#tile-controls");

    if(target === stageRef || target.attrs.className !== "tile-image") {
      menuNode.style.display = 'none';
      return;
    }

    if(target.attrs.className === "tile-image") {
      menuNode.style.display = 'initial';
      menuNode.style.top = containerRect.top + stageRef.getPointerPosition().y - 40 + 'px';
      menuNode.style.left = containerRect.left + stageRef.getPointerPosition().x - 40 + 'px';
    }
  }

  const handleNewTileDrop = (e) => {
    // e.preventDefault();
    console.log("tile dropped!", e);
    console.log("retrieved image", e.dataTransfer.getData('img'))

    stageRef.current.setPointersPositions(e);
    const srPos = stageRef.current.getPointerPosition();

    const xCoord = Math.round(srPos.x / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(srPos.y / grid.tileSize) * grid.tileSize;
    const x = xCoord > grid.maxX ? grid.maxX : xCoord < 0 ? 0 : xCoord;
    const y = yCoord > grid.maxY ? grid.maxY : yCoord < 0 ? 0 : yCoord;

  }

  return (
    <div>
      <div>
        <ActionButton onClick={handleGridLock}>{tilesLocked ? "Unlock (to move Tiles)" : "Lock (to move Map)"}</ActionButton>
        <ActionButton onClick={recenterGrid}>{gridCentered ? "Grid Centered" : "Center Grid"}</ActionButton>
          <SliderDrawer />
      </div>

      <div id="map-builder-stage-container" onDrop={(e) => handleNewTileDrop(e)} onDragOver={(e) => e.preventDefault()}>
        <Stage
          ref={stageRef}
          x={stagePosition.x}
          y={stagePosition.y}
          width={window.innerWidth - 25}
          height={window.innerHeight}
          draggable={tilesLocked}
          onClick={(e) => handleStageClick(e)}
          onContextMenu={(e) => handleRightClick(e)}
          onDragEnd={(e) => handleGridDrag(e)}
          style={{border: "2px solid black", margin: "0"}}
        >
          {/* grid coordinate/"checkerboard" squares layer */}
          <CoordinateGrid />

          {/* "shadow" tiles */}
          <Layer id="shadow-tile-container">
            <Rect {...shadowTileParams} />
          </Layer>

          {/* ACTUAL TILES LAYER */}
          <Layer id="tiles-layer">
          {
          mapLayout.map(tile => 
            <Tile
              key={tile.groupKey}
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
            />
          )
          }
          </Layer>
        </Stage>
        <TileControls id="tile-controls" display="none" />
      </div>
    </div>
  )
}
