import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import './style.css'
import Tile from '../Tile';
 
export default function Grid() {
  const [currentTile, setCurrentTile] = useState({
    i: 'tile0',
    x: 0,
    y: 0,
    orientation: 1
  });

  // layout is an array of objects, see the demo for more complete usage
  const tileLayout = [
    {i: '1', environment: 'swamp', x: 0, y: 0, w: 1, h: 1, bg: "#a63a50"},
    {i: '2', environment: 'swamp', x: 1, y: 0, w: 1, h: 1, bg: "#5941a9"},
    {i: '3', environment: 'swamp', x: 0, y: 1, w: 1, h: 1, bg: "#dcf763"},
    {i: '4', environment: 'swamp', x: 1, y: 1, w: 1, h: 1, bg: "#435058"},
  ];

  const handleDraggableDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "");
  }

  const handleOnDrop = (layoutItem, e) => {
    console.log(e);
    let targetGrid = document.querySelectorAll(".mapGrid")[0];
    setCurrentTile({
      ...currentTile,
      i: layoutItem.i,
      x: layoutItem.x,
      y: layoutItem.y
    });

    console.log(currentTile);
    // let newTile = React.createElement("div", {key: })

    // targetGrid.appendChild(newTile);
  }

  return (
    <div style={{display: "flex", flexFlow: "row wrap"}}>
      <div id="mapGrid" style={{flex: "1 0 70%"}}>
        <GridLayout 
          className="mapGrid" 
          layout={tileLayout}
          colWidth={100} 
          rowHeight={100}
          width={1200}
          compactType={null} 
          preventCollision={false}
          margin={[0,0]} 
          isDroppable={true}
          onDrop={handleOnDrop}
          style={{backgroundColor: "gainsboro", minHeight: "400px", minWidth: "400px"}}
        >
          {tileLayout.map(item => <div key={item.i} data-key={item.i} data-environment={item.environment} data-orientation={1} style={{backgroundColor: `${item.bg}`}} draggable={true} droppable="true"><span className="top">{item.i} (1)</span> <span className="right">(2)</span> <span className="bottom">(3)</span> <span className="left">(4)</span></div>)}
        </GridLayout>
      </div>
      <div style={{flex: "1 0 20%"}}>
        <div 
          className="droppable-element"
          key="tile0"
          tile="1"
          environment="swamp"
          orientation="1"
          draggable={true}
          unselectable="on"
          // Firefox hack
          onDragStart={e => handleDraggableDragStart(e)}
        >
          DRAG ME
        </div>
      </div>
    </div>
  )
}
