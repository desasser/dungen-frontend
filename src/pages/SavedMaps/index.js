import React, { useState, useEffect } from 'react';
import SavedMapCard from '../../components/SavedMapCard';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import API from '../../utils/API';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  savedMapCard: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }
})

//NOTE FROM CALVIN added pass-down of "users" state to the function.
export default function SavedMaps(props) {
  const [userMaps, setUserMaps] = useState([])
  const [loadState, setLoadState] = useState(false)
  const classes = useStyles();

  useEffect(() => {
    loadUserMaps()
  }, [])

  const loadUserMaps = () => {
    //NOTE FROM CALVIN included props.users.id to the parameter
    API.getUserMaps(props.users.id)
      .then(res => {
        // console.log('response', res.data);
        setUserMaps(res.data);
        setLoadState(true)
        // check length of response and render No Maps! or All maps!
      }).catch(err => {
        console.log(err);
        // add a simple snackbar that says 'sorry, we failed you, try again!'
        // setErrorState(true);
      })
  }

  const deleteMap = (id) => {
    API.deleteMap(id)
      .then(res => loadUserMaps())
      .catch(err => console.log(err));
  }

  // const handleError = () => {
  //   return (<Container>
  //     <Typography variant='h4'>
  //       You have no saved maps right now, go create a map!
  //     </Typography>
  //   </Container>);
  // }

  return (
    <Container >
      {/* TODO: Welcome userName, your saved maps */}
      <Typography variant='h1'>Saved Maps</Typography>
      <Container className={classes.savedMapCard} maxWidth={false}>
        {/* Map over saved maps array return from the database and create these cards */}
        {/* Conditional render, if error, render error message */}
        {console.log('state', userMaps.data)}
        {userMaps ?
          userMaps.map(map => (
            // TODO: Check this on deploy
            <SavedMapCard key={map.id} id={map.id} name={map.name} image={map.image_url} deleteMap={deleteMap} />
          )) : (
            (!loadState ? (
              <CircularProgress />
            ) : (
                <Typography variant='h3'>
                  No maps!
                </Typography>))
          )}
      </Container>
    </Container>
  )
}
