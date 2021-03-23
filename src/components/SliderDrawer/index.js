import React, { useEffect, useState } from 'react';
import { Drawer, Divider, IconButton, Button } from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import API from '../../utils/API';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import DraggableTile from '../MapTile/DraggableTile';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import StartMap from "../StartMap";

const useStyles = makeStyles((theme) => ({
  sideNav: {
    top: 80,
    // zIndex: 3,
    right: 40,
    position: 'absolute',
    width: 10,
  },
  paper: {
    width: '30%'
    // backgroundColor: 'pink',
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    position: 'fixed'
  },
  tileGrid: {
    marginLeft: 25,
    marginTop: 25,
    paddingTop: 25,
    paddingBottom: 100,
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'column',
    "& .droppable-element": {
      margin: "0.75rem"
    }
  },
  tileHeader: {
    margin: '10 auto',
    fontFamily: 'SpaceAndAstronomy',
    fontWeight: 'bold',
    color: 'white'
  },
  drawerCloseBtn: {
    color: 'white',
    '&:hover': {
      backgroundColor: '#eb4511',
      color: 'white'
    }
  },
  tileWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  selectMenu: {
    marginRight: 20,
    '& .MuiSelect-select': {
      marginTop: 10,
      fontFamily: 'SpaceAndAstronomy',
      color: 'white'
    },
    '& .MuiSelect-icon': {
      color: 'white'
    },
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
  paper: {
    backgroundColor: '#cad8e0'
  },
  tileOpenBtn: {
    backgroundColor: 'rgba(255,255,255, 0.5)',
    '&:hover': {
      backgroundColor: '#eb4511',
      color: 'white'
    },
  }
}));

const StyledButton = withStyles({
  root: {
    top: 20,
    zIndex: 3,
    left: 20,
    position: 'fixed',
    backgroundColor: '#bada55',
  }
})(IconButton)

const TileDrawer = withStyles({
  root: {
    "& .MuiDrawer-paper": {
      backgroundColor: '#36434b',
      width: 400,
      marginTop: 64,
      overflowX: 'hidden',
      border: '1px #707078 solid'
    }
  }
})(Drawer)

export default function SliderDrawer({ handleMapData, handleDraggableItem }) {
  const classes = useStyles();
  const [state, setState] = useState({
    isDrawerOpened: true
  })
  const [tileSet, setTileSet] = useState([]);
  const [loadState, setLoadState] = useState(false);
  // Material-UI warning "out-of-range value `1` for the select component"
  // I know this *works*, so is there any way to suppress this alert?
  // we get 3+ per page load
  const [tileSetState, setTileSetState] = useState('1');
  const [tileSetListState, setTileSetListState] = useState([]);

  const theme = useTheme();

  const handleDrawerOpen = () => {
    setState({
      isDrawerOpened: true,
    })
  }

  const handleDrawerClose = () => {
    setState({
      isDrawerOpened: false,
    })
  }

  const handleChangeTileSet = (event) => {
    setTileSetState(event.target.value);
  };

  const { isDrawerOpened } = state;

  useEffect(() => {
    // GET ALL TILES FROM ONE TileSets, RERUN WHEN TileSets IS CHANGED
    API.getTilesByTileSet(tileSetState)
      .then(tiles => {
        const list = tiles.data;
        let tileList = [];
        for (let i = 0; i < list.length; i++) {
          const tile = {
            key: i,
            tileId: list[i].id,
            tileSet: list[i].TileSet.name,
            imageURL: list[i].image_url
          }
          tileList.push(tile);
        }
        setTileSet(tileList);
        setLoadState(true);
      })
      .catch(err => console.error(err))
  }, [tileSetState]);

  useEffect(() => {
    // FETCH ALL TileSets
    API.getTileSets().then(tileSets => {
      setTileSetListState(tileSets.data)
    }).catch(err => console.error(err))
  }, []);

  const capitalizeMe = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return (
    <>
      <Container maxWidth={false} className={classes.sideNav}>
        <IconButton onClick={handleDrawerOpen} className={classes.tileOpenBtn}>
          {!isDrawerOpened ? <ReorderIcon /> : null}
        </IconButton>
      </Container>

      <Divider />

      <TileDrawer
        anchor='right'
        variant='persistent'
        open={isDrawerOpened}
        onClose={handleDrawerClose}
        // onClick={() => document.querySelector("#tile-controls").style.display = 'none'}
      >
        {/*==================== Calvin's doing something wierd ===================*/}
        
        {/* <StartMap handleMapData={handleMapData} /> */}
        
        {/*==================== Calvin's done doing something wierd ===================*/}
        <Container className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose} className={classes.drawerCloseBtn}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Container>

        <Container className={classes.tileGrid}>
          <Typography variant='h5' className={classes.tileHeader}>
            Dungeon Tiles
          </Typography>

          {/* Drop down menu for tileSet change */}
          <InputLabel id="demo-simple-select-label" style={{ color: '#707078', position: 'relative', left: '-35%', top: '.3%' }}>Tile Sets</InputLabel>
          <Select
            labelId="select-tileSet"
            id="select-tileSet"
            value={tileSetState}
            onChange={handleChangeTileSet}
            className={classes.selectMenu}
          >
            {/* MAP OVER ALL ENVIRONMENTS AND CREATE MENU ITEMS */}
            {tileSetListState.map(tileSet => <MenuItem key={tileSet.id} value={tileSet.id} className={classes.menuItemStyle}>{tileSet.name.charAt(0).toUpperCase() + tileSet.name.slice(1)}</MenuItem>)}
          </Select>

          {/* Tile display */}
          <Container className={classes.tileWrapper}>

            {tileSet.length > 0 ?
              tileSet.map(tile => <DraggableTile key={tile.key} tileId={tile.tileId} tileSet={tile.tileSet} imageURL={tile.imageURL} handleDraggableItem={handleDraggableItem} />) : (
                (!loadState ? (
                  // <CircularProgress />
                  <LinearProgress />
                ) : (
                    <Typography variant='h3' className={classes.tileError}>
                      No tiles!
                    </Typography>))
              )}
          </Container>
        </Container>
      </TileDrawer>
    </>
  );
}
