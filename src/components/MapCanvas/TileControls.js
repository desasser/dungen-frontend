import React from 'react'
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Box, Grow } from '@material-ui/core'
import { Trail, animated } from 'react-spring/renderprops'
import { RotateLeft, RotateRight, Flip, Delete } from '@material-ui/icons'
import ActionBtn from '../ActionBtn'

const useStyles = makeStyles({
  CircleMenuContainer: {
    position: "absolute",
    zIndex: 1000,
    width: 150,
    height: 150,
    border: '10px solid tomato', 
    boxSizing: 'border-box', 
    borderRadius: '50%', 
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease'
  },
  controlsContainer: {
    flex: 1,
    position: 'relative', 
    width: 200, 
    height: 200,
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'flex-start',
    transition: 'all 0.3s ease'
  },
  buttonContainer: {
    position: 'absolute',
    transformOrigin: 'center 100px',

    '& div': {
      position: 'relative',
      backgroundColor: 'tomato',
      margin: 7,
      padding: 10,
      borderRadius: '50%',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
});

export default function TileControls(props) {
  const classes = useStyles();

  const [controlsOpen, setControlsOpen] = React.useState(false);
  const [controlsPosition, setControlsPosition] = React.useState({top: 400, left: 400})
  let rotationAmount = -90;

  const AnimatedActionBtn = animated(ActionBtn);

  const controls = [
    {
      key: 'rr',
      action: 'rotateRight',
      tooltip: 'Rotate Right',
      content: <RotateRight />,
      onClick: props.handleTileControlAction
    },
    {
      key: 'rl',
      action: 'rotateLeft',
      tooltip: 'Rotate Left',
      content: <RotateLeft />,
      onClick: props.handleTileControlAction
    },
    {
      key: 'mr',
      action: 'mirror',
      tooltip: 'Mirror',
      content: <Flip />,
      onClick: props.handleTileControlAction
    },
    {
      key: 'dl',
      action: 'delete',
      tooltip: 'Delete',
      content: <Delete />,
      onClick: props.handleTileControlAction
    }
  ]

  React.useEffect(() => {
    setControlsOpen(props.contextMenuActive);
    setControlsPosition({top: props.top, left: props.left});

  }, [props.contextMenuActive, props.top, props.left])

  return (
    <Grow in={controlsOpen}>
      <Box className={classes.CircleMenuContainer} style={{...controlsPosition}}>
        <div className={classes.controlsContainer}>
        {controls.map(control => {
          rotationAmount += 90;
          return (
            <div key={control.key} className={classes.buttonContainer} data-action={control.action} tooltip={control.tooltip} onClick={control.onClick} style={{ transform: `rotate(${rotationAmount}deg)` }}>
              <div style={{ transform: `rotate(-${rotationAmount}deg)` }}>{control.content}</div>
            </div>
          )
        })}
        </div>
      </Box>
    </Grow>
  )
}
