import React from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: '#2c3945',
    padding: 4,
    margin: 3,
    borderRadius: '0.25em',
    color: theme.palette.secondary.contrastText,
    fontFamily: 'Arial',
  }
}));

export default function Tab(props) {
  const classes = useStyles();

  return (
    <div handleClick={() => props.handleClick(props.value)} style={{cursor: 'pointer'}}>
      <Typography variant="body1" component='span' className={classes.button} style={{backgroundColor: '#3e4a59'}}>
        {props.children}
      </Typography>
    </div>
  )
}
