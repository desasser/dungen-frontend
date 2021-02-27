import React, { useEffect, useState } from 'react';
import { Drawer, Divider, IconButton, Button } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import ReorderIcon from '@material-ui/icons/Reorder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Tile from '../Tile';
import API from '../../utils/API';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import DraggableTile from '../Tile/DraggableTile';

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
    position:'fixed'
  },
  tileGrid: {
    marginLeft: 25,
    marginTop:25,
    paddingTop: 25,
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
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
      backgroundColor: '#bada55',
      width: 400,
      marginTop: 64,
      overflowX: 'hidden'
    }
  }
})(Drawer)

export default function SliderDrawer({ handleDraggableItem }) {
  const classes = useStyles();
  const [state, setState] = useState({
    isDrawerOpened: false
  })
  const [tileState, setTileState] = useState([]);
  const [loadState, setLoadState] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    loadTiles()
  }, [])


  const loadTiles = () => {
    API.getTiles()
      .then(res => {
        console.log('response', res.data);
        setLoadState(true)
        setTileState(res.data);
        // check length of response and render No Maps! or All maps!
      }).catch(err => {
        console.log(err);
        // add a simple snackbar that says 'sorry, we failed you, try again!'
        // setErrorState(true);
      })
  }

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

  const { isDrawerOpened } = state;
  
  return (
    <Container>
      <Container className={classes.sideNav} maxWidth={false}>
        {/* className={classes.sideNav} */}
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
      // classes={{ paper: classes.paper }}
      >
        <Container className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Container>
        {/* Fetch all tile URLs from db */}
        {/* Map over the array and create a tile for each one */}
        {/* Render the top 18 until scroll down, then render more, etc */}
        <Container className={classes.tileGrid}>
          {/* Set this as {children} to handle whether its nav or tiles */}
          {tileState ?
          tileState.map(tile => (
            // TODO: Check this on deploy
            <Tile key={tile.id} id={tile.id} image={tile.image_url} />
          )) : (
            (!loadState ? (
              <CircularProgress />
            ) : (
                <Typography variant='h3'>
                  No tiles!
                </Typography>))
          )}
        </Container>
          {/* <DraggableTile key="0" tileId="0" environment="swamp" imageURL="https://picsum.photos/seed/crocodile/100" handleOnClick={handleDraggableItem} /> */}
      </TileDrawer>
    </Container>
  );
}
