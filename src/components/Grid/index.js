import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.scss'
// import DraggableTile from '../Tile/DraggableTile'
import Tile from '../Tile';
import TileControlWidget from '../TileControlWidget'
import GridCoordsOverlay from './GridCoordsOverlay'
import API from '../../utils/API'
 
export default function Grid({ addThisTile, loadThisMap }) {
  const [dragging, setDragging] = useState(false);
  const [mapLayout, setMapLayout] = useState([]);
  const [todaysDate, setTodaysDate] = useState();
  const [timestamp, setTimestamp] = useState();
  const [loadedMapData, setLoadedMapData] = useState({id: null, layout: [], mapTitle: ''});

  React.useEffect(() => {
    console.log("dragging", dragging);
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
    
    setTimestamp(hours +':'+ minutes +':'+ seconds);
    
    if(today !== todaysDate) { setTodaysDate(today); }
    let savedMap = getMapFromLocalStorage();

    // if mapLayout is NOT empty, the user has started building something already!
    // so just save that to localStorage on "load"
    if(mapLayout.length > 0) {
      // BUT we don't want to save to local storage before & after dragging
      // so we only save if we're NOT dragging a tile.
      if(!dragging) {
        console.log("saving to local storage");
        saveMapToLocalStorage({layout: mapLayout});
      }
    } 
    // check to see if there's something in localStorage
    // if there is, and the layout length is NOT empty, we can load it up
    else if( loadThisMap === undefined || loadThisMap === null ) {
      if(savedMap !== null && savedMap.layout.length > 0)
        setMapLayout([...savedMap.layout]);

    }
    // now for handling if loadThisMap is NOT null / undefined
    else if( loadThisMap !== undefined && loadThisMap !== null ) {
      console.log("Loading Saved Map", loadThisMap);

      // ok, check the localstorage and just update it if things match?
      if( loadedMapData !== undefined && loadedMapData.layout.length === 0 ) {
        console.log("loading map from database");
        let res = loadMapFromDB(loadThisMap);

        res.then(loadedMap => {
          console.log("LOADED MAP FROM DB", loadThisMap);

          if(loadedMap !== undefined && loadedMap !== null && loadedMap.layout.length > 0 && mapLayout.length === 0) {
            console.log("CHECKING LOCAL STORAGE")
            let savedMap = getMapFromLocalStorage();
            let savedMapDate, loadedMapDate;

            if(savedMap !== null) {
              savedMapDate = new Date(savedMap.lastUpdated);
              loadedMapDate = new Date(loadedMap.lastUpdated);
              console.log("Saved Map: " + savedMapDate, "Loaded Map: " + loadedMapDate);

              console.log("savedMapDate < loadedMapDate", savedMapDate < loadedMapDate);
            } else {
              saveMapToLocalStorage({ layout: loadedMap.layout, title: loadedMap.mapTitle })
            }

            if(savedMap !== null && savedMapDate < loadedMapDate && savedMap.mapId === parseInt(loadThisMap)) {
              setMapLayout([...savedMap.layout]);

            } else {
              setLoadedMapData(loadedMap);
              setMapLayout([...loadedMap.layout]);
              saveMapToLocalStorage({layout: loadedMap.layout, title: loadedMap.mapTitle});
            }

          } 
          
        });

      } else if(loadedMapData !== undefined && loadedMapData.layout.length > 0) {
        setMapLayout([...loadedMapData.layout]);
        // saveMapToLocalStorage();
      }

    }

  }, [mapLayout]);

  // React.useEffect

  const loadMapFromDB = (mapId) => {
    let results = {
      mapId: mapId,
      layout: [],
      mapTitle: "",
      lastUpdated: ""
    };

    if(loadedMapData.layout.length === 0) {
      results = API.getSingleMap(mapId)
      .then(singleMap => {
        console.log(singleMap);
        if(singleMap.data !== "") {
          const mapTiles = singleMap.data.MapTiles;
 
          let gridTiles = [];
          if(mapTiles.length > 0) {
            for( var i = 0; i < mapTiles.length; i++ ) {
              const mapTile = mapTiles[i];
              let tile = {};
              if(mapTile.Tile !== null) {
                tile = {
                  i: i.toString(),
                  tileId: mapTile.TileId,
                  mapTileId: mapTile.id,
                  environment: mapTile.EnvironmentId,
                  orientation: mapTile.orientation,
                  mirror: mapTile.mirror,
                  bg: mapTile.Tile.image_url,
                  x: parseInt(mapTile.xCoord),
                  y: parseInt(mapTile.yCoord),
                  w: 1,
                  h: 1
                }
                gridTiles.push(tile);
              }
            }
          }
      
          const loadLayout = {
            mapId: singleMap.data.id,
            layout: gridTiles,
            mapTitle: singleMap.data.name,
            lastUpdated: singleMap.data.updatedAt
          }
          setLoadedMapData(loadLayout);
          return loadLayout;

        } else {
          return { mapId: null, layout: [], mapTitle: "" }

        }
      })
      .catch(err => console.error(err));

    }

    return results;
  }

  const getMapFromLocalStorage = () => {
    return localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null;
  }

  const saveMapToLocalStorage = (args=null) => {
    let layout = loadedMapData !== undefined ? loadedMapData.layout : mapLayout;
    let title = loadedMapData !== undefined ? loadedMapData.mapTitle : "";

    if(args !== null && args.layout !== undefined) {
      layout = args.layout;
    } 

    if(args !== null && args.title !== undefined) {
      title = args.title;
    } 

    const mapData = {
      date: todaysDate, 
      userid: 6, 
      layout: layout.length > 0 ? layout : mapLayout, 
      mapWidth: null, 
      mapId: loadThisMap !== undefined ? parseInt(loadThisMap) : null, 
      mapTitle: title,
      lastUpdated: `${todaysDate}T${timestamp}.000Z`
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
    setDragging(false);
    
    if(typeof droppedItemData === "Array") {
      droppedItemData = droppedItemData[droppedItemData.length - 1];
    }

    const newTileObj = {
      i: (timestamp).toString(), // GridLayout expects this to be a string!
      tileId: addThisTile.tileid,
      mapTileId: null,
      environment: addThisTile.environment,
      orientation: 0,
      mirror: 1,
      x: addThisTile.x !== null ? parseInt(addThisTile.x) : parseInt(droppedItemData.x),
      y: addThisTile.y !== null ? parseInt(addThisTile.y) : parseInt(droppedItemData.y),
      bg: addThisTile.bg,
      w: 1,
      h: 1
    };

    if(newTileObj.tileId != null && newTileObj.tileId !== undefined && newTileObj.tileId !== "") {
      console.log("NEW TILE ADDED TO LAYOUT")
      // let newLayout = [...mapLayout];
      // newLayout.push(newTileObj);
      setMapLayout([...mapLayout, newTileObj]);
    }
  }

  const handleOnDragStart = (layout, oldItem, newItem, placeholder, e, element) => {
    
    // if we're clicking on a button, we're NOT dragging!
    if(e.target.closest("button") === undefined || e.target.closest("button") === null) {
      setDragging(true);
      // let newLayout = [...mapLayout];
      // newLayout.map(tile => tile.displayControlWidget = false);

      // setMapLayout([...newLayout]);

    } else {
      setDragging(false);
    }
  }

  const handleOnDragStop = (layout, oldItem, newItem, placeholder, e, element) => {
    if(dragging) {
      setDragging(false);
      mapLayout.map(tile => {
        if(tile.i === newItem.i) {
          tile.x = newItem.x
          tile.y = newItem.y
        }
      });

      setMapLayout([...mapLayout]);
    }
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
      console.log(mapTile.i, tileKey, `${mapTile.i}` === `${tileKey}`);
      if(`${mapTile.i}` === `${tileKey}`) {
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
    if(parent !== null && parent !== undefined && parent.classList.contains("controlButton") ) {
      console.log(parent);
      let tile = e.target.closest(".tile-wrapper");

      if(tile !== undefined && tile !== null && tile.dataset !== undefined) {
        const tileData = {
          i: tile.dataset.tilekey,
          displayControlWidget: tile.dataset.displaywidget === "true" ? true : false
        }
        
        // handleWidgetButtonClick(parent.dataset.action, tileData);
      }

    } else {
      setDragging(false);
      // console.log(mapLayout);
      
      // mapLayout.map(tile => tile.displayControlWidget = false);

      // setMapLayout([...mapLayout]);
    }
  }

  const handleWidgetButtonClick = (action, item) => {
    setDragging(false);
    console.log(action, item);
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
        console.log(mapTile.orientation)
        if( parseInt(mapTile.orientation) === 270 || parseInt(mapTile.orientation)  === -270 ) {
          mapTile.orientation = 0;
        } else {
          mapTile.orientation = direction === "right" ? parseInt(mapTile.orientation) + 90 : parseInt(mapTile.orientation) - 90;
        }
        console.log(mapTile.orientation)
      }
    });

    setMapLayout([...newLayout]);
  }

  const mirrorTile = (tileKey) => {
    let newLayout = [...mapLayout];
    newLayout.map(mapTile => {
      if(mapTile.i.toString() === tileKey.toString()) {
        // console.log(mapTile.mirror);
        mapTile.mirror = mapTile.mirror === 1 ? -1 : 1;
        // console.log(mapTile.mirror);
      }
    });

    setMapLayout([...newLayout]);
  }

  const removeTile = (tileKey) => {
    const newMapLayout = mapLayout.filter(mapTile => `${mapTile.i}` !== `${tileKey}`);

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
        onDragStart={handleOnDragStart}
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

          <TileControlWidget item={item} handleWidgetButtonClick={handleWidgetButtonClick} handleClickOutsideTile={handleClickOutsideTile} handleWidgetButtonClick={handleWidgetButtonClick} /> 

        </div>
      )}
      </GridLayout>
    </div>
  )
}