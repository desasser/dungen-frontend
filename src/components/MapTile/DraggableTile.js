import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  tilesetTile: {
    width: 100,
    height: 100,
    borderTop: '8px solid palegoldenrod',
    borderLeft: '8px solid goldenrod',
    borderRight: '8px solid midnightblue',
    borderBottom: '8px solid midnightblue',
  }
});

// key={tile.key} tileId={tile.tileId} tileSet={tile.tileSet} imageURL={tile.imageURL} handleOnDragStart={handleDraggableItem}

export default function DraggableTile({ tileId, tileSet, imageURL, handleDraggableItem }) {
  const classes = useStyles();

  return (
    <img 
      className={`${classes.tilesetTile} droppable-element`}
      data-tileid={tileId}
      data-tileset={tileSet}
      draggable={true}
      unselectable="on"
      src={imageURL}
      onDragStart={handleDraggableItem}
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
