import React from 'react';
import SavedMapWrapper from '../../components/SavedMapWrapper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  savedMapWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
})

export default function SavedMaps() {
  const classes = useStyles();

  return (
    <div>
      <h1>This is where we view maps!</h1>
      <div className={classes.savedMapWrapper} >
        {/* Map over saved maps array return from the database and create these cards */}
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
        <SavedMapWrapper />
      </div>
    </div>
  )
}
