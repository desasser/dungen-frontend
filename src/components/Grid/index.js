import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.scss'
// import DraggableTile from '../Tile/DraggableTile'
import Tile from '../Tile';
import TileControlWidget from '../TileControlWidget'
import GridCoordsOverlay from './GridCoordsOverlay'
import API from '../../utils/API'
 
export default function Grid({ addThisTile }) {
  const [mapLayout, setMapLayout] = useState([]);
  const [todaysDate, setTodaysDate] = useState();

  React.useEffect(() => {
    const today = new Date();
    setTodaysDate(today.getFullYear() +''+ (today.getMonth() + 1) +''+ today.getDate());

    let savedMap = getMapFromLocalStorage();

    if(mapLayout.length > 0) {
      saveMapToLocalStorage();
    } else if( savedMap !== null && savedMap.layout.length > 0 ) {
      setMapLayout([...savedMap.layout]);
    }

  }, [mapLayout]);

  const getMapFromLocalStorage = () => {
    return localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null;
  }

  const saveMapToLocalStorage = (args) => {
    let layout = [];
    let title = "";

    if(args !== undefined && args.layout !== undefined) {
      layout = args.layout;
    } 

    if(args !== undefined && args.title !== undefined) {
      title = args.title;
    } 

    const mapData = {
      date: todaysDate, 
      userid: 6, 
      layout: layout.length > 0 ? layout : mapLayout, 
      mapWidth: null, 
      mapId: null, 
      mapTitle: title
    }

    localStorage.setItem('dungen_map', JSON.stringify(mapData));
  }

  /**
   * 'onDrop' is a prop for a callback function provided by react-grid-layout for the GridLayout component
   * it returns layout, item, and 'e', but the item returned is stripped of all custom data attributes
   * and the 'e' event returned is for the GridLayout rather than the draggable item being added
   * 'item', however, returns the new x,y coords so it is useful and needs to be passed to createNewTile()
   */
  const handleOnDrop = (layout, item, e) => {
    // console.log(item);
    let droppedItem = typeof item === "Array" ? item[0] : item;
    if(addThisTile !== undefined && addThisTile.tileid !== undefined) {
      createNewTile(droppedItem);
    }
  }

  const createNewTile = (droppedItemData) => {
    if(typeof droppedItemData === "Array") {
      droppedItemData = droppedItemData[droppedItemData.length - 1];
    }

    let newIndex = 0;
    // console.log(mapLayout.length);
    if(mapLayout.length > 0) {
      newIndex = mapLayout.length;
    }
    // setPrevTileIndex(parseInt(newIndex));

    const newTileObj = {
      i: newIndex.toString(), // GridLayout expects this to be a string!
      tileId: addThisTile.tileid,
      mapTileId: null,
      environment: addThisTile.environment,
      orientation: 0,
      mirrored: 1,
      x: addThisTile.x !== null ? parseInt(addThisTile.x) : parseInt(droppedItemData.x),
      y: addThisTile.y !== null ? parseInt(addThisTile.y) : parseInt(droppedItemData.y),
      bg: addThisTile.bg,
      w: 1,
      h: 1
    };

    if(newTileObj.tileId != null && newTileObj.tileId !== undefined && newTileObj.tileId !== "") {
      setMapLayout([...mapLayout, newTileObj]);
    }
  }

  const handleOnDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    mapLayout.map(tile => {
      if(tile.i === newItem.i) {
        tile.x = newItem.x
        tile.y = newItem.y
      }
    });

    setMapLayout([...mapLayout]);
  }

  const handleDoubleClick = (e) => {
    e.preventDefault();
    let tile = e.target;

    if(tile.dataset === undefined || tile.dataset.tilekey === undefined) {
      tile = e.target.closest(".tile-wrapper");
    }

    toggleWidget(tile.dataset.tilekey);
  }

  // this is the control widget for each tile, 
  const toggleWidget = (tileKey) => {
    mapLayout.map(mapTile => {
      if(parseInt(mapTile.i) === parseInt(tileKey)) {
        mapTile.displayControlWidget = !mapTile.displayControlWidget;
      } else {
        mapTile.displayControlWidget = false
      }
    });

    setMapLayout([...mapLayout]);
  }

  const handleClickOutsideTile = (e) => {
    // console.log(e.target);
    let parent = e.target.closest("button");
    if(parent !== null && parent.classList.contains("controlButton")) {
      // console.log(parent);
      let tile = e.target.closest(".tile-wrapper");
      if(tile !== undefined && tile !== null) {
        const tileData = {
          i: tile.dataset.tilekey,
          displayControlWidget: tile.dataset.displaywidget === "true" ? true : false
        }
        
        handleWidgetButtonClick(parent.dataset.action, tileData);
      }

    } else {
      // console.log(mapLayout);
      let newLayout = [...mapLayout];
      newLayout.map(tile => tile.displayControlWidget = false);

      setMapLayout([...newLayout]);
    }
  }

  const handleWidgetButtonClick = (action, item) => {
    // console.log(action, item);
    // we're using opacity: 0 for the control widget to give it that fancy "imploding anim"
    // but that means the buttons are still *there* to be clicked! so we're checking to make
    // sure the control widget is actually being displayed before we take any action 
    if(item.displayControlWidget === true) {
      const itemKey = item.i;

      if(action === "closeWidget") {
        toggleWidget(itemKey);
  
      } else if(action === "rotateTileRight") {
        rotateTile(itemKey, "right");
  
      } else if(action === "rotateTileLeft") {
        rotateTile(itemKey, "left");
  
      } else if(action === "deleteTile") {
        removeTile(itemKey);
        
      } else if(action === "mirrorTile") {
        mirrorTile(itemKey);
      }
    }
  }

  const rotateTile = (tileKey, direction) => {
    let newLayout = [...mapLayout];
    newLayout.map(mapTile => {
      if(mapTile.i.toString() === tileKey.toString()) {
        if( parseInt(mapTile.orientation) === 270 || parseInt(mapTile.orientation)  === -270 ) {
          mapTile.orientation = 0;
        } else {
          mapTile.orientation = direction === "right" ? parseInt(mapTile.orientation) + 90 : parseInt(mapTile.orientation) - 90;
        }

        // console.log(mapTile);
      }
    });

    setMapLayout([...newLayout]);
  }

  const mirrorTile = (tileKey) => {
    let newLayout = [...mapLayout];
    newLayout.map(mapTile => {
      if(mapTile.i.toString() === tileKey.toString()) {
        mapTile.mirrored = mapTile.mirrored === 1 ? -1 : 1;
      }
    });

    setMapLayout([...newLayout]);
  }

  const removeTile = (tileKey) => {
    let newMapLayout = [...mapLayout];
    newMapLayout = newMapLayout.filter(mapTile => mapTile.i !== tileKey);

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
          data-maptileid={item.mapTileId}
          data-tilekey={item.i} 
          data-displaywidget={item.displayControlWidget}
          resizable="false"
        >
          
          <Tile item={item} handleDoubleClick={handleDoubleClick} />

          <TileControlWidget item={item} handleWidgetButtonClick={handleWidgetButtonClick} handleClickOutsideTile={handleClickOutsideTile} /> 

        </div>
      )}
      </GridLayout>
    </div>
  )
}