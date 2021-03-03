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
import DraggableTile from '../Tile/DraggableTile';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  sideNav: {
    top: 80,
    zIndex: 3,
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
    }
  },
  tileError: {
    fontFamily: 'SpaceAndAstronomy',
    color: 'white',
    marginTop: 100
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

export default function SliderDrawer({ handleDraggableItem }) {
  const classes = useStyles();
  const [state, setState] = useState({
    isDrawerOpened: false
  })
  const [tileSet, setTileSet] = useState([]);
  const [loadState, setLoadState] = useState(false);
  const [environmentState, setEnvironmentState] = useState('1');
  const [environmentListState, setEnvironmentListState] = useState([]);

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

  const handleChangeEnvironment = (event) => {
    setEnvironmentState(event.target.value);
  };

  const { isDrawerOpened } = state;

  useEffect(() => {
    // GET ALL TILES FROM ONE ENVIRONMENT, RERUN WHEN ENVIRONMENT IS CHANGED
    API.getTilesByEnvironment(environmentState)
      .then(tiles => {
        const list = tiles.data;
        let tileList = [];
        for (let i = 0; i < list.length; i++) {
          const tile = {
            key: i,
            tileId: list[i].id,
            environment: list[i].Environment.name,
            imageURL: list[i].image_url
          }
          tileList.push(tile);
        }
        setTileSet(tileList);
        setLoadState(true);
      })
      .catch(err => console.error(err))
  }, [environmentState]);

  useEffect(() => {
    // FETCH ALL ENVIRONMENTS
    API.getEnvironments().then(environments => {
      setEnvironmentListState(environments.data)
    }).catch(err => console.error(err))
  }, []);

  const capitalizeMe = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return (
    <Container>
      <Container className={classes.sideNav} maxWidth={false}>
        <IconButton onClick={handleDrawerOpen}>
          {!isDrawerOpened ? <ReorderIcon /> : null}
        </IconButton>
      </Container>
      <Divider />
      <TileDrawer
        anchor='right'
        variant='persistent'
        open={isDrawerOpened}
        onClose={handleDrawerClose}
      >
        <Container className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose} className={classes.drawerCloseBtn}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Container>

        <Container className={classes.tileGrid}>
          <Typography variant='h5' className={classes.tileHeader}>
            Dungeon Tiles
          </Typography>

          {/* Drop down menu for environment change */}
          <InputLabel id="demo-simple-select-label" style={{ color: '#707078', position: 'relative', left: '-35%', top: '.3%' }}>Environment</InputLabel>
          <Select
            labelId="select-environment"
            id="select-environment"
            value={environmentState}
            onChange={handleChangeEnvironment}
            className={classes.selectMenu}
          >
            {/* MAP OVER ALL ENVIRONMENTS AND CREATE MENU ITEMS */}
            {environmentListState.map(environment => <MenuItem key={environment.id} value={environment.id}>{environment.name.charAt(0).toUpperCase() + environment.name.slice(1)}</MenuItem>)}
          </Select>

          {/* Tile display */}
          <Container className={classes.tileWrapper}>

            {tileSet.length > 0 ?
              tileSet.map(tile => <DraggableTile key={tile.key} tileId={tile.tileId} environment={tile.environment} imageURL={tile.imageURL} handleOnDragStart={handleDraggableItem} />) : (
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
    </Container>
  );
}
