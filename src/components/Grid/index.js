import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.scss'
// import DraggableTile from '../Tile/DraggableTile'
import Tile from '../Tile';
import TileControlWidget from '../TileControlWidget'
 
export default function Grid({ addThisTile }) {

  const [mapLayout, setMapLayout] = useState([]);
  const [newTile, setNewTile] = useState({
    i: '0',
    tileId: null,
    environment: null,
    x: 0,
    y: 0,
    bg: "#f00",
    orientation: 0,
    displayControlWidget: false,
    w: 1,
    h: 1
  });

  /**
   * 'onDrop' is a prop for a callback function provided by react-grid-layout for the GridLayout component
   * it returns layout, item, and 'e', but the item returned is stripped of all custom data attributes
   * and the 'e' event returned is for the GridLayout rather than the draggable item being added
   * 'item', however, returns the new x,y coords so it is useful and needs to be passed to createNewTile()
   */
  const handleOnDrop = (item) => {
    // console.log(addThisTile);
    if(addThisTile !== undefined && addThisTile.tileid !== undefined) {
      createNewTile(item[0]);
    }
  }

  const createNewTile = (droppedItemData) => {
    let newIndex = parseInt(newTile.i) > 0 ? parseInt(newTile.i) + 1 : 0;
    console.log("addThisTile", addThisTile, "droppedItemData", droppedItemData);

    const newTileObj = {
      ...newTile,
      i: newIndex.toString(), // GridLayout expects this to be a string!
      tileId: addThisTile.tileid,
      environment: addThisTile.environment,
      x: droppedItemData.x,
      y: droppedItemData.y,
      bg: addThisTile.bg
    };
    
    setNewTile(newTileObj);

    console.log(newTile);

    if(newTile.tileId != null && newTile.tileId !== undefined && newTile.tileId !== "") {
      setMapLayout([...mapLayout, newTile]);
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
        style={{backgroundColor: "gainsboro", minHeight: "400px"}}
      >
      {mapLayout.map((item, idx) => <div key={idx} className="tile-wrapper" data-grid={{...item}} data-environment={item.environment} data-tileid={item.tileId} data-tilekey={item.i} data-displaywidget={item.displayControlWidget} resizable="false"><Tile item={item} handleDoubleClick={handleDoubleClick} /> <TileControlWidget item={item} handleDoubleClick={handleDoubleClick} handleWidgetButtonClick={handleWidgetButtonClick} /> </div> )}
      </GridLayout>
    </div>
  )
}
