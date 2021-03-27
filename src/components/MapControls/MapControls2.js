import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { Box, Container, Typography, Drawer, Divider, IconButton, Switch, Grid } from '@material-ui/core';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { purple, red, pink, blue, lightGreen, lime, deepOrange } from '@material-ui/core/colors';
import {
  Reorder as ReorderIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  AccountCircle,
  Flare,
  Star,
  Help,
  GpsFixed
} from '@material-ui/icons';

import ActionBtn from '../ActionBtn'
import { CanvasContext } from '../../contexts/CanvasContext';

const useStyles = makeStyles((theme) => ({
  sideNav: {
    zIndex: 3,
    left: -45,
    width: 40,
    top: 80,
    position: 'absolute',
    width: 10,
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    paddingBottom: 0,
    margin: 0,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    position: 'fixed',
    maxWidth: '230px',
  },
  tileHeader: {
    margin: '0 auto',
    padding: '40px 0',
    fontFamily: 'SpaceAndAstronomy',
    fontWeight: 'bold',
    color: 'white',
    position: 'relative',
  },
  drawerCloseBtn: {
    color: 'white',
    width: 50,
    left: 20,
    '&:hover': {
      backgroundColor: '#eb4511',
      color: 'white'
    }
  },
  tileError: {
    fontFamily: 'SpaceAndAstronomy',
    color: 'white',
    marginTop: 100
  },
  menuItemStyle: {
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'SpaceAndAstronomy'
  },
  drawerOpenBtn: {
    backgroundColor: 'rgba(255,255,255, 0.5)',
    left: 10,
    top: 10,
    width: 80,
    paddingLeft: '2rem',
    borderRadius: '0 40% 40% 0',
    '&:hover': {
      backgroundColor: '#eb4511',
      color: 'white'
    },
  },
  controlsContainer: {
    '& > *': {
      margin: '10px 0',
      fontSize: '0.7rem'
    }
  },
  centerGrid: {
    backgroundColor: lightGreen[300],
    '&:hover': {
      backgroundColor: lightGreen[500]
    },
    '&.Mui-disabled': {
      color: 'darkgrey',
      backgroundColor: 'rgba(100,100,100,0.5)'
    }
  },
  recenter: {
    backgroundColor: lime[300],
    // color: 'white'
  },
  clearMap: {
    backgroundColor: red[300],
    color: 'white',
    '&:hover': {
      backgroundColor: red[500]
    },
    '&.Mui-disabled': {
      color: 'darkgrey',
      backgroundColor: 'rgba(100,100,100,0.5)'
    }
  },
  clearPins: {
    backgroundColor: deepOrange[300],
    color: 'white',
    marginLeft: 8,
    '&:hover': {
      backgroundColor: deepOrange[500]
    },
    '&.Mui-disabled': {
      color: 'darkgrey',
      backgroundColor: 'rgba(100,100,100,0.5)'
    }
  },
  hidePins: {
    backgroundColor: blue[300],
    // color: 'white',
    marginLeft: 8,
    '&:hover': {
      backgroundColor: blue[500]
    },
    '&.Mui-disabled': {
      color: 'darkgrey',
      backgroundColor: 'rgba(100,100,100,0.5)'
    }
  },
  pin: {
    boxSizing: 'border-box',
    display: 'inline-block',
    position: 'relative',
    textAlign: 'center',
    backgroundColor: 'grey',
    width: 30,
    height: 30,
    borderRadius: '50% 50% 50% 0',
    transform: 'rotate(-45deg)',
    margin: '10px 5px 20px',

    '&:before': {
      content: '',
      width: 14,
      height: 14,
      margin: '8px 0 0 8px',
      position: 'absolute',
      borderRadius: '50%',
      textAlign: 'center'
    },

    '& > button': {
      transform: 'rotate(45deg)',
      position: 'relative',
      display: 'block',
      padding: '0',
      margin: '2px auto 0',
      zIndex: 10,
      color: 'white'
    },

    '&:hover': {
      boxShadow: '1px 1px 5px white, -1px -1px 5px white'
    },
    
    "&.pin-type1": {
      backgroundColor: 'forestgreen',
    },
    "&.pin-type2": {
      backgroundColor: 'firebrick',
    },
    "&.pin-type3": {
      backgroundColor: 'orchid',
    },
    "&.pin-type4": {
      backgroundColor: 'dodgerblue',
    },
    "&.pin-type5": {
      backgroundColor: 'salmon',
    },
  },
  activePin: {
    border: '2px solid chartreuse',

    '& > button': {
      margin: '1px auto'
    }
  },
  renderImage: {
    backgroundColor: lime[200],
    flex: "0 0 auto",
    justifySelf: "flex-end",
    // color: "white",
    marginTop: "1rem",
    
    '&:hover': {
      backgroundColor: lime[400]
    }
  },
}));

const TilesGridSwitch = withStyles({
  root: {
    margin: 0
  },
  switchBase: {
    color: pink[300],

    '& + $track': {
      backgroundColor: pink[300]
    },

    '&$checked': {
      color: purple[400],
    },
    '&$checked + $track': {
      backgroundColor: purple[400],
    },
  },
  checked: {},
  track: {},
})(Switch);

const RenderWithPinsSwitch = withStyles({
  switchBase: {
    color: 'gainsboro',

    '&$checked': {
      color: lime[400],
    },
    '&$checked + $track': {
      backgroundColor: lime[400],
    },
  },
  checked: {},
  track: {},
})(Switch);

const TogglePinVisibilitySwitch = withStyles({
  switchBase: {
    color: 'gainsboro',

    '&$checked': {
      color: lime[400],
    },
    '&$checked + $track': {
      backgroundColor: lime[400],
    },
  },
  checked: {},
  track: {},
})(Switch);

const TileDrawer = withStyles({
  root: {
    "& .MuiDrawer-paper": {
      backgroundColor: '#36434b',
      width: 250,
      marginTop: 64,
      overflowX: 'hidden',
      border: '1px #707078 solid'
    }
  }
})(Drawer)

export default function MapControls2() {
  const { controlsData } = useContext(CanvasContext);
  const { handlePinStatus, activePin, setActivePin, grid, stageRef, stagePosition } = controlsData

  const theme = useTheme();
  const classes = useStyles();

  const [state, setState] = useState({
    isDrawerOpened: true
  })

  const history = useHistory();

  const [renderWithPins, setRenderWithPins] = useState(false);
  const [pinsVisible, setPinsVisible] = useState(controlsData.togglePins.pinsVisible);
  const [currentPin, setCurrentPin] = useState(activePin);

  const renderImage = () => {
    console.log("map controls, render image")
    // 0 === coordgrid, 1 === shadow tile, 2 === map tiles + pins
    let target = stageRef.current.children[2];
    console.log(target);
    /**
     * LEAVING IN CASE WE ADD MORE LAYERS THAT NEED TO BE RENDERED
     * WITH MAP TILES + PINS LAYER
     * took var indicating whether or not to include the extra layer
     * this is now redundant, b/c pins are visible/hidden individually
     */
    // if(renderWithPins && mapPins.length > 0) {
    //   let layer = stageRef.current.children[2];
    //   for(var i = 0; i < pinsLayer.children.length; i++) {
    //     layer.children.push(pinsLayer.children[i])
    //   }
    //   target = layer;
    // }

    if(!renderWithPins) {
      target.children.each((shape, n) => { shape.attrs.className === "map-pin" && shape.visible(false) })
    }
    console.log(typeof target.children, target.children)

    let sortedByXCoords = [...target.children].sort((a,b) => a.attrs.x < b.attrs.x ? 1 : -1);
    let sortedByYCoords = [...target.children].sort((a,b) => a.attrs.y < b.attrs.y ? 1 : -1);

    let x = sortedByXCoords[sortedByXCoords.length - 1].attrs.x;
    let y = sortedByYCoords[sortedByYCoords.length - 1].attrs.y;
    let mapWidth = (sortedByXCoords[0].attrs.x + grid.tileSize) - sortedByXCoords[sortedByXCoords.length - 1].attrs.x;
    let mapHeight = (sortedByYCoords[0].attrs.y + grid.tileSize) - sortedByYCoords[sortedByYCoords.length - 1].attrs.y;

    const uri = target.toDataURL({x: stagePosition.x + x, y: stagePosition.y + y, width: mapWidth, height: mapHeight}); // requires CORS!
    localStorage.setItem('dungen_map_image', uri);

    history.push('/preview')
  }

  useEffect(() => {
    const savedMap = localStorage.getItem('dungen_map') !== null ? JSON.parse(localStorage.getItem('dungen_map')) : null;

    if(savedMap !== null) {
      setPinsVisible(savedMap.pinsVisible);
    }
  }, []);

  const togglePins = e => {
    setPinsVisible(prev => !prev);
    controlsData.togglePins.props.onClick(e);
  }

  const updatePinStatus = (e) => {
    handlePinStatus(e)
    // e.preventDefault();
    // // e.stopPropagation();

    // const pinType = `type${e.key}`;

    // if(currentPin === pinType) {
    //   console.log(currentPin, "===", pinType)
    //   setCurrentPin(null);
    
    // } else {
    //   console.log(currentPin, "!==", pinType)
    //   setCurrentPin(pinType);
    // }
    // console.log("mapcontrols", pinType, currentPin)
  }

  /**
   *  HOTKEYS
   */
  // pins
  useHotkeys('ctrl+1, command+1', (e) => updatePinStatus(e));
  useHotkeys('ctrl+2, command+2', (e) => updatePinStatus(e));
  useHotkeys('ctrl+3, command+3', (e) => updatePinStatus(e));
  useHotkeys('ctrl+4, command+4', (e) => updatePinStatus(e));
  useHotkeys('ctrl+5, command+5', (e) => updatePinStatus(e));
  useHotkeys('esc', (e) => updatePinStatus(e));


  /**
   * HOTKEYS
   */
  // pins

  return (
    <Box>
      {/* CONTROLS DRAWER TITLE */}
      <Container className={classes.tileGrid}>
        <Typography variant='h5' className={classes.tileHeader}>
          Map Controls
        </Typography>
      </Container>

      {/* MAP TOOLS */}
      <Container className={classes.controlsContainer} spacing={1}>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item style={{color: "white", fontFamily: "sans-serif", margin: '0', padding: '0'}}>Move Tiles</Grid>
            <Grid item style={{margin: '0', padding: '0'}}>
              <TilesGridSwitch {...controlsData.toggleTileLock.props} />
            </Grid>
          <Grid item style={{color: "white", fontFamily: "sans-serif", margin: '0', padding: '0'}}>Move Grid</Grid>
        </Grid>
        {/* {controlsData.toggleTileLock.args.visible ?
          
          :
          ''
        } */}
        <ActionBtn classes={controlsData.centerGrid.args.gridCentered ? classes.centerGrid : `${classes.centerGrid} ${classes.recenter}`} {...controlsData.centerGrid.props} disabled={controlsData.centerGrid.args.gridCentered}>
          {controlsData.centerGrid.text}
        </ActionBtn>
        <br/>
        <ActionBtn classes={classes.clearMap} {...controlsData.clearMap.props} disabled={controlsData.clearMap.args.mapLayoutLength === 0}>
          {controlsData.clearMap.text}
        </ActionBtn>
        <ActionBtn classes={classes.clearPins} {...controlsData.clearPins.props} disabled={controlsData.clearPins.args.mapPinsLength === 0}>
          {controlsData.clearPins.text}
        </ActionBtn>

        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item style={{color: "white", fontFamily: "sans-serif"}}>Hide Pins</Grid>
          <Grid item>
          <TogglePinVisibilitySwitch onClick={(e) => togglePins(e)} checked={pinsVisible}  id="togglePinsVisible" />
          </Grid>
          <Grid item style={{color: "white", fontFamily: "sans-serif"}}>Show Pins</Grid>
        </Grid>
      </Container>
      
      <Divider />

      {/* PINS */}
      <Container id="controls-pins">
        <div className={activePin === 'type1' ? `${classes.pin} pin-type1 ${classes.activePin}` : `${classes.pin} pin-type1`} style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
          <IconButton onClick={handlePinStatus} data-pintype="type1" style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
            <GpsFixed />
          </IconButton>
        </div>
        <div className={activePin === 'type2' ? `${classes.pin} pin-type2 ${classes.activePin}` : `${classes.pin} pin-type2`} style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
          <IconButton {...controlsData.pins.props} data-pintype="type2" style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
            <Flare />
          </IconButton>
        </div>
        <div className={activePin === 'type3' ? `${classes.pin} pin-type3 ${classes.activePin}` : `${classes.pin} pin-type3`} style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
          <IconButton {...controlsData.pins.props} data-pintype="type3" style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
            <Star />
          </IconButton>
        </div>
        <div className={activePin === 'type4' ? `${classes.pin} pin-type4 ${classes.activePin}` : `${classes.pin} pin-type4`} style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
          <IconButton {...controlsData.pins.props} data-pintype="type4" style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
            <AccountCircle />
          </IconButton>
        </div>
        <div className={activePin === 'type5' ? `${classes.pin} pin-type5 ${classes.activePin}` : `${classes.pin} pin-type5`} style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
          <IconButton {...controlsData.pins.props} data-pintype="type5" style={{ cursor: pinsVisible ? 'pointer' : 'not-allowed'}}>
            <Help />
          </IconButton>
        </div>
      </Container>

      <Divider />

      {/* PREVIEW / EXPORT */}
      <Container spacing={1}>
        {/* PREVIEW */}
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>
            <RenderWithPinsSwitch onClick={() => setRenderWithPins(prev => !prev)} />
          </Grid>
          <Grid item style={{color: "white", fontFamily: "sans-serif"}}>Include Pins</Grid>
        </Grid>
        <ActionBtn classes={classes.renderImage} onClick={renderImage} disabled={controlsData.renderImage.args.mapLayoutLength === 0}>
          {controlsData.renderImage.text}
        </ActionBtn>
      </Container>
    </Box>
  );
}