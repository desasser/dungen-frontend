import React from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import './style.scss'
import IconBtn from '../IconBtn'
import DeleteIcon from '@material-ui/icons/Delete'
import RotateRightIcon from '@material-ui/icons/RotateRight'
import RotateLeftIcon from '@material-ui/icons/RotateLeft'
import CloseIcon from '@material-ui/icons/Close'
import FlipIcon from '@material-ui/icons/Flip'

const useStyles = makeStyles({
  tileControlWidget: {
    zIndex: "-999",
    position: "absolute",
    left: "5%",
    top: "5%",
    opacity: 0,
    width: 0,
    height: 0,
    borderRadius: "50%",
    border: "10px solid rgba(230,230,230,0.5)",
    transition: "all 0.3s ease",
  },
  activeWidget: {
    zIndex: "110",
    width: "60px",
    height: "60px",
    left: "10px",
    top: "10px",
    opacity: 1,
    transition: "all 0.3s ease",

    "& .controlButton": {
      display: "flex",
      padding: 0,
      margin: 0,
      left: 0,
      position: "absolute",
      width: "60px",
      backgroundColor: "transparent",
      color: "white",
      "&:hover": {
        background: "transparent"
      },

      "& .MuiSvgIcon-root": {
        background: "white",
        borderRadius: "50%",
        padding: "3px",
        transition: "all 0.3s ease",
      }
    },
    "& .closeWidget": {
      top: "-3px",
      marginLeft: "auto",
      marginRight: "auto",
      color: "orange",

      "&:hover .MuiSvgIcon-root": {
        background: "orange",
        color: "white"
      }
    },
    "& .deleteTile": {
      top: "63px",
      marginLeft: "auto",
      marginRight: "auto",
      color: "red",

      "&:hover .MuiSvgIcon-root": {
        background: "red",
        color: "white"
      }
    },
    "& .rotateTileLeft": {
      left: "-33px",
      top: "50%",
      transform: "rotate(-90deg)",
      color: "dodgerblue",

      "&:hover .MuiSvgIcon-root": {
        background: "dodgerblue",
        color: "white"
      }
    },
    "& .rotateTileRight": {
      left: "33px",
      top: "50%",
      transform: "rotate(90deg)",
      color: "hotpink",

      "&:hover .MuiSvgIcon-root": {
        background: "hotpink",
        color: "white"
      }
    },
    "& .mirrorTile": {
      left: 0,
      top: "50%",
      color: "rebeccapurple",

      "&:hover .MuiSvgIcon-root": {
        background: "rebeccapurple",
        color: "white"
      }
    }
  }
});

export default function TileControlWidget({ item, handleWidgetButtonClick }) {
  const classes = useStyles();

  // React.useEffect(() => {
  //   console.log(item);
  // },[]);

  return (
    <div data-tilekey={item.i} data-tileid={item.tileId} className={item.displayControlWidget ? `${classes.tileControlWidget} ${classes.activeWidget}` : classes.tileControlWidget}>

    {item.displayControlWidget === true &&
      <>
        <IconBtn classes={"controlButton closeWidget"} onClick={(e) => handleWidgetButtonClick("closeWidget", item)}>
          <CloseIcon />
        </IconBtn>
        <IconBtn classes={"controlButton rotateTileRight"} onClick={(e) => handleWidgetButtonClick("rotateRight", item)}>
          <RotateRightIcon />
        </IconBtn>
        <IconBtn classes={"controlButton mirrorTile"} onClick={(e) => handleWidgetButtonClick("mirrorTile", item)}>
          <FlipIcon />
        </IconBtn>
        <IconBtn classes={"controlButton rotateTileLeft"} onClick={(e) => handleWidgetButtonClick("rotateLeft", item)}>
          <RotateLeftIcon />
        </IconBtn>
        <IconBtn classes={"controlButton deleteTile"} onClick={(e) => handleWidgetButtonClick("deleteTile", item)}>
          <DeleteIcon />
        </IconBtn>
      </>
    }
  </div>
  )
}
