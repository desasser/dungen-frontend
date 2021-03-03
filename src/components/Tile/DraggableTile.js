import React from "react";
import Container from '@material-ui/core/Container';
import './style.scss'

export default function DraggableTile({ tileId, children, imageURL, handleOnDragStart }) {

  // const handleDraggableDragStart = (e) => {
  //   e.dataTransfer.setData("text/plain", "");
  // }

  return (
    <div
      className="droppable-element"
      data-tileid={tileId}
      data-maptileid={null}
      data-environment="swamp"
      data-image={imageURL}
      draggable={true}
      unselectable="on"
      style={{backgroundImage: `url(${imageURL})`, borderRight: "8px solid sienna", borderBottom: "8px solid sienna", borderTop: "8px solid burlywood", borderLeft: "8px solid burlywood"}}
      // Firefox hack
      onDragStart={handleOnDragStart}
    >
      {children}
    </div>
  );
}
