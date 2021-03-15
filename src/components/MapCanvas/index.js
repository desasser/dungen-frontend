import React from "react";
import { Stage, Layer, Group, Rect, Text } from "react-konva";

import MapControlsDrawer from './MapControlsDrawer';

import CanvasTile from "../Tile/CanvasTile";
import TileControls from "./TileControls";

// infinite grid demo: https://codesandbox.io/s/kkndq?file=/src/index.js:200-206
// snapping & shadow tile demo: https://codepen.io/pierrebleroux/pen/gGpvxJ?editors=0010
export default function InfiniteCanvas(props) {

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

  const [tilesLocked, setTilesLocked] = React.useState(false);
  const [gridCentered, setGridCentered] = React.useState(true);
  const [stagePosition, setStagePosition] = React.useState({ x: 0, y: 0 });
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

  const [mapLayout, setMapLayout] = React.useState([]);

  /**
   * SETTING HEIGHT & WIDTH OF STAGE based on stage container offset
   */
  React.useEffect(() => {
    // console.log(stageParentRef.current.style.height);
    
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
    }

    // create grid on page load
    createGrid();
  
  }, [stageParentRef]);

  /**
   * INFINITE GRID *ONLY*
   */
  React.useEffect(() => {
    console.log("infinite grid?", props.infiniteGrid, "coordinateSquares.length?", coordinateSquares.length);
    if(props.infiniteGrid) {
      createGrid();
    }

  }, [stagePosition]);

  /**
   * UPDATING LOCAL STORAGE
   */
  React.useEffect(() => {
    const savedMap = localStorage.getItem('dungen_map');
    if(savedMap !== undefined) {
      const parsedMap = JSON.parse(savedMap);

      if(parsedMap.layout !== undefined && parsedMap.layout !== mapLayout) {
        localStorage.setItem('dungen_map', JSON.stringify(mapLayout));
      }
    }
    
    // eslint-disable-next-line
  }, [mapLayout]);

  /**
   * MAP LAYOUT FOR PREVIOUSLY SAVED MAPS
   */
  // React.useEffect(() => {
  //   // does nothing for now
  // }, [mapLayout]);

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

  const handleTileLock = () => {
    setTilesLocked((prev) => !prev);
  };

  const recenterGrid = () => {
    console.log("recentering grid from", stagePosition);
    if (stagePosition.x !== 0 || stagePosition.y !== 0) {
      setStagePosition({ x: 0, y: 0 });
      setGridCentered(true);
    }
  };

  const handleGridDragEnd = (e) => {
    if(stageRef.current && e.target.x() !== 0 || e.target.y() !== 0) {
      setStagePosition(e.currentTarget.position());
      setGridCentered(false);
      updateGridProps(e.currentTarget.position());
    }
  };

  const handleStageClick = (e) => {
    console.log(e.target)
    const target = e.target;
    if (target.attrs.className !== "tile-image") {
      const menuNode = document.querySelector("#tile-controls");
      menuNode.style.display = "none";
    }
  };

  /**
   * TILE METHODS
   */
  const handleTileDragStart = (e) => {
    console.log('dragging tile', e.target.position())
    // anything that should be done when the user STARTS dragging a tile
    // this is essentially also a SINGLE CLICK response, so be careful!
    setShadowTileParams({
      ...shadowTileParams,
      x: e.target.x(),
      y: e.target.y(),
      visible: true,
    });
    document.querySelector("#tile-controls").style.display = "none";
  };

  const handleTileDragMove = (e) => {
    const xCoord = Math.round(e.target.x() / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(e.target.y() / grid.tileSize) * grid.tileSize;

    setShadowTileParams({
      ...shadowTileParams,
      x: xCoord > grid.maxX ? grid.maxX : xCoord < 0 ? 0 : xCoord,
      y: yCoord > grid.maxY ? grid.maxY : yCoord < 0 ? 0 : yCoord,
    });
  };

  const handleTileDragEnd = (e) => {
    const id = e.target.id();

    const xCoord = Math.round(e.target.x() / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(e.target.y() / grid.tileSize) * grid.tileSize;
    const x = xCoord > grid.maxX ? grid.maxX : xCoord < 0 ? 0 : xCoord;
    const y = yCoord > grid.maxY ? grid.maxY : yCoord < 0 ? 0 : yCoord;

    e.target.to({
      x: x,
      y: y,
      duration: 0,
    });

    updateTileCoordinates(id, x, y);

    setShadowTileParams({
      ...shadowTileParams,
      visible: false,
    });
  };

  const updateTileCoordinates = (id, x, y) => {
    // console.log("id, x, y", id, x, y)
    const layout = [...mapLayout];
    for (var i = 0; i < layout.length; i++) {
      let tile = layout[i];
      if (tile.groupKey);
    }
  };

  const handleNewTileDrop = (e) => {
    e.preventDefault();

    const tileData = JSON.parse(e.dataTransfer.getData("dropped_tile"));

    // console.log("retrieved data", tileData);

    // console.log("target", e.target);
    stageRef.current.setPointersPositions(e)

    const srPos = stageRef.current.getPointerPosition();

    const xCoord = Math.round((srPos.x - stagePosition.x) / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round((srPos.y - stagePosition.y) / grid.tileSize) * grid.tileSize;

    const tile = {
      groupKey: `tg-${tileData.TileId}`,
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

    const target = e.target;

    const menuNode = document.querySelector("#tile-controls");

    if (target === stageRef || target.attrs.className !== "tile-image") {
      // console.log("right clicked on empty stage, closing menu");
      menuNode.style.display = "none";
      return;
    }

    if (target.attrs.className === "tile-image") {
      // console.log("right clicked on TILE, opening menu");
      const xCoord = Math.floor(e.evt.clientX / grid.tileSize) *  grid.tileSize;
      const yCoord = Math.round(e.evt.clientY / grid.tileSize) *  grid.tileSize;
      // console.log("xCoord", xCoord, "yCoord", yCoord)
      menuNode.style.display = "initial";
      menuNode.style.top = yCoord - (grid.tileSize) + 'px';
      menuNode.style.left = xCoord - (grid.tileSize) + 'px';
      // menuNode.style.top = containerRect.offsetTop - (pos.y * 2) - 80 + "px";
      // menuNode.style.left = containerRect.offsetLeft - (pos.x * 2) - 80 + "px";
    }
  };

  return (
    <>
      <MapControlsDrawer controlsData={{ centerGrid: { props: {onClick: recenterGrid}, args: {gridCentered: gridCentered}, text: gridCentered ? "Grid is centered" : "Center Grid" }, toggleTileLock: { props: {checked: tilesLocked, onChange: handleTileLock, name: "toggleTileLock"}, args: { visible: props.infiniteGrid }} }} />

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
            width={window.innerWidth}
            height={window.innerHeight}
            draggable={tilesLocked}
            x={stagePosition.x}
            y={stagePosition.y}
            onClick={(e) => handleStageClick(e)}
            onContextMenu={(e) => handleRightClick(e)}
            // onDragStart={(e) => {console.log("started dragging grid from", e.currentTarget.position())}}
            onDragEnd={(e) => handleGridDragEnd(e)}
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
            {mapLayout.map((tile, idx) => (
              <CanvasTile
                key={idx}
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
            ))}
            </Layer>
          </Stage>
        
          {/* NOT Canvas elements */}
          <TileControls id="tile-controls" display="none" />
        </div>
    </>
  );
}
