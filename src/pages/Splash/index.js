import React from 'react'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import RouterBtn from '../../components/RouterBtn'
import Typography from '@material-ui/core/Typography';
import dragon from '../../images/968914319.jpg';
import dragonMini from '../../images/dragonMini.jpg';
import temple from '../../images/fantasy-wallpaper-psdvault-18.jpg';
import { motion } from "framer-motion";
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  containerBanner: {
    backgroundImage: ({isMobile}) => !isMobile ? `url(${dragon})` : `url(${dragonMini})`,
    backgroundSize: 'cover',
    maxWidth: "100%",
    height: 'calc(100vh - 75px)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  buildButton: {
    backgroundColor: theme.palette.secondary.main,
    padding: '0.5em 1.5em',
    marginBottom: '50px',
    marginTop: '30px',
    fontFamily: 'Immortal',
    fontSize: '2.5em',
    fontWeight: 'bold',
    boxShadow: theme.shadows[5],
  },
  synopsis: {
    color: theme.palette.secondary.contrastText,
    marginRight: 0
  },
  synopsisMobile: {
    color: theme.palette.secondary.contrastText,
  },
  buildButtonSmall: {
    backgroundColor: theme.palette.secondary.main,
    padding: '0.5em 1.5em',
    marginBottom: '50px',
    marginTop: '30px',
    fontFamily: 'Immortal',
    fontSize: '2.5em',
    fontWeight: 'bold'
  },
  splashContentMobile: {
    width: '90%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    boxShadow: '15px 15px 15px 15px rgba(0,0,0,.3)',
    borderRadius: '1em'
  },
}));


export default function Splash() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  console.log('mobile?', isMobile);

  const classes = useStyles({isMobile: isMobile});

  return (
    <div>
      <Grid item xs={12} >
        <Container className={classes.containerBanner} style={{ height: 'calc(100vh-75px)' }}>
          {/* HIDE THESE ELEMENTS WHEN SCREEN IS SM OR LARGER */}
          <Hidden smUp>
            <Container className={classes.splashContentMobile}>
              <Typography variant='h4' className={classes.synopsisMobile}>
                Dungen Building should be easy.
                </Typography>
              <RouterBtn to="/builder" name="Build" classes={classes.buildButtonSmall} disableRippe={true} variant="contained" />
            </Container>
          </Hidden>
          {/* HIDE THESE ELEMENTS WHEN SCREEN IS SM OR LARGER */}

          {/* HIDE THESE ELEMENTS WHEN SCREEN SIZE IS XS */}
          <Hidden xsDown>
            <Box style={{ width: '30%' }}>
              <Typography variant='h4' className={classes.synopsis} style={{width: '80%'}}>
                Dungen Building should be easy.
              </Typography>
              <RouterBtn to="/builder" name="Build" classes={classes.buildButton} disableRippe={true} variant="contained" />
            </Box>
          </Hidden>
          {/* HIDE THESE ELEMENTS WHEN SCREEN SIZE IS XS */}
        </Container >
      </Grid>
    </div>
  )
}
