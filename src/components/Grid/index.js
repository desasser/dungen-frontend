import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.scss'
// import DraggableTile from '../Tile/DraggableTile'
import Tile from '../Tile';
import TileControlWidget from '../TileControlWidget'
 
export default function Grid() {
  const [lastTileKey, setLastTileKey] = useState(0);
  const [mapLayout, setMapLayout] = useState([
    {i: '0', tileId: '2', environment: 'swamp', x: 0, y: 0, w: 1, h: 1, bg: "#a63a50", orientation: 0, displayControlWidget: false},
    {i: '1', tileId: '7', environment: 'swamp', x: 1, y: 0, w: 1, h: 1, bg: "#5941a9", orientation: 0, displayControlWidget: false},
    {i: '2', tileId: '3', environment: 'swamp', x: 0, y: 1, w: 1, h: 1, bg: "#4c0827", orientation: 0, displayControlWidget: false},
    {i: '3', tileId: '12', environment: 'swamp', x: 1, y: 1, w: 1, h: 1, bg: "#435058", orientation: 0, displayControlWidget: true},
  ]);

  {/* [
    {i: '0', tileId: '2', environment: 'swamp', x: 0, y: 0, w: 1, h: 1, bg: "#a63a50", orientation: 0, displayControlWidget: false},
    {i: '1', tileId: '7', environment: 'swamp', x: 1, y: 0, w: 1, h: 1, bg: "#5941a9", orientation: 0, displayControlWidget: false},
    {i: '2', tileId: '3', environment: 'swamp', x: 0, y: 1, w: 1, h: 1, bg: "#4c0827", orientation: 0, displayControlWidget: false},
    {i: '3', tileId: '12', environment: 'swamp', x: 1, y: 1, w: 1, h: 1, bg: "#435058", orientation: 0, displayControlWidget: true},
  ] */}

  const handleOnDrop = (layout, item, e) => {
    console.log(layout, item, e)
  }

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

  const handleWidgetButtonClick = (action, itemKey) => {
    console.log(action);
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
