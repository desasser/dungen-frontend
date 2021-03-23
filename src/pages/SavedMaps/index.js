import React, { useState, useEffect } from 'react';
import SavedMapCard from '../../components/SavedMapCard';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import API from '../../utils/API';
import CircularProgress from '@material-ui/core/CircularProgress';
import RouterBtn from '../../components/RouterBtn';
import Divider from '@material-ui/core/Divider';
import SuperDrawer from '../../components/SuperDrawer';


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
  savedError: {
    fontSize: '40px',
    marginTop: 40,
    marginBottom: 20,
  },
  buildButton: {
    '&:hover': {
      backgroundColor: 'white',
      color: theme.palette.primary.main,
    },
    backgroundColor: theme.palette.primary.main,
    padding: '0.5em 1.5em',
    marginBottom: '50px',
    marginTop: '30px',
    fontFamily: 'Immortal',
    fontSize: '2em',
    fontWeight: 'bold',
    color: theme.palette.primary.contrastText
  },
}))

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
    API.deleteMap(id, props.users.token)
      .then(res => loadUserMaps())
      .catch(err => console.log(err));
  }

  return (
    <Container >
      <SuperDrawer></SuperDrawer>
      <Typography variant='h2' className={classes.savedTitle}>Your Map Case</Typography>
      <Divider variant="middle" />
      <Container className={classes.savedMapCard} maxWidth={false}>
        {userMaps.length > 0 ?
          userMaps.map(map => (
            <SavedMapCard key={map.id} id={map.id} name={map.name} image={map.image_url} deleteMap={deleteMap} isOwner={true}/>
          )) : (
            (!loadState ? (
              <CircularProgress size='5em' color='primary' style={{ marginTop: '50px' }} />
            ) : (
              <Container style={{textAlign: 'center'}}>
                <Divider variant="middle" />
                <Typography variant='h4' className={classes.savedError}>
                  You haven't stored any maps in your map case.
                </Typography>
                <RouterBtn to="/builder" name="Build a map" classes={classes.buildButton} variant="contained" />
              </Container>
            ))
          )}
      </Container>
    </Container>
  )
}
