import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Redirect} from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    maxWidth: 300,
    margin: '20px',
    backgroundColor: '#8eb1c7',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'space-between'
  },
  media: {
    height: 300,
  },
  cardTitle: {
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '24px',
  },
  btnStyle: {
    '&:hover' :{
      backgroundColor: '#eb4511'
    },
    color: '#36434b',
    fontFamily: 'SpaceAndAstronomy'
  }
});

export default function SavedMapCard(props) {
  const classes = useStyles();



  return (
    <Card className={classes.root}>
      <CardActionArea href={`/builder/${props.id}`}>
        <CardMedia
          className={classes.media}
          image={props.image}
          alt="a tile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" className={classes.cardTitle}>
            {props.name.toUpperCase()}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            This is a space for a summary that the user can choose to write about their map if they want to.
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions style={{justifyContent:'center'}}>
        <Button size="small" color="primary"  href={`/builder/${props.id}`} className={classes.btnStyle}>
          Edit
        </Button>
        <Button size="small" color="primary" onClick={() => props.deleteMap(props.id)} className={classes.btnStyle}>
          Delete
        </Button>
        {/* <Button size="small" color="primary" href="/render" className={classes.btnStyle}>
          View
        </Button> */}
      </CardActions>
    </Card>
  );
}