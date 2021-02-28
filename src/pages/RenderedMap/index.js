import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles({
  largeMap: {
    backgroundColor: '#372248',
    border: '1px black solid',
    width: '80%',
    height: 1000,
    borderRadius: '0.5em',
    backgroundImage: `url("http://paratime.ca/images/fantasy/dungeon-055.jpg")`,
    backgroundRepeat: 'no-repeat',
    // backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  },
})

export default function RenderedMap() {
  const classes = useStyles();

  return (
    <Container>
      <Typography variant='h2'>
        This where you can see a big map!
        <Container className={classes.largeMap}>

        </Container>
      </Typography>
    </Container>
  )
}
