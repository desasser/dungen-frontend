import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import TileReservoir from "../../components/TileReservoir"
import ControlTabPanel from "../../components/ControlTabPanel"
import StartMap from "../../components/StartMap"
import MapControls from '../MapControls';

const useStyles = makeStyles((theme) => ({
  base: {
    backgroundColor: 'tomato',
    position: 'absolute',
    right: 0,
    top: 75,
    width: 350,
    height: 'calc(100vh - 75px)',
    overflowY: 'auto'
  },
}));

export default function SuperDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [viewState, setViewState] = useState('tiles')

  const handleClick = (value) => {
    setViewState(value)
  }

  const getCurrentControls = (viewState) => {

  }

  return (
    <>
      <ControlTabPanel handleClick={handleClick} />
      <div className={classes.base}>
        {
          (() => {
            if (viewState === 'tiles') {
              return <TileReservoir />
            } else if (viewState === 'settings') {
              return <StartMap />
            } else if (viewState === 'encounters') {
              return <MapControls />
            }
          })()
        }
      </div>
    </>
  );
}

