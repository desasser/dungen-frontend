import React, { useState } from 'react';
import SliderDrawer from '../../components/SliderDrawer'
import IconBtn from '../../components/IconBtn'
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles } from '@material-ui/core/styles';
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
  // for adding a new tile to the map grid
  const [addThisTile, setAddThisTile] = useState({
    tileid: null,
    environment: "",
    bg: ""
  });

  const classes = useStyles();

  const handleLock = () => {
    if (lockState) {
      setLockState(false);
    } else {
      setLockState(true);
    }
  }

  const handleDraggableItem = (e) => {
    // console.log(e.target.dataset.tileid);
    setAddThisTile({
      ...addThisTile,
      tileid: e.target.dataset.tileid,
      environment: e.target.dataset.environment,
      bg: e.target.dataset.image
    });
  }

  return (
    <Container>
      <Container>
        <Typography variant='h2'>This is where we build maps!</Typography>
        {/* The "handleDraggableItem" prop here is to get the data for the AddThisTile const */}
        <SliderDrawer handleDraggableItem={handleDraggableItem} />
        {/* GRID BOX */}
        <Container className="grid-base" style={{ border: 'black 1px solid', height: '1000px', width: '1000px', marginLeft: '0px', marginTop: '25px', padding: '0px' }}>
          <Grid addThisTile={addThisTile} />
        </Container>
        <IconBtn name='icon' classes={classes.iconBtn} onClick={handleLock}>
          {lockState ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
        </IconBtn>
        <ActionBtn name='SAVE' classes={classes.actionBtn} />
        <RouterBtn name='VIEW' classes={classes.routerBtn} />
      </Container>
    </Container>
  )
}
