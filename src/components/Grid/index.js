import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.scss'
import DraggableTile from '../Tile/DraggableTile'
import Tile from '../Tile';
 
export default function Grid() {

  let [mapLayout, setMapLayout] = useState([
    {i: '0', environment: 'swamp', x: 0, y: 0, w: 1, h: 1, bg: "#a63a50", orientation: 0},
    {i: '1', environment: 'swamp', x: 1, y: 0, w: 1, h: 1, bg: "#5941a9", orientation: 0},
    {i: '2', environment: 'swamp', x: 0, y: 1, w: 1, h: 1, bg: "#4c0827", orientation: 0},
    {i: '3', environment: 'swamp', x: 1, y: 1, w: 1, h: 1, bg: "#435058", orientation: 0},
  ]);

  const handleOnDragStop = (layout) => {
    console.log(layout)
    // let newMap = layout.map(mapTile => {
    //   mapTile.orientation = mapTile.style.transform
    // });

    // setMapLayout(newMap);
  }

  const handleOnDrop = (layoutItem, e) => {
    if(e.i == "__dropping-elem__") {
      let lastTile = mapLayout.pop();
      mapLayout.push(lastTile);
      let bgColor = Math.floor(Math.random()*16777215).toString(16);
      console.log(bgColor);
      // bg hex generator from https://www.paulirish.com/2009/random-hex-color-code-snippets/
      let newTile = {
        i: (parseInt(lastTile.i) + 1).toString(),
        environment: 'swamp',
        x: e.x,
        y: e.y,
        h: 1,
        w: 1,
        orientation: 90,
        bg: `#${bgColor}`
      }
      setMapLayout(mapLayout => [...mapLayout, newTile]);
    }
  }

  const handleTileClick = (e) => {
    e.preventDefault();
    
    // let tile = e.target;
    // let rotation = tile.dataset.orientation === "270" ? 0 : parseInt(tile.dataset.orientation) + 90;
    // tile.setAttribute("data-orientation", rotation.toString());

    // console.log(mapLayout);
  }

  return (
    <div style={{display: "flex", flexFlow: "row wrap"}}>
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
          isDraggable={true}
          isResizable={false}
          onDrop={handleOnDrop}
          // onLayoutChange={handleOnLayoutChange}
          onDragStop={handleOnDragStop}
          style={{backgroundColor: "gainsboro", minHeight: "400px"}}
        >
        {mapLayout.map((item, idx) => <div key={idx} data-grid={{...item}} orientation={item.orientation} onClick={(e) => handleTileClick(e)} ><Tile item={item} /></div> )}
        </GridLayout>
      </div>
      <div style={{flex: "1 0 20%"}}>
        <DraggableTile key="tile0" itemKey="tile0" environment="swamp" orientation={0}></DraggableTile>
      </div>
    </div>
  )
}
