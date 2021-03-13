import React from "react";
import { Stage, Layer, Group, Rect, Text } from "react-konva";

import { makeStyles } from "@material-ui/core/styles";
import { Container } from '@material-ui/core';

import MapControls from './MapControls';

import Tile from "./Tile";
import TileControls from "./TileControls";

const useStyles = makeStyles({
  mapBuilderContainer: {
    position: 'relative',
    width: 'auto',
    border: '1px solid black',
    padding: 0,
    margin: 0
  },
  tileControls: {
    display: "none",
    position: "absolute",
    width: "100px",
    boxShadow: "1px 1px 4px -1px grey",

    "& button": {
      width: "100%",
      backgroundColor: "white",
      border: "none",
      margin: 0,
      padding: "10px",
      transition: "all 0.3s ease-out",

      "& + button": {
        borderTop: "1px solid gainsboro",
      },

      "&:hover": {
        backgroundColor: "#d5f88f",
        transition: "all 0.3s ease-in",
      },
    },
  }
});

// infinite grid demo: https://codesandbox.io/s/kkndq?file=/src/index.js:200-206
// snapping & shadow tile demo: https://codepen.io/pierrebleroux/pen/gGpvxJ?editors=0010
export default function InfiniteCanvas(props) {
  // const classes = useStyles();

  let { tileSize, columns, rows, viewState } = props;
  if (tileSize === undefined || tileSize === null) {
    tileSize = 100;
  }
  if (columns === undefined || columns === null) {
    columns = 10;
  }
  if (rows === undefined || rows === null) {
    rows = 6;
  }

  const stageRef = React.useRef();

  const [tilesLocked, setTilesLocked] = React.useState(true);
  const [gridCentered, setGridCentered] = React.useState(true);
  const [stagePosition, setStagePosition] = React.useState({ x: 200, y: 0 });
  const [grid, setGrid] = React.useState({
    tileSize: tileSize,
    columns: columns,
    rows: rows,
    stageWidth: window.innerWidth,
    stageHeight: window.innerHeight,
    startX: tileSize * columns * -tileSize - stagePosition.x,
    startY: tileSize * rows * -tileSize - stagePosition.y,
    endX: tileSize * columns * tileSize + stagePosition.x,
    endY: tileSize * rows * tileSize + stagePosition.y,
  });
  const [coordinateSquares, setCoordinateSquares] = React.useState([]);

  const [backgroundRect, setBackgroundRect] = React.useState({
    // width: grid.stageWidth + stagePosition.x * 2,
    // height: grid.stageHeight + stagePosition.y * 2,
    width: window.innerWidth,
    height: window.innerHeight,
    fill: 'white',
    strokeWidth: 0,
    x: -stagePosition.x,
    y: stagePosition.y
  });

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
   * SETTING HEIGHT & WIDTH OF STAGE & BG RECT
   * these shouldn't change ever, so we'll set them once
   * and then leave them alone
   */
  React.useEffect(() => {
    const offset = document.querySelector("#map-builder-stage-container").parentNode.offsetTop + 30;

    if(grid.stageHeight !== window.innerHeight - offset) {
      setBackgroundRect({
        ...backgroundRect,
        height: window.innerHeight - offset,
        width: window.innerWidth - 100
      });
  
      setGrid({
        ...grid,
        stageWidth: window.innerHeight - 100,
        stageHeight: window.innerHeight - offset
      });

      document.querySelectorAll(".konvajs-content")[0].style.height = window.innerHeight - offset;
    }
  
  }, [grid]);

  /**
   * INFINITE GRID *ONLY*
   */
  React.useEffect(() => {
    // console.log("infinite grid setup triggered")
    const gridInit = updateGridProps();

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
    // eslint-disable-next-line
  }, [stagePosition]);

  /**
   * MAP LAYOUT FOR NEW MAPS ONLY
   * if there's an ID, handle that with the useEffect below!
   */
  React.useEffect(() => {
    // console.log("map layout use effect triggered");
    if (mapLayout.length === 0) {
      const layout = [
        {
          groupKey: "tg-1",
          imgKey: "tm-1",
          x: 0,
          y: 0,
          image_src: "http://localhost:3030/assets/dungeon/LowRes/2EDC01.jpg",
          rotation: 0,
          scale: { x: 1, y: 1 },
        },
        {
          groupKey: "tg-2",
          imgKey: "tm-2",
          x: 1,
          y: 1,
          image_src: "http://localhost:3030/assets/dungeon/LowRes/2EDC02.jpg",
          rotation: 0,
          scale: { x: 1, y: 1 },
        },
      ];

      setMapLayout(layout);
    }

    // eslint-disable-next-line
  }, []);

  /**
   * MAP LAYOUT FOR PREVIOUSLY SAVED MAPS
   */
  React.useEffect(() => {
    // does nothing for now
  }, [mapLayout]);

  /**
   * GRID METHODS
   */
  const updateGridProps = () => {
    const gridInit = {
      ...grid,
      startX:
        props.infiniteGrid ? Math.floor((-stagePosition.x - grid.stageWidth) / grid.tileSize) * grid.tileSize : 0,
      endX:
        props.infiniteGrid ? Math.floor((-stagePosition.x + grid.stageWidth * 2) / grid.tileSize) *grid.tileSize : grid.stageWidth,

      startY:
        props.infiniteGrid ? Math.floor((-stagePosition.y - grid.stageHeight) / grid.tileSize) *  grid.tileSize : 0,
      endY:
        props.infiniteGrid ? Math.floor((-stagePosition.y + grid.stageHeight * 2) / grid.tileSize) * grid.tileSize : grid.stageHeight,
      // windowWidth: grid.tileSize * grid.columns, // tileSize * columns
      // windowHeight: grid.tileSize * grid.rows, // tileSize * rows
      // startX: Math.floor( ( -stagePosition.x - windowWidth ) / grid.tileSize ) * grid.tileSize,
      // endX: Math.floor( ( -stagePosition.x + windowWidth * 2 ) / grid.tileSize ) * grid.tileSize,
      // startY: Math.floor( ( -stagePosition.y - windowHeight ) / grid.tileSize ) * grid.tileSize,
      // endY: Math.floor( ( -stagePosition.y + windowHeight * 2 ) / grid.tileSize ) * grid.tileSize
    };
    setGrid(gridInit);
    return gridInit;
  };

  const handleTileLock = () => {
    setTilesLocked((prev) => !prev);
  };

  const recenterGrid = () => {
    if (stagePosition.x !== 0 || stagePosition.y !== 0) {
      setStagePosition({ x: 200, y: 0 });
      setBackgroundRect({
        ...backgroundRect,
        x: 200,
        y: 0
      })
      setGridCentered(true);
    }
  };

  const handleGridDrag = (e) => {
    // const x = e.currentTarget.x();
    // const y = e.currentTarget.y();
    setStagePosition(e.currentTarget.position());
      // setBackgroundRect({
      //   ...backgroundRect,
      //   x: -e.currentTarget.x(),
      //   y: -e.currentTarget.y()
      // });
      setGridCentered(false);
      updateGridProps();
  };

  const handleStageClick = (e) => {
    // console.log(e.target.attrs.className !== "tile-image")
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

  /**
   * TILE CONTROLS "CONTEXT MENU"
   */
  const handleRightClick = (e) => {
    e.evt.preventDefault();

    const target = e.target;
    const containerRect = stageRef.container().getBoundingClientRect();
    const menuNode = document.querySelector("#tile-controls");

    if (target === stageRef || target.attrs.className !== "tile-image") {
      menuNode.style.display = "none";
      return;
    }

    if (target.attrs.className === "tile-image") {
      menuNode.style.display = "initial";
      menuNode.style.top =
        containerRect.top + stageRef.getPointerPosition().y - 40 + "px";
      menuNode.style.left =
        containerRect.left + stageRef.getPointerPosition().x - 40 + "px";
    }
  };

  const handleNewTileDrop = (e) => {
    // e.preventDefault();
    console.log("tile dropped!", e);
    console.log("retrieved image", e.dataTransfer.getData("img"));

    stageRef.current.setPointersPositions(e);
    const srPos = stageRef.current.getPointerPosition();

    const xCoord = Math.round(srPos.x / grid.tileSize) * grid.tileSize;
    const yCoord = Math.round(srPos.y / grid.tileSize) * grid.tileSize;
    const x = xCoord > grid.maxX ? grid.maxX : xCoord < 0 ? 0 : xCoord;
    const y = yCoord > grid.maxY ? grid.maxY : yCoord < 0 ? 0 : yCoord;
  };

  return (
    //  className={classes.mapBuilderContainer}
    <div style={{width: "100%", display: "flex", flexFlow: "row no-wrap", justifyContent: "center"}}>
      {/* Map Controls */}
      <MapControls controlsData={{ centerGrid: { props: {onClick: recenterGrid}, args: {gridCentered: gridCentered}, text: gridCentered ? "Grid is centered" : "Center Grid" }, toggleTileLock: { props: {checked: tilesLocked, onChange: handleTileLock, name: "toggleTileLock"}, args: { visible: props.infiniteGrid }} }} />

      <div
        id="map-builder-stage-container"
        style={{overflow: "hidden", maxWidth: "70%", border: "2px solid red", margin: "0 auto", display: "block", flex: "1 0 auto"}}
        onDrop={(e) => handleNewTileDrop(e)}
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage
          id="mapBuilder"
          ref={stageRef}
          width={grid.stageWidth}
          height={grid.stageHeight}
          draggable={tilesLocked}
          onClick={(e) => handleStageClick(e)}
          onContextMenu={(e) => handleRightClick(e)}
          style={{ margin: "0", padding: "0" }}
          onDragEnd={(e) => handleGridDrag(e)}
        >
          {/* background (white or color or repeating tile [pattern]) */}
          <Layer width={window.innerWidth - stagePosition.x} x={stagePosition.x}>
            <Rect {...backgroundRect} />
          </Layer>

          {/* grid coordinate/"checkerboard" squares layer */}
          <Layer
            visible={!props.viewState} 
            width={window.innerWidth - stagePosition.x}
            x={props.infiniteGrid ? stagePosition.x : stagePosition.x + 100}
            y={stagePosition.y}
          >
            {coordinateSquares}
          </Layer>

          {/* "shadow" tiles */}
          <Layer id="shadow-tile-container" width={window.innerWidth - stagePosition.x} x={stagePosition.x}>
            <Rect {...shadowTileParams} />
          </Layer>

          {/* ACTUAL TILES LAYER */}
          <Layer
            id="tiles-layer"
            width={window.innerWidth - stagePosition.x} 
            x={props.infiniteGrid ? stagePosition.x : stagePosition.x + 100}
            y={stagePosition.y}
          >
            {mapLayout.map((tile) => (
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
            ))}
          </Layer>
        </Stage>
        
        {/* NOT Canvas elements */}
        <TileControls
          id="tile-controls"
          // classes={classes.tileControls}
          display="none"
        />
      </div>
    </div>
  );
}
