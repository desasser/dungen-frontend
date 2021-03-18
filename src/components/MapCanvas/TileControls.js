import React from 'react'
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Box, Grow } from '@material-ui/core'
import { useTransition, useSpring, useChain, animated, config } from 'react-spring'
import { RotateLeft, RotateRight, Flip, Delete, BugReport } from '@material-ui/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {faDiceD20 } from '@fortawesome/pro-duotone-svg-icons'
import { faRedoAlt, faUndoAlt, faTrash, faDiceD20 } from '@fortawesome/pro-solid-svg-icons'
import ActionBtn from '../ActionBtn'

const useStyles = makeStyles({
  CircleMenuContainer: {
    position: "absolute",
    zIndex: 1000,
    border: '10px solid tomato', 
    boxSizing: 'border-box', 
    borderRadius: '50%', 
    width: 150,
    height: 150,
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
    // transition: 'all 0.3s ease',
    willChange: 'opacity'

  },
  buttonContainer: {
    position: 'absolute',
    transformOrigin: 'center 100px',
    willChange: 'transform, opacity',
    transition: 'all 0.3s ease',

    '& button': {
      border: 0,
      position: 'relative',
      backgroundColor: 'tomato',
      margin: 7,
      padding: 10,
      borderRadius: '50%',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '26px',
      willChange: 'rotation',
      transition: 'all 0.3s ease'
    }
  }
});

export default function TileControls(props) {
  const classes = useStyles();

  const [controlsOpen, setControlsOpen] = React.useState(false);
  const [controlsPosition, setControlsPosition] = React.useState({top: 400, left: 400})

  const controls = [
    {
      key: 'rr',
      action: 'rotateRight',
      tooltip: 'Rotate Right',
      content: <FontAwesomeIcon icon={faRedoAlt} />,
      onClick: props.handleTileControlAction
    },
    {
      key: 'rl',
      action: 'rotateLeft',
      tooltip: 'Rotate Left',
      content: <FontAwesomeIcon icon={faUndoAlt} />,
      onClick: props.handleTileControlAction
    },
    {
      key: 'mr',
      action: 'mirror',
      tooltip: 'Mirror',
      content: <Flip fontSize='inherit' />,
      onClick: props.handleTileControlAction
    },
    {
      key: 'dl',
      action: 'delete',
      tooltip: 'Delete',
      content: <FontAwesomeIcon icon={faTrash} />,
      onClick: props.handleTileControlAction
    },
    {
      key: 'tb',
      action: 'test',
      tooltip: 'Test',
      content: <FontAwesomeIcon icon={faDiceD20} />,
      onClick: props.handleTileControlAction
    }
  ]
  let rotationAmount = -(360 / controls.length);


  React.useEffect(() => {
    setControlsOpen(props.contextMenuActive);
    setControlsPosition({top: props.top, left: props.left});

  }, [props.contextMenuActive, props.top, props.left]);
  
  // for container
  const springRef = React.useRef();
  const springProps = useSpring({
    ref: springRef,
    from: { opacity: '0', transform: 'rotate(0deg) scale(0,0)' },
    to: {
      opacity: controlsOpen ? '1' : '0',
      transform: controlsOpen ? 'rotate(360deg) scale(1,1)' : 'rotate(0deg) scale(0,0)'
    },
    config: { tension: 70, friction: 3, mass: 1, velocity: 3, clamp: true }
  });

  // for buttons
  const transitionRef = React.useRef()
  const transitions = useTransition(
    controlsOpen ? controls : [],
    (item) => item.key,
  {
    ref: transitionRef,
    unique: true,
    trail: 100 / controls.length,
    config: config.slow,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  useChain(controlsOpen ? [springRef, transitionRef] : [transitionRef, springRef], [0, 0.1])

  return (
    <animated.div id="tile-controls" className={classes.CircleMenuContainer} style={{...springProps, top: controlsPosition.top, left: controlsPosition.left}}>
      <animated.div className={classes.controlsContainer}>
        {transitions.map( ({item, key, props}) => {
          rotationAmount += 360 / transitions.length;
          console.log(rotationAmount)
          return (
            <animated.div className={classes.buttonContainer} key={key}  style={{ ...props.opacity, transform: `rotate(${rotationAmount}deg)` }}>
              <button style={{ transform: `rotate(-${rotationAmount}deg)` }} onClick={item.onClick} data-action={item.action} tooltip={item.tooltip}>{item.content}</button>
            </animated.div>
          )
        })}
      </animated.div>
    </animated.div>
  )
}
