import React, { useState } from 'react';
import SliderDrawer from '../../components/SliderDrawer'
import Tile from '../../components/Tile'
import IconBtn from '../../components/IconBtn'
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Grid from '../../components/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  tileGrid: {
    display: 'flex',
    backgroundColor: '#372248',
    flexWrap: 'wrap',
    width: 300,
    marginLeft: 500,
  },
  iconBtn: {
    width: 100,
    height: 50,
    color: '#E4572E',
  },
  actionBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#E52977',
    color: '#ABC686'
  },
  routerBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#ABC686',
    color: '#E52977'
  }
})

//black and pink #232E21 #F42272


export default function MapBuilder() {
  const [lockState, setLockState] = useState(false);
  const [newTileId, setNewTileId] = useState();

  const classes = useStyles();

  const handleLock = () => {
    if (lockState) {
      setLockState(false);
    } else {
      setLockState(true);
    }
  }

  const handleDraggableItem = (e) => {
    setNewTileId(e.target.dataset.tileid);
  }

  return (
<<<<<<< HEAD
    <Container>
      <Typography variant='h2'>This is where we build maps!</Typography>
      <SliderDrawer />
      <Container className="grid-base" style={{border:'black 1px solid', height:'1000px', width:'1000px', marginLeft:'25px', marginTop:'25px'}}></Container>
=======
    <div>
      <h1>This is where we build maps!</h1>
      <SliderDrawer handleDraggableItem={handleDraggableItem} />
      {/* GRID BOX */}
      <div className="grid-base" style={{border:'black 1px solid', height:'1000px', width:'1000px', marginLeft:'25px', marginTop:'25px'}}>
        <Grid />
      </div>
>>>>>>> dev
      <IconBtn name='icon' classes={classes.iconBtn} onClick={handleLock}>
        {/* <LockOutlinedIcon /> */}
        {lockState ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
      </IconBtn>
      <ActionBtn name='action' classes={classes.actionBtn} />
      <RouterBtn name='router' classes={classes.routerBtn} />
      {/* Comment in the below section if we need a static display instead of drawer */}
      {/* Can also target this for the media query to flip based on screen size */}
<<<<<<< HEAD
      {/* <Container className={classes.tileGrid}>
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
      </Container> */}
      {/* <Grid /> */}
    </Container>
=======
      {/* <div className={classes.tileGrid}>
      <Grid /> */}
    </div>
>>>>>>> dev
  )
}

// import Grid from '../../components/Grid';
// import Drawer from '../../components/Drawer';
// import Button from '../../components/Button';
// {/* <StyledDrawer /> for side navigation */}
// {/* <Navbar /> */}
// <Grid />
// <Drawer show={tileDrawerState.drawerOpen} />
// {/* Tile Drawer Button */}
// <Button /> 
// {/* Reset Map Button */}
// <Button />
// {/* Lock Map Button */}
// <Button />
// {/* Render/Save/Export Button */}
// <Button />