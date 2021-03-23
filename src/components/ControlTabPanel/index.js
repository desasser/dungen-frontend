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
    borderRadius: '0.25em'
  }
}));

export default function ControlTabPanel() {
  const classes = useStyles();
  const [viewState, setViewState] = useState('tiles')

  const handleClick = (value) => {
    setViewState(value)
  }

  return (
    <div className={classes.panel}>
      <div onClick={() => handleClick('settings')}>
        <Tab>
          Settings
      </Tab>
      </div>
      <div onClick={() => handleClick('encounters')}>
        <Tab>
          Encounters
      </Tab>
      </div>
      <div onClick={() => handleClick('tiles')}>
        <Tab>
          Tiles
      </Tab>
      </div>
    </div>
  )
}
