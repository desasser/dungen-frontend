import React from 'react'
import { makeStyles, withStyles } from "@material-ui/core/styles";

import ActionBtn from '../ActionBtn'

const useStyles = makeStyles({
  CircleMenuContainer: {
    display: "none",
    position: "absolute",
    zIndex: 1000,

    '& .circle-menu-toggle': {
      left: "50%"
    }
  },
  test: {
    background: "red"
  }
});

export default function TileControls(props) {
  const classes = useStyles();

  return (
    <div id={props.id} className={classes.CircleMenuContainer}>
        <ActionBtn
          onClick={props.handleTileControlAction}
          tooltip="Rotate Left"
          data-action="rotateLeft"
        >
          CCW
        </ActionBtn>
        <ActionBtn
          onClick={props.handleTileControlAction}
          tooltip="Rotate Right"
          data-action="rotateRight"
        >
          C-W
        </ActionBtn>
        <ActionBtn
          onClick={props.handleTileControlAction}
          tooltip="Mirror"
          data-action="mirror"
        >
          MRR
        </ActionBtn>
        <ActionBtn
          onClick={props.handleTileControlAction}
          tooltip="Delete"
          data-action="delete"
        >
          DEL
        </ActionBtn>
    </div>
  )
}
