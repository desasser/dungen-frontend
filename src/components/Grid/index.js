import React, { useState, useEffect, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import './style.scss'
// import DraggableTile from '../Tile/DraggableTile'
import Tile from '../Tile';
import TileControlWidget from '../TileControlWidget'
import GridCoordsOverlay from './GridCoordsOverlay'
 
// addThisTile: (object) used in handleOnDrop for adding new tile from tile sidebar
// loadThisMap: (array, objects) used in useEffect to load the passed mapLayout
export default function Grid({ addThisTile, loadThisMap }) {
  const [mapLayout, setMapLayout] = useState([]);
  const [prevTileIndex, setPrevTileIndex] = useState(0);
  const [todayDate, setTodayDate] = useState("");

  // const outsideClickClosesTileControlWidget = React.useRef();

  /**
   * on loading the component check localStorage 
   * if mapLayout is empty and localStorage is NOT
   * load the map from localStorage
   */
  useEffect(() => {
    const dt = new Date();
    setTodayDate( dt.getFullYear() + dt.getMonth() + dt.getDate() );

    if(loadThisMap === undefined || loadThisMap === null) {
      checkLocalStorage();

    } else {
      setMapLayout(loadThisMap);
      updateLocalStorage();
    }
  }, []);

  const handleClickOutsideTile = (e) => {
    const tileWithVisibleControlWidget = mapLayout.length > 0 ? mapLayout.filter(tile => tile.displayControlWidget === true) : [];

    // don't actually try anything unless there's a visible control widget
    if(tileWithVisibleControlWidget.length > 0) {
      const item = tileWithVisibleControlWidget[0];

      // if clicking somewhere on a control widget, leave it open!
      if( e.target.closest(".tile-wrapper") !== null && e.target.closest(".tile-wrapper").dataset.displaywidget === "true" ) {
        // inside click
        if(e.target.closest("div").classList.value.includes("activeWidget")) {
          const button = e.target.closest("button");
          // console.log(button.dataset.action, item);

          handleWidgetButtonClick(button.dataset.action, item);
        }

        return;
      }
      
      // outside click
      console.log("outside click detected!");
      handleWidgetButtonClick("closeWidget", tileWithVisibleControlWidget[0])
    }
  }

  const checkLocalStorage = () => {
    const savedMap = JSON.parse(localStorage.getItem('dungen_map'));
    // only check localStorage if the current layout is empty!
    // if the current layout is NOT empty, the user has started building a map
    // and we shouldn't overwrite that; otherwise, if there's a map in localStorage, load it up!
    if( mapLayout.length === 0 && savedMap !== undefined && savedMap.layout.length > 0 ) {
      // TODO: check the userId
      // TODO: check date -- if date is not today, possibly show user modal e.g. "load previous map?"
    
      setMapLayout(savedMap.layout);
      
    }
  }
  // sets the mapLayout AND updates localStorage (important!)
  const updateLocalStorage = () => {
    // date set on component load
    localStorage.setItem( `dungen_map`, JSON.stringify({ date: todayDate, userId: 1, layout: mapLayout }) );
  }

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

    if(newTileObj.tileId != null && newTileObj.tileId !== undefined && newTileObj.tileId !== "") {
      setMapLayout([...mapLayout, newTileObj]);
      setPrevTileIndex(newIndex);

      updateLocalStorage();
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
      if(mapTile.i.toString() === tileKey) {
        mapTile.displayControlWidget = !mapTile.displayControlWidget
      } else {
        mapTile.displayControlWidget = false
      }
    });

    setMapLayout([...mapLayout]);
    updateLocalStorage();
  }

  const handleWidgetButtonClick = (action, item) => {
    // we're using opacity: 0 for the control widget to give it that fancy "imploding anim"
    // but that means the buttons are still *there* to be clicked! so we're checking to make
    // sure the control widget is actually being displayed before we take any action
    if(item.displayControlWidget === true) {
      const itemKey = item.i;
      console.log(action, item)
      if(action === "closeControls") {
        toggleWidget(itemKey.toString());
  
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
    updateLocalStorage();
  }

  const mirrorTile = (tileKey) => {
    mapLayout.map(mapTile => {
      if(mapTile.i.toString() === tileKey.toString()) {
        mapTile.mirrored = mapTile.mirrored === 1 ? -1 : 1;
      }
    });

    setMapLayout([...mapLayout]);
    updateLocalStorage();
  }

  const removeTile = (tileKey) => {
    let newMapLayout = mapLayout.filter(mapTile => mapTile.i !== tileKey);

    setMapLayout([...newMapLayout]);
    updateLocalStorage();
  }

  return (
    <div id="mapGrid" style={{flex: "1 0 70%"}}>
      {/* GridCoordsOverlay is what displays the purple grid lines (50x50 squares) and the x,y coords in the top-left of each square */}
      <GridCoordsOverlay width={1200} colWidth={100} rowHeight={100} />
      {/* GridLayout is the actual Grid where the map tiles are placed! */}
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

          <TileControlWidget item={item} handleDoubleClick={handleDoubleClick} handleWidgetButtonClick={handleWidgetButtonClick} handleClickOutsideTile={handleClickOutsideTile} /> 

        </div>
      )}
      </GridLayout>
    </div>
  )
}
