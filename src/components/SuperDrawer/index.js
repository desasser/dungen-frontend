import React, { useEffect, useState } from 'react';
import { Drawer, Divider, IconButton } from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Container from '@material-ui/core/Container';
import VerticalTabs from '../VerticalTabs';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  sideNav: {
    top: 80,
    right: 40,
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
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    position: 'fixed'
  },
  drawerCloseBtn: {
    color: 'white',
    '&:hover': {
      backgroundColor: '#eb4511',
      color: 'white'
    }
  },
  tileOpenBtn: {
    backgroundColor: 'rgba(255,255,255, 0.5)',
    '&:hover': {
      backgroundColor: '#eb4511',
      color: 'white'
    },
  },
  drawerTab: {
    transform: 'rotate(270deg)',
    marginRight: 300
  }
}));


const StyledDrawer = withStyles({
  root: {
    "& .MuiDrawer-paper": {
      backgroundColor: 'pink',
      width: 300,
      marginTop: 75,
      border: '1px #707078 solid'
    }
  },
})(Drawer)

export default function SuperDrawer() {
  const classes = useStyles();
  const [openState, setOpenState] = useState({
    isDrawerOpened: true
  })

  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpenState({
      isDrawerOpened: true,
    })
  }

  const handleDrawerClose = () => {
    setOpenState({
      isDrawerOpened: false,
    })
  }

  const { isDrawerOpened } = openState;


  return (
    <>
      <Container maxWidth={false} className={classes.sideNav}>
        <IconButton onClick={handleDrawerOpen} className={classes.tileOpenBtn}>
          {!isDrawerOpened ? <ReorderIcon /> : null}
        </IconButton>
      </Container>

      <Divider />

      <StyledDrawer
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

        <Typography className={classes.drawerTab}>Tiles</Typography>
        <Typography className={classes.drawerTab}>Controls</Typography>
        <Typography className={classes.drawerTab}>Settings</Typography>


      </StyledDrawer>
    </>
  );
}
