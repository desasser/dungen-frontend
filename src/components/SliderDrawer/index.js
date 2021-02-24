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

const useStyles = makeStyles((theme) => ({
  sideNav: {
    top: 80,
    zIndex: 3,
    right: 20,
    position: 'fixed',
  },
  paper: {
    width: '30%',
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
    width: '30%'
  }
}})(Drawer)

export default function SliderDrawer() {
  const classes = useStyles();
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
  const theme = useTheme();
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
        <Link to='/about' classes={classes.link}>
          <List>
            <ListItem button key='About Us'>
              <ListItemIcon><AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary='About Us' />
            </ListItem>
          </List>
        </Link>
        <Link to='/contact' classes={classes.link}>
          <List>
            <ListItem button key='Contact Us'>
              <ListItemIcon><PermContactCalendarIcon />
              </ListItemIcon>
              <ListItemText primary='Contact Us' />
            </ListItem>
          </List>
        </Link>
      </TileDrawer>
    </div>
  );
}
