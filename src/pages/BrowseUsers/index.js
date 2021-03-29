import React, { useState, useEffect } from 'react';
import UserCard from '../../components/UserCard';
import SearchBar from '../../components/SearchBar';
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

export default function BrowseUsers(props) {
  const [users, setUsers] = useState([])
  const [input, setInput] = useState(''); //this is search term
  const [filteredUsers, setFilteredUsers] = useState([]); //these get filtered for search
  const [loadState, setLoadState] = useState(false)
  const [followedUsers, setFollowedUsers] = useState([])
  const [follows, setFollows] = useState([]);
  const classes = useStyles();

  // useEffect(() => {
  //   loadUsers()

  // }, [])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    API.getAllUsers()
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data);
        setLoadState(true);
      }).catch(err => {
        console.log(err);
      })
  }

  const loadFollows = () => {
    console.log('userid', props.users.id);
    API.getFollows(props.users.id)
    .then(res => {
      console.log('user Follows', res.data.Follower);
      setUsers(res.data);
      // const currentUser = res.data.find(o => o.id === props.users.id);
      // console.log('currentUser', currentUser)
      // setFollows(currentUser.Follower)
    }).catch(err => {
      console.log(err);
    })
  }

  const updateInput = (input) => {
    const filtered = users.filter(user => {
      return user.userName.toLowerCase().includes(input.toLowerCase())
    });
    setFilteredUsers(filtered);
    setInput(input);
  }

  return (
    <Container >
      <Typography variant='h4' style={{ textAlign: 'center', marginTop: 20, fontSize: 50, fontWeight: 'bold' }}>
        User Browser
      </Typography>
      <Divider/>
      <SearchBar input={input} onChange={updateInput} />
      <Divider style={{marginBottom: 20}}/>
      <Grid container className={classes.root} spacing={2} >
        {filteredUsers.length > 0 ?
          filteredUsers.map(user => (
            <Grid item md={12}>
              <UserCard key={user.id} id={user.id} userName={user.userName} currentUser={props.users.id} token={props.users.token}/>
              {/* followUser={followUser} */}
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
