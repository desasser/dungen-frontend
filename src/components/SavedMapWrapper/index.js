import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SavedMapThumbnail from '../SavedMapThumbnail';
import SavedMapSummary from '../SavedMapSummary';


const useStyles = makeStyles({
  savedWrapper: {
    width: 400,
    height: 150,
    borderRadius: '0.5em',
    backgroundColor: '#3777FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 25,
  }
})

export default function SavedMapWrapper() {
  const classes = useStyles();

  return (
    <div className={classes.savedWrapper}>
      <SavedMapThumbnail />
      <SavedMapSummary />
    </div>
  )
}
