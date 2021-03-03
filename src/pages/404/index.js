import React from 'react'
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import snail from '../../images/DisapproverSnail.png';
import Slide from '@material-ui/core/Slide';

const useStyles = makeStyles({
  errorMessage: {
    fontFamily: 'SpaceAndAstronomy',
    marginTop: 40
  },
  imageStyle: {
    padding: 40,
    borderRadius: '0.25em',

  },
  snailWrapper: {
    overflow: 'hidden',
    width: '80%',
    height: 'auto'
  }
})

export default function FourOhNope() {
  const classes = useStyles();


  return (
      <Container fixed>
        <Typography variant="h3" gutterBottom className={classes.errorMessage}>
          You Failed your Investigation Check (404 Not Found)
        </Typography>
        <Slide direction="left" in={true} className={classes.snailWrapper} mountOnEnter timeout={800}>
          <img
            src={snail}
            className={classes.imageStyle}
          />
        </Slide>
      </Container>
  )
}
