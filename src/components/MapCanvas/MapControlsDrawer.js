import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Drawer, Divider, IconButton, Switch, Grid } from '@material-ui/core';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import {Reorder as ReorderIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@material-ui/icons';

import ActionBtn from '../ActionBtn'

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
    maxWidth: '200px',
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
  }
}));

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    color: "white"
  },
  switchBase: {
    padding: 2,
    color: 'gainsboro',
    '&$checked': {
      transform: 'translateX(12px)',
      color: 'white',
      '& + $track': {
        opacity: 1,
        backgroundColor: 'purple',
        borderColor: 'purple',
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid gainsboro`,
    borderRadius: 'px',
    opacity: 1,
    backgroundColor: 'white',
  },
  checked: {},
}))(Switch);


const TileDrawer = withStyles({
  root: {
    "& .MuiDrawer-paper": {
      backgroundColor: '#36434b',
      width: 200,
      marginTop: 64,
      overflowX: 'hidden',
      border: '1px #707078 solid'
    }
  }
})(Drawer)

export default function SliderDrawer({ controlsData }) {
  const classes = useStyles();
  const [state, setState] = useState({
    isDrawerOpened: true
  })

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

  return (
    <Box>
      <Container maxWidth={false} className={classes.sideNav}>
        <IconButton onClick={handleDrawerOpen} className={classes.drawerOpenBtn}>
          {!isDrawerOpened ? <ChevronRightIcon fontSize="large" /> : null}
        </IconButton>
      </Container>

      <Divider />

      <TileDrawer
        anchor='left'
        variant='persistent'
        open={isDrawerOpened}
        onClose={handleDrawerClose}
      >
        <Container className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose} className={classes.drawerCloseBtn}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Container>

        <Container className={classes.tileGrid}>
          <Typography variant='h5' className={classes.tileHeader}>
            Map Controls
          </Typography>
        </Container>

        <Container className={classes.controlsContainer}>
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item style={{color: "white", fontFamily: "sans-serif"}}>Move Tiles</Grid>
            <Grid item>
              <AntSwitch {...controlsData.toggleTileLock.props} />
            </Grid>
            <Grid item style={{color: "white", fontFamily: "sans-serif"}}>Move Grid</Grid>
          </Grid>
          {/* {controlsData.toggleTileLock.args.visible ?
            
            :
            ''
          } */}
          <ActionBtn classes={controlsData.centerGrid.args.gridCentered ? classes.centerGrid : `${classes.centerGrid} ${classes.recenter}`} {...controlsData.centerGrid.props}>
            {controlsData.centerGrid.text}
          </ActionBtn>
        </Container>

      </TileDrawer>
    </Box>
  );
}
