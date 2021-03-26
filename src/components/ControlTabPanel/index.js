import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import React, { useState } from 'react';
import Tab from "../../components/Tab";

const useStyles = makeStyles((theme) => ({
  panel: {
    display: 'flex',
    transform: 'rotate(270deg)',
    transformOrigin: '0 0',
    backgroundColor: 'tomato',
    position: 'absolute',
    top: 300,
    right: 155,
    padding: '5px 2px',
    borderRadius: '0.25em',
    zIndex: 1000
  }
}));

export default function ControlTabPanel(props) {
  const classes = useStyles();

  return (
    <div className={classes.panel}>
      <div onClick={() => props.handleClick('settings')}>
        <Tab>
          Settings
      </Tab>
      </div>
      <div onClick={() => props.handleClick('encounters')}>
        <Tab>
          Encounters
      </Tab>
      </div>
      <div onClick={() => props.handleClick('tiles')}>
        <Tab>
          Tiles
      </Tab>
      </div>
    </div>
  )
}
