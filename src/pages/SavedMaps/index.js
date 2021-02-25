import React from 'react';
import SavedMapWrapper from '../../components/SavedMapWrapper';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

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
    <Container >
      <h1>This is where we view maps!</h1>
      <Container className={classes.savedMapWrapper} maxWidth={false}>
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
      </Container>
    </Container>
  )
}
