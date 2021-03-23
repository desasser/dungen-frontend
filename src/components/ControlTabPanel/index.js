import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import React from 'react';
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

  return (
    <div className={classes.panel}>
      <Tab>
        Settings
      </Tab>
      <Tab>
        Encounters
      </Tab>
      <Tab>
        Tiles
      </Tab>
    </div>
  )
}
