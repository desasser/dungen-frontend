import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import snail from '../../images/DisapproverSnail.png';
import Slide from '@material-ui/core/Slide';
import { SettingsRemoteRounded } from '@material-ui/icons';
import React, { useEffect } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  errorMessage: {
    fontFamily: 'Immortal',
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



export default function Nope() {
  const classes = useStyles();

    return (
      <Container fixed>

        <Typography variant="h3" gutterBottom className={classes.errorMessage}>
        You Failed your Charisma Check (503 Not Authorized)
        </Typography>
        <Slide direction="left" in={true} className={classes.snailWrapper} mountOnEnter timeout={200}>
          <img
            src={snail}
            className={classes.imageStyle}
          />
        </Slide>
      </Container>
    )
}
