import React from 'react'
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import RouterBtn from '../../components/RouterBtn'
import Typography from '@material-ui/core/Typography';
import dragon from '../../images/968914319.jpg';
import temple from '../../images/fantasy-wallpaper-psdvault-18.jpg';
import { motion } from "framer-motion";
import Hidden from '@material-ui/core/Hidden';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  containerBanner: {
    backgroundImage: `url(${dragon})`,
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
    fontWeight: 'bold'
  },
  synopsis: {
    color: theme.palette.secondary.contrastText,
    fontSize: '3.5em',
    marginRight: 0
  },
  synHeaderSmall: {
    paddingBottom: '0.5em',
    fontFamily: 'SpaceAndAstronomy',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  synopsisSmall: {
    width: '100%',
    marginLeft: '1em',
    marginTop: '3em',
    border: '0.5em #8eb1c7 solid',
    borderRadius: '0.5em',
    padding: '2em',
    backgroundColor: 'white',
    display: 'block'
  },
  buildButtonSmall: {
    backgroundColor: '#eb4511',
    height: '5em',
    padding: '1em',
    fontSize: '1.5em',
    margin: '20px',
    fontFamily: 'SpaceAndAstronomy',
    marginLeft: '20%',
    fontWeight: 'bold'
  },
  splashContentSmall: {
    width: '90%',
    marginLeft: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  splashTextOne: {
    fontWeight: 'bold',
    fontSize: '80px',
    fontFamily: 'ESKARGOT',
    cursor: 'grab'
  },
  splashTextTwo: {
    fontWeight: 'bold',
    fontSize: '60px',
    fontFamily: 'ESKARGOT',
    cursor: 'grab'
  },
  splashTextOneMobile: {
    fontWeight: 'bold',
    fontSize: '60px',
    fontFamily: 'ESKARGOT',
    cursor: 'grab'
  },
  splashTextTwoMobile: {
    fontWeight: 'bold',
    fontSize: '40px',
    fontFamily: 'ESKARGOT',
    cursor: 'grab',
    position: 'relative',
    top: '-90px',
    left: '70px'
  }
}));


export default function Splash() {
  const classes = useStyles();


  return (
    <div>
      <Grid item xs={12} >
        <Container className={classes.containerBanner} style={{ height: 'calc(100vh-75px)' }}>
          {/* HIDE THESE ELEMENTS WHEN SCREEN IS SM OR LARGER */}
          <Hidden smUp>
            <Container className={classes.splashContentSmall}>
              <Container className={classes.synopsisSmall}>
                <Typography variant='h5' className={classes.synHeaderSmall}>
                  Dungen Building should be easy.
                </Typography>
                <Typography variant="body2" >
                  A no nonsense approach to making dungeons because the hardest part of the game should be keeeping eveyone alive. Create an account and save your maps for later or just start building a map!
                </Typography>
              </Container>
              <RouterBtn to="/builder" name="Build Maps Now!" classes={classes.buildButtonSmall} disableRippe={true} variant="contained" />
            </Container>
          </Hidden>
          {/* HIDE THESE ELEMENTS WHEN SCREEN IS SM OR LARGER */}

          {/* HIDE THESE ELEMENTS WHEN SCREEN SIZE IS XS */}
          <Hidden xsDown>
            <Box style={{width: '30%'}}>
              <Typography variant='h4' className={classes.synopsis}>
                Dungen Building should be easy.
              </Typography>
              <RouterBtn to="/builder" name="Build" classes={classes.buildButton} disableRippe={true} variant="contained" />
            </Box>
          </Hidden>
          {/* HIDE THESE ELEMENTS WHEN SCREEN SIZE IS XS */}
          {/* Full Screen */}
          {/* <Hidden xsDown>
            <motion.div className={classes.splashTextOne}
              drag
              dragConstraints={{
                top: -140,
                left: -225,
                right: 1150,
                bottom: 175,
              }}
              style={{
                color: '#eb4511',
                height: 100
              }}>
              Dun
          </motion.div>
            <motion.div className={classes.splashTextOne}
              drag
              dragConstraints={{
                top: -140,
                left: -325,
                right: 1050,
                bottom: 175,
              }}
              style={{
                color: '#eb4511',
                height: 100
              }}>
              Gen
          </motion.div>
            <motion.div className={classes.splashTextTwo}
              drag
              dragConstraints={{
                top: -140,
                left: -425,
                right: 950,
                bottom: 175,
              }}
              style={{
                height: 80
              }}>
              Snail
          </motion.div>
            <motion.div className={classes.splashTextTwo}
              drag
              dragConstraints={{
                top: -140,
                left: -525,
                right: 850,
                bottom: 175,
              }}
              style={{
                height: 80
              }}>
              Butts
          </motion.div>
          </Hidden> */}

          {/* Mobile Physics Playground */}
          {/* <Hidden smUp>
            <motion.div className={classes.splashTextOneMobile}
              drag
              dragConstraints={{
                top: -60,
                left: -80,
                right: 60,
                bottom: 60,
              }}
              style={{
                color: '#eb4511',
                height: 80
              }}>
              Dun
          </motion.div>
            <motion.div className={classes.splashTextOneMobile}
              drag
              dragConstraints={{
                top: -60,
                left: -80,
                right: 50,
                bottom: 60,
              }}
              style={{
                color: '#eb4511',
                height: 80
              }}>
              Gen
          </motion.div>
            <motion.div className={classes.splashTextTwoMobile}
              drag
              dragConstraints={{
                top: -60,
                left: -80,
                right: 50,
                bottom: 60,
              }}
              style={{
                height: 60
              }}>
              Snail
          </motion.div>
            <motion.div className={classes.splashTextTwoMobile}
              drag
              dragConstraints={{
                top: -60,
                left: -80,
                right: 40,
                bottom: 60,
              }}
              style={{
                height: 60
              }}>
                Butts
            </motion.div>
          </Hidden>*/}
        </Container >
      </Grid>
    </div>
  )
}
