import React, { useState, useEffect } from 'react';
import SavedMapCard from '../../components/SavedMapCard';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import API from '../../utils/API';

const useStyles = makeStyles({
  savedMapCard: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
  }
})

export default function SavedMaps() {
  const [userMaps, setUserMaps] = useState([])
  const classes = useStyles();

  useEffect(() => {
    loadUserMaps()
  }, [])

  const loadUserMaps = () => {
    API.getMaps()
    .then(res => {
      console.log('response', res.data);
      setUserMaps(res)
    }).catch(err=> {
        console.log(err);
        // res.status(500)
      })
  }
  
  return (
    <Container >
      <Typography variant='h1'>This is where we view maps!</Typography>
      <Container className={classes.savedMapCard} maxWidth={false}>
        {/* Map over saved maps array return from the database and create these cards */}
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
        <SavedMapCard />
      </Container>
    </Container>
  )
}
