import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
      marginTop: 10,
      marginBottom: 10,
    },
  },
  button: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[5],
    height: 56,
    width: 56,
    '&:hover': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
    },
  },
  input: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(3, 19, 30, 0.5)',
    borderRadius: '0.5em'
  }
}));

export default function SearchBar({keyword, onChange}) {
  const classes = useStyles();

  return (
    <form 
      className={classes.root} 
      noValidate 
      autoComplete="off" 
      // onSubmit={(event) => updateInput(event.target.value)} 
    >
      <TextField 
        id="filled-basic" 
        label="Search" 
        variant="filled" 
        onChange={(event) => onChange(event.target.value)} 
        value={keyword} 
        className={classes.input} 
      />
      <div>
        <Button
          // onClick={(event) => updateInput(event.target.value)}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          <SearchIcon fontSize="large" style={{ color: 'white' }} />
        </Button>
      </div>
    </form>
  );
}