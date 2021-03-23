import React from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: 'pink',
    padding: 4,
    margin: 3,
    borderRadius: '0.25em'
  }
}));

export default function Tab(props) {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="body1" component='span' className={classes.button}>
        {props.children}
      </Typography>
    </div>
  )
}
