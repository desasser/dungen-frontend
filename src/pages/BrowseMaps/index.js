import React, { useState, useEffect } from 'react';
import SavedMapCard from '../../components/SavedMapCard';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Divider } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from '../../utils/API';

const useStyles = makeStyles((theme) => ({
  savedMapCard: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%'
  },
  savedTitle: {
    color: theme.palette.primary.main,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  browseWrapper: {
    display: 'flex',
    width: '90%',
    margin: '0 auto',
    flexWrap: 'wrap'
  }
}))

//NOTE FROM CALVIN added pass-down of "users" state to the function.
export default function BrowseMaps() {
  const [maps, setMaps] = useState([])
  const [loadState, setLoadState] = useState(false)
  const classes = useStyles();

  useEffect(() => {
    loadMaps()
  }, [])


  const loadMaps = () => {
    API.getAllMaps()
      .then(res => {
        setMaps(res.data);
        setLoadState(true);
      }).catch(err => {
        console.log(err);
      })
  }

  return (
    <Container classes={classes.browseWrapper}>
      <Typography variant='h4' style={{textAlign: 'center', marginTop: 20, fontSize: 50, fontWeight: 'bold'}}>
        Map Browser
      </Typography>
      <Divider/>
      <Container className={classes.savedMapCard} maxWidth={false}>
        {maps.length > 0 ?
          maps.map(map => (
            <SavedMapCard key={map.id} id={map.id} name={map.name} image={map.image_url} isOwner={false}/>
          )) : (
            (!loadState ? (
              <CircularProgress size='5em' color='primary' style={{ marginTop: '50px' }} />
            ) : (
              <Container style={{ textAlign: 'center' }}>
                <Divider variant="middle" />
                <Typography variant='h4'>
                  No maps exist!?
                </Typography>
              </Container>
            ))
          )}
      </Container>
    </Container>
  )
}