import React, { useState, useEffect } from 'react';
import UserCard from '../../components/UserCard';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Divider, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import API from '../../utils/API';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
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

export default function BrowseUsers() {
  const [users, setUsers] = useState([])
  const [loadState, setLoadState] = useState(false)
  const classes = useStyles();

  useEffect(() => {
    loadUsers()
  }, [])


  const loadUsers = () => {
    API.getAllUsers()
      .then(res => {
        setUsers(res.data);
        console.log('user data', res.data)
        setLoadState(true);
      }).catch(err => {
        console.log(err);
      })
  }

  return (
    <Container >
      <Typography variant='h4' style={{ textAlign: 'center', marginTop: 20, fontSize: 50, fontWeight: 'bold' }}>
        User Browser
      </Typography>
      <Divider style={{marginBottom: 20}}/>
      <Grid container className={classes.root} spacing={2} >
        {users.length > 0 ?
          users.map(user => (
            <Grid item md={12}>
              <UserCard key={user.id} userName={user.userName} />
            </Grid>
          )) : (
            (!loadState ? (
              <CircularProgress size='5em' color='primary' style={{ marginTop: '50px' }} />
            ) : (
              <Container style={{ textAlign: 'center' }}>
                <Divider variant="middle" />
                <Typography variant='h4'>
                  No users exist!?
                </Typography>
              </Container>
            ))
          )}
      </Grid>
    </Container>
  )
}
