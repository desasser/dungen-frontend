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

export default function SearchBar() {
  const [searchState, setSearchState] = useState({
    query: ''
  });
  const classes = useStyles();

  const handleChange = (event) => {
    setSearchState({
      query: event.target.value
    })
  }

  const handleSubmit = (event) => {
    console.log('you searched for ', searchState.query);
    setSearchState({
      query: ''
    })
    event.preventDefault();
  }

  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit} >
      <TextField id="filled-basic" label="Search" variant="filled" onChange={handleChange} value={searchState.query} className={classes.input} />
      <div>
        <Button
          onClick={(e) => handleSubmit(e)}
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