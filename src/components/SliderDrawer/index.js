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
    paddingBottom: 100,
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',

    "& .droppable-element": {
      margin: "0.75rem"
    }
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
  const [tileSet, setTileSet] = useState([]);
  const [loadState, setLoadState] = useState(false);

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

  const { isDrawerOpened } = state;

  useEffect(() => {
    API.getTiles()
    .then(tiles => {
      const list = tiles.data;
      let tileList = [];
      for(let i = 0; i < list.length; i++) {
        const tile = {
          key: i,
          tileId: list[i].id,
          environment: list[i].Environment.name,
          imageURL:  list[i].image_url
        }
        tileList.push(tile);
      }
      setTileSet(tileList);
      setLoadState(true);
    })
    .catch(err => console.error(err))
  },[]);
  
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
      // classes={{ paper: classes.paper }}
      >
        <Container className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Container>
        {/* Render the top 18 until scroll down, then render more, etc */}
        <Container className={classes.tileGrid}>
          {tileSet ?
          tileSet.map(tile => <DraggableTile key={tile.key} tileId={tile.tileId} environment={tile.environment} imageURL={tile.imageURL} handleOnDragStart={handleDraggableItem} />) : (
            (!loadState ? (
              <CircularProgress />
            ) : (
                <Typography variant='h3'>
                  No tiles!
                </Typography>))
          )}
        </Container>
      </TileDrawer>
    </Container>
  );
}
