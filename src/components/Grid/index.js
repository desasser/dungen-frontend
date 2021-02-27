import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.scss'
// import DraggableTile from '../Tile/DraggableTile'
import Tile from '../Tile';
import TileControlWidget from '../TileControlWidget'
 
export default function Grid({ addThisTile }) {
  const [mapLayout, setMapLayout] = useState([]);
  const [prevTileIndex, setPrevTileIndex] = useState(0);

  const gridCellCoords = [
    { i: 'a', w: 1, h: 1, x: 0, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'b', w: 1, h: 1, x: 1, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'c', w: 1, h: 1, x: 2, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'd', w: 1, h: 1, x: 3, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'e', w: 1, h: 1, x: 4, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'f', w: 1, h: 1, x: 5, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'g', w: 1, h: 1, x: 6, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'h', w: 1, h: 1, x: 7, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'i', w: 1, h: 1, x: 8, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'j', w: 1, h: 1, x: 9, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'k', w: 1, h: 1, x: 10, y: 0, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'l', w: 1, h: 1, x: 0, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'm', w: 1, h: 1, x: 0, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'n', w: 1, h: 1, x: 0, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'o', w: 1, h: 1, x: 0, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'p', w: 1, h: 1, x: 0, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'q', w: 1, h: 1, x: 0, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'r', w: 1, h: 1, x: 0, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 's', w: 1, h: 1, x: 0, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 't', w: 1, h: 1, x: 0, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'u', w: 1, h: 1, x: 0, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'v', w: 1, h: 1, x: 1, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'w', w: 1, h: 1, x: 1, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'x', w: 1, h: 1, x: 1, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'y', w: 1, h: 1, x: 1, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'z', w: 1, h: 1, x: 1, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'aa', w: 1, h: 1, x: 1, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ab', w: 1, h: 1, x: 1, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ac', w: 1, h: 1, x: 1, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ad', w: 1, h: 1, x: 1, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'ae', w: 1, h: 1, x: 1, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'af', w: 1, h: 1, x: 2, y: 1, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ag', w: 1, h: 1, x: 2, y: 2, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ah', w: 1, h: 1, x: 2, y: 3, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ai', w: 1, h: 1, x: 2, y: 4, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'aj', w: 1, h: 1, x: 2, y: 5, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'ak', w: 1, h: 1, x: 2, y: 6, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'al', w: 1, h: 1, x: 2, y: 7, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'am', w: 1, h: 1, x: 2, y: 8, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    { i: 'an', w: 1, h: 1, x: 2, y: 9, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
    // { i: 'ao', w: 1, h: 1, x: 1, y: 10, bg: "#" + Math.floor(Math.random()*16777215).toString(16) },
  ]

  /**
   * 'onDrop' is a prop for a callback function provided by react-grid-layout for the GridLayout component
   * it returns layout, item, and 'e', but the item returned is stripped of all custom data attributes
   * and the 'e' event returned is for the GridLayout rather than the draggable item being added
   * 'item', however, returns the new x,y coords so it is useful and needs to be passed to createNewTile()
   */
  const handleOnDrop = (layout, item, e) => {
    console.log(item);
    if(addThisTile !== undefined && addThisTile.tileid !== undefined) {
      createNewTile(item[0]);
    }
  }

  const createNewTile = (droppedItemData) => {
    let newIndex = parseInt(prevTileIndex) > 0 ? parseInt(prevTileIndex) + 1 : 0;
    if(mapLayout.length > 0) {
      newIndex = parseInt(newIndex) + 1;
    }

    // console.log("addThisTile", addThisTile, "droppedItemData", droppedItemData);

    const newTileObj = {
      i: newIndex.toString(), // GridLayout expects this to be a string!
      tileId: addThisTile.tileid,
      environment: addThisTile.environment,
      x: droppedItemData.y,
      y: droppedItemData.x,
      bg: addThisTile.bg,
      w: 1,
      h: 1
    };
    console.log(newTileObj);

    if(newTileObj.tileId != null && newTileObj.tileId !== undefined && newTileObj.tileId !== "") {
      setMapLayout([...mapLayout, newTileObj]);
      setPrevTileIndex(newIndex);
    }
  }

  // this is the control widget for each tile, 
  const toggleWidget = (tileKey) => {
    mapLayout.map(mapTile => {
      if(mapTile.i.toString() === tileKey) {
        mapTile.displayControlWidget = !mapTile.displayControlWidget
      } else {
        mapTile.displayControlWidget = false
      }
    });

    setMapLayout([...mapLayout]);
  }

  const handleDoubleClick = (e) => {
    e.preventDefault();
    let tile = e.target;
    // console.log(tile.closest(".tile-wrapper"));

    if(tile.dataset === undefined || tile.dataset.tilekey === undefined) {
      tile = e.target.closest(".tile-wrapper");
    }

    toggleWidget(tile.dataset.tilekey);
  }

  const handleWidgetButtonClick = (action, item) => {
    // we're using opacity: 0 for the control widget to give it that fancy "imploding anim"
    // but that means the buttons are still *there* to be clicked! so we're checking to make
    // sure the control widget is actually being displayed before we take any action 
    if(item.displayControlWidget == "true") {
      const itemKey = item.i;

      if(action === "closeWidget") {
        toggleWidget(itemKey.toString());
  
      } else if(action === "rotateRight") {
        rotateTile(itemKey, "right");
  
      } else if(action === "rotateLeft") {
        rotateTile(itemKey, "left");
  
      } else if(action === "deleteTile") {
        removeTile(itemKey);
        
      }
    }
  }

  const rotateTile = (tileKey, direction) => {
    mapLayout.map(mapTile => {
      if(mapTile.i.toString() === tileKey.toString()) {
        mapTile.bg = Math.floor(Math.random()*16777215).toString(16);
        if( parseInt(mapTile.orientation) === 270 || parseInt(mapTile.orientation)  === -270 ) {
          mapTile.orientation = 0;
        } else {
          mapTile.orientation = direction === "right" ? mapTile.orientation + 90 : mapTile.orientation - 90;
        }
      }
    });

    setMapLayout([...mapLayout]);
  }

  const removeTile = (tileKey) => {
    const newMapLayout = mapLayout.filter(mapTile => mapTile.i !== tileKey);

    setMapLayout([...newMapLayout]);
  }

  return (
    <div id="mapGrid" style={{flex: "1 0 70%"}}>
      <GridLayout
        className="mapCoordsGrid"
        colWidth={100}
        rowHeight={100}
        width={1200}
        compactType={null}
        margin={[0,0]}
        isDraggable={false}
        isDroppable={false}
        isResizable={false}
        style={{height: "100%"}}
      >
      {/* GRID NUMBERS */}
      {gridCellCoords.map( cell => <div key={cell.i} className="grid-cell-coords" data-grid={{...cell}} resizable="false">{cell.x},{cell.y}</div> )} 
      </GridLayout>

      <GridLayout 
        className="mapGrid"
        colWidth={100} 
        rowHeight={100}
        width={1200}
        compactType={null} 
        preventCollision={true}
        margin={[0,0]} 
        isDroppable={true}
        isResizable={false}
        onDrop={handleOnDrop}
        // onLayoutChange={handleOnLayoutChange}
        // onDragStop={handleOnDragStop}
        style={{height: "100%"}}
      >
      {mapLayout.map((item, idx) => <div key={idx} className="tile-wrapper" data-grid={{...item}} data-environment={item.environment} data-tileid={item.tileId} data-tilekey={item.i} data-displaywidget={item.displayControlWidget} resizable="false"><Tile item={item} handleDoubleClick={handleDoubleClick} /> <TileControlWidget item={item} handleDoubleClick={handleDoubleClick} handleWidgetButtonClick={handleWidgetButtonClick} /> </div> )}
      </GridLayout>
    </div>
  )
}
