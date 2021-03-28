import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import snail from '../../images/DisapproverSnail.png';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import API from '../../utils/API';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: '80%',
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  textColor: {
    color: theme.palette.secondary.contrastText
  },
  textColorTitle: {
    color: theme.palette.primary.contrastText
  }
}));

export default function UserCard(props) {
  const classes = useStyles();
  const [followed, setFollowed] = useState(false);

  const followUser = () => {
    setFollowed(prevState => !prevState);
    const userData = {
      followerId: props.currentUser,
      userId: props.id,
      token: props.token
    }
    API.followUser(userData)
      .then(res => console.log('success!'))
      .catch(err => console.log(err));
  }

  const unFollowUser = () => {
    setFollowed(prevState => !prevState);
    const unfollowData = {
      followerId: props.currentUser,
      userId: props.id,
      token: props.token
    }
    API.unfollowUser(unfollowData)
      .then(res => console.log('success!'))
      .catch(err => console.log(err));
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="You are not approved!" src={snail} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="h6" className={classes.textColorTitle}>
                  {props.userName}
                </Typography>
                <Typography variant="body1" gutterBottom className={classes.textColor}>
                  Stats
                </Typography>
              </Grid>
              <Grid item>
              {!followed ? 
                (
                <Typography variant="body2" style={{ cursor: 'pointer' }} onClick={followUser} className={classes.textColor} >
                  Follow
                </Typography>
                ) : (
                <Typography variant="body2" style={{ cursor: 'pointer' }} onClick={unFollowUser} className={classes.textColor} >
                  Unfollow
                </Typography>
                )
                }
              </Grid>
            </Grid>
            <Grid item>
              {!followed ? <FavoriteBorderIcon className={classes.textColor}/> : <FavoriteIcon className={classes.textColor}/>}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}