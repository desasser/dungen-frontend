import React, { useState, useEffect } from 'react';
import SavedMapCard from '../../components/SavedMapCard';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import API from '../../utils/API';
import CircularProgress from '@material-ui/core/CircularProgress';
import RouterBtn from '../../components/RouterBtn';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles({
  savedMapCard: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%'
  },
  savedTitle: {
    fontFamily: 'SpaceAndAstronomy',
    // fontWeight: 'bold',
    fontSize: '60px',
    marginTop: 20,
    marginBottom: 20,
  },
  savedError: {
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '40px',
    marginTop: 20,
    marginBottom: 20,
    width: '40%',
    margin: '0 auto'
  },
  buildButton: {
    backgroundColor: '#eb4511',
    height: '5em',
    padding: '1em',
    fontSize: '1.5em',
    margin: '20px',
    fontFamily: 'SpaceAndAstronomy',
    fontWeight: 'bold'
  }
})

//NOTE FROM CALVIN added pass-down of "users" state to the function.
export default function SavedMaps(props) {
  const [userMaps, setUserMaps] = useState([])
  const [loadState, setLoadState] = useState(false)
  const classes = useStyles();

  useEffect(() => {
    if (props) {
      loadUserMaps()
    }

  }, [props])


  const loadUserMaps = () => {
    API.getUserMaps(props.users.id)
      .then(res => {
        setUserMaps(res.data);
        setLoadState(true);
      }).catch(err => {
        console.log(err);
      })
  }

  const deleteMap = (id) => {
    API.deleteMap(id)
      .then(res => loadUserMaps())
      .catch(err => console.log(err));
  }

  return (
    <Container >
      <Typography variant='h1' className={classes.savedTitle}>Your Map Case</Typography>
      <Divider variant="middle" />
      <Container className={classes.savedMapCard} maxWidth={false}>
        {userMaps.length > 0 ?
          userMaps.map(map => (
            <SavedMapCard key={map.id} id={map.id} name={map.name} image={map.image_url} deleteMap={deleteMap} />
          )) : (
            (!loadState ? (
              <CircularProgress />
            ) : (
                <Container>
                  <Divider variant="middle" />
                  <Typography variant='h3' className={classes.savedError}>
                    You haven't stored any maps in your map case.
                </Typography>
                  <RouterBtn to="/builder" name="Build Maps Now!" classes={classes.buildButton} disableRippe={true} variant="contained" />
                </Container>
              ))
          )}
      </Container>
    </Container>
  )
}
