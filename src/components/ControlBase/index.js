import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import TileReservoir from "../../components/TileReservoir"

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

export default function ControlBase() {
  const classes = useStyles();

  return (
    <div className={classes.base}>
      <TileReservoir/>
    </div>
  )
}
