import React from 'react';
import { Drawer, Divider, IconButton, Button } from '@material-ui/core';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import ReorderIcon from '@material-ui/icons/Reorder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  sideNav: {
    top: 20,
    zIndex: 3,
    left: 20,
    position: 'fixed',
  },
  paper: {
    width: '300px',
  },
  link: {
    color: 'black',
    textDecoration: 'none',
  }
});

const ButtonStyle = withStyles({
  root: {
    top: 20,
    zIndex: 3,
    left: 20,
    position: 'fixed',
    backgroundColor: '#bada55',
  }
})(IconButton)

export default function SliderDrawer() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    isDrawerOpened: false
  })

  const toggleDrawerStatus = () => {
    setState({
      isDrawerOpened: true,
    })
  }

  const closeDrawer = () => {
    setState({
      isDrawerOpened: false,
    })
  }

  const { isDrawerOpened } = state;
  return (
    <div>
      <div>
      {/* className={classes.sideNav} */}
        <ButtonStyle onClick={toggleDrawerStatus}>
          {!isDrawerOpened ? <ReorderIcon /> : null}
        </ButtonStyle>
      </div>
      <Divider />
      <Drawer
        anchor='right'
        variant="temporary"
        open={isDrawerOpened}
        onClose={closeDrawer}
        classes={{ paper: classes.paper }}
      >
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
      </Drawer>
    </div>
  );
}
