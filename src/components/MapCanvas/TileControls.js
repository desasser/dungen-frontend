import React from 'react'
import { makeStyles, withStyles } from "@material-ui/core/styles";

// circular menu
// import { CircleMenu, ActionBtn } from 'react-circular-menu'
// import 'react-circular-menu/styles.css';
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

  const handleClick = e => {
    console.log(e.target);
  }

  return (
    <div id={props.id} className={classes.CircleMenuContainer} onClick={(e) => handleClick(e)}>
        <ActionBtn
          onClick={(e) => handleClick(e)}
          tooltip="Rotate Left"
        >
          CCW
        </ActionBtn>
        <ActionBtn
          onClick={(e) => handleClick(e)}
          tooltip="Rotate Right"
        >
          C-W
        </ActionBtn>
        <ActionBtn
          onClick={(e) => handleClick(e)}
          tooltip="Mirror"
        >
          MRR
        </ActionBtn>
        <ActionBtn
          onClick={(e) => handleClick(e)}
          tooltip="Delete"
        >
          DEL
        </ActionBtn>
        <ActionBtn
          onClick={(e) => handleClick(e)}
          tooltip="Test"
          className={classes.test}
        >
          TEST
        </ActionBtn>
    </div>
  )
}
