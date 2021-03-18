import React from "react";
import Container from '@material-ui/core/Container';
import './style.scss'

export default function DraggableTile({ tileId, children, imageURL, handleOnDragStart }) {

  // const handleDraggableDragStart = (e) => {
  //   e.dataTransfer.setData("text/plain", "");
  // }

  return (
    <img 
      className="droppable-element"
      data-tileid={tileId}
      draggable={true}
      unselectable="on"
      src={imageURL}
      onDragStart={handleOnDragStart}
    />
    // <div
    //   className="droppable-element"
    //   key={tileId}
    //   data-tileid={tileId}
    //   // data-image={imageURL}
    //   draggable={true}
    //   unselectable="on"
    //   style={{backgroundImage: `url(${imageURL})`, borderRight: "8px solid #1e3a42", borderBottom: "8px solid #1e3a42", borderTop: "8px solid #8eb1c7", borderLeft: "8px solid #8eb1c7"}}
    //   // style={{background: `url(${imageURL})`, borderRight: "8px solid #1e3a42", borderBottom: "8px solid #1e3a42", borderTop: "8px solid #8eb1c7", borderLeft: "8px solid #8eb1c7"}}
    //   // Firefox hack
    //   onDragStart={handleOnDragStart}
    // >
    //   {children}
    // </div>
  );
}
