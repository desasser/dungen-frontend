import React from 'react';
import { Drawer, Divider, IconButton, Button } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import ReorderIcon from '@material-ui/icons/Reorder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DraggableTile from '../Tile/DraggableTile';

const useStyles = makeStyles((theme) => ({
  sideNav: {
    top: 80,
    zIndex: 3,
    right: 20,
    position: 'absolute',
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
      width: 350,
      marginTop: 64,
      overflowX: 'hidden'
    }
  }
})(Drawer)

export default function SliderDrawer({ handleDraggableItem }) {
  const classes = useStyles();
  const theme = useTheme();
  
  const [state, setState] = React.useState({
    isDrawerOpened: false
  })

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
    <div>
      <div className={classes.sideNav}>
        {/* className={classes.sideNav} */}
        <IconButton onClick={handleDrawerOpen}>
          {!isDrawerOpened ? <ReorderIcon /> : null}
        </IconButton>
      </div>
      <Divider />
      <TileDrawer
        anchor='right'
        variant='persistent'
        open={isDrawerOpened}
        onClose={handleDrawerClose}
      // classes={{ paper: classes.paper }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        {/* Fetch all tile URLs from db */}
        {/* Map over the array and create a tile for each one */}
        {/* Render the top 18 until scroll down, then render more, etc */}
        <div className={classes.tileGrid}>
          {/* Set this as {children} to handle whether its nav or tiles */}
          <DraggableTile key="0" tileId="0" environment="swamp" imageURL="https://picsum.photos/seed/crocodile/100" handleOnClick={handleDraggableItem} />
        </div>
      </TileDrawer>
    </div>
  );
}
