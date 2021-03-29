import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router-dom';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import IconButton from '@material-ui/core/IconButton';
import API from '../../utils/API';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 300,
    margin: '20px',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between',
    color: theme.palette.secondary.contrastText
  },
  media: {
    height: 300,
  },
  cardTitle: {
    textAlign: 'center',
    color: theme.palette.secondary.main,
  },
  btnStyle: {
    '&:hover': {
      backgroundColor: 'white',
      color: theme.palette.primary.main,
    },
    color: theme.palette.secondary.main,
  },
  iconColor: {
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  }
}));

export default function SavedMapCard(props) {
  const classes = useStyles();
  const [isFavorite, setFavorite] = useState({
    isFavorited: false
  })

  const handleFavorite = () => {
    setFavorite(prevState => !prevState);
    const userData = {
      favoriteId: props.id,
      userId: props.currentUser,
      token: props.token
    }
    console.log('userdata favorite', userData);
    API.favoriteMap(userData)
      .then(res => console.log('success!'))
      .catch(err => console.log(err));
  }

  const handleUnfavorite = () => {
    setFavorite(prevState => !prevState);
    const userData = {
      favoriteId: props.id,
      userId: props.currentUser,
      token: props.token
    }
    console.log('userdata unfavorite', userData);
    API.unfavoriteMap(userData)
      .then(res => console.log('success!'))
      .catch(err => console.log(err));
  }

  return (
    <Card className={`${classes.root} searchable`}>
      <CardActionArea href={props.isOwner ? `/builder/${props.id}` : `/render/${props.id}`}>
        <CardMedia
          className={classes.media}
          image={props.image}
          alt="a saved map"
        />
        <CardContent >
          <Typography gutterBottom variant="h5" className={classes.cardTitle}>
            {props.name}
          </Typography>
          <Typography variant="body2" component="p">
            This is a space for a summary that the user can choose to write about their map if they want to.
          </Typography>
        </CardContent>
      </CardActionArea>

      {props.isOwner ? (
        <CardActions style={{ justifyContent: 'center' }}>
          <Button size="small" href={`/builder/${props.id}`} className={classes.btnStyle}>
            Edit
          </Button>
          <Button size="small" onClick={() => props.deleteMap(props.id)} className={classes.btnStyle}>
            Delete
          </Button>
          {/* <Button size="small" href="/render" className={classes.btnStyle}>
          View
        </Button> */}
        </CardActions>
      ) : (
        <CardActions style={{ justifyContent: 'flex-end' }}>
          {isFavorite ?
            (
            <IconButton aria-label="favorite" onClick={handleFavorite} className={classes.iconColor}>
              <StarBorderIcon />
            </IconButton>
            ) : (
            <IconButton aria-label="unfavorite" onClick={handleUnfavorite} className={classes.iconColor}>
              <StarIcon />
            </IconButton>
            )
          }
        </CardActions>
      )}

    </Card>
  );
}