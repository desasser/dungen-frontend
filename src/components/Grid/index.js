import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.scss'
// import DraggableTile from '../Tile/DraggableTile'
import Tile from '../Tile';
import TileControlWidget from '../TileControlWidget'
import GridCoordsOverlay from './GridCoordsOverlay'
 
export default function Grid({ addThisTile, loadThisMap }) {
  const [mapLayout, setMapLayout] = useState([]);
  const [prevTileIndex, setPrevTileIndex] = useState(0);
  const [mapWidth, setMapWidth] = useState(0);

  React.useEffect(() => {
    let savedMap = localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null;

    if(mapLayout.length === 0 && savedMap !== null && savedMap.layout.length > 0) {
      // "re-index" the tiles so the 'i' key is in numeric order;
      // the 'i' key/value is *only* for the grid display, and has no effect on the map itself
      // also setting the displayControlWidget to false so when a map is loaded
      // from localStorage, no control widgets are shown on load
      savedMap.layout.map(tile => {
        tile.i = savedMap.layout.indexOf(tile).toString()
        tile.displayControlWidget = false
      });
      setMapLayout(savedMap.layout);
      // this works because we're essentially re-indexing all the tiles for the map, from 0
      // so the length (-1) === the index of the last tile object === lastTile.i
      setPrevTileIndex( savedMap.layout.length - 1 );

    } else {
      localStorage.setItem('dungen_map', JSON.stringify({ date: "20200301", userid: 1, layout: mapLayout }));

    }

  },[mapLayout]);

  /**
   * 'onDrop' is a prop for a callback function provided by react-grid-layout for the GridLayout component
   * it returns layout, item, and 'e', but the item returned is stripped of all custom data attributes
   * and the 'e' event returned is for the GridLayout rather than the draggable item being added
   * 'item', however, returns the new x,y coords so it is useful and needs to be passed to createNewTile()
   */
  const handleOnDrop = (layout, item, e) => {
    let droppedItem = typeof item === "Array" ? item[0] : item;
    if(addThisTile !== undefined && addThisTile.tileid !== undefined) {
      createNewTile(droppedItem);
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
      orientation: 0,
      mirrored: 1,
      x: droppedItemData.x,
      y: droppedItemData.y,
      bg: addThisTile.bg,
      w: 1,
      h: 1
    };
    // console.log(newTileObj);

    if(newTileObj.tileId != null && newTileObj.tileId !== undefined && newTileObj.tileId !== "") {
      setMapLayout([...mapLayout, newTileObj]);
      setPrevTileIndex(newIndex);
    }
  }

  // const handleOnLayoutChange = (layout) => {
  //   setMapLayout([...mapLayout]);
  // }
  const handleOnDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    mapLayout.map(tile => {
      if(tile.i === newItem.i) {
        tile.x = newItem.x
        tile.y = newItem.y
        // console.log(tile);
      }
    });

    setMapLayout([...mapLayout]);
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
    // console.log(action, item);
    // we're using opacity: 0 for the control widget to give it that fancy "imploding anim"
    // but that means the buttons are still *there* to be clicked! so we're checking to make
    // sure the control widget is actually being displayed before we take any action 
    if(item.displayControlWidget === true) {
      const itemKey = item.i;

      if(action === "closeWidget") {
        toggleWidget(itemKey.toString());
  
      } else if(action === "rotateRight") {
        rotateTile(itemKey, "right");
  
      } else if(action === "rotateLeft") {
        rotateTile(itemKey, "left");
  
      } else if(action === "deleteTile") {
        removeTile(itemKey);
        
      } else if(action === "mirrorTile") {
        mirrorTile(itemKey);
      }
    }
  }

  const rotateTile = (tileKey, direction) => {
    mapLayout.map(mapTile => {
      if(mapTile.i.toString() === tileKey.toString()) {
        
        if( parseInt(mapTile.orientation) === 270 || parseInt(mapTile.orientation)  === -270 ) {
          mapTile.orientation = 0;
        } else {
          mapTile.orientation = direction === "right" ? parseInt(mapTile.orientation) + 90 : parseInt(mapTile.orientation) - 90;
        }
      }
    });

    setMapLayout([...mapLayout]);
  }

  const mirrorTile = (tileKey) => {
    mapLayout.map(mapTile => {
      if(mapTile.i.toString() === tileKey.toString()) {
        mapTile.mirrored = mapTile.mirrored === 1 ? -1 : 1;
      }
    });

    setMapLayout([...mapLayout]);
  }

  const removeTile = (tileKey) => {
    let newMapLayout = mapLayout.filter(mapTile => mapTile.i !== tileKey);

    setMapLayout([...newMapLayout]);
  }

  return (
    <div id="mapGrid" style={{flex: "1 0 70%"}}>
      <GridCoordsOverlay width={1200} colWidth={100} rowHeight={100} />

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
        onDragStop={handleOnDragStop}
        // onDragStart={handleOnDragStart}
        style={{height: "100%"}}
      >
      {mapLayout.map(item => 
        <div
          key={item.i} 
          className="tile-wrapper" 
          data-grid={{...item}} 
          data-environment={item.environment} 
          data-tileid={item.tileId} 
          data-tilekey={item.i} 
          data-displaywidget={item.displayControlWidget}
          resizable="false"
        >
          
          <Tile item={item} handleDoubleClick={handleDoubleClick} />

          <TileControlWidget item={item} handleDoubleClick={handleDoubleClick} handleWidgetButtonClick={handleWidgetButtonClick} /> 

        </div>
      )}
      </GridLayout>
    </div>
  )
}