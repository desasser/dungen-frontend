import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SavedMapThumbnail from '../SavedMapThumbnail';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';


const useStyles = makeStyles({
  savedWrapper: {
    width: 400,
    height: 150,
    borderRadius: '0.5em',
    backgroundColor: '#3777FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  root: {
    minWidth: 275,
  },
  summaryWrapper: {
    width: '20%',
    textAlign: 'right'
  },
  cardStyle: {
    padding: 0,
    margin: 20,
  }
})

export default function SavedMapCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root} elevation={0}>
      <CardContent class={classes.cardStyle}>
        <Container className={classes.savedWrapper} maxWidth={false}>
          <SavedMapThumbnail></SavedMapThumbnail>
          <Container maxWidth={false} className={classes.summaryWrapper}>
            <Typography variant="h6" style={{ display: 'block', flex: 0 }}>
              Name
            </Typography>
            <Typography variant="body2" style={{ display: 'block', flex: 0 }}>
              Summary
            </Typography>
            <Typography variant="body2" style={{ display: 'block', flex: 0 }}>
              Environment
            </Typography>
            <Typography variant="body2" style={{ display: 'block', flex: 0 }}>
              Theme
            </Typography>
          </Container>
        </Container>
      </CardContent>
    </Card>
  )
}