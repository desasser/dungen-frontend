import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import RouterBtn from '../../components/RouterBtn'
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import dragon from '../../images/968914319.jpg';
import temple from '../../images/fantasy-wallpaper-psdvault-18.jpg';
import { motion } from "framer-motion";
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  containerBanner: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: '40vh',
    background: 'gray',
    display: "flex",
    margin: "0 auto",
    padding: "10% 18%",
    // backgroundColor: 'pink',
    // backgroundImage: 'url("../images/fantasy-wallpaper-psdvault-18.jpg")'
    backgroundImage: `url(${dragon})`,
    // backgroundImage: `url(${temple})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    // backgroundPosition: '0px -50px',
    maxWidth: "none",
    height: '50vh'
  },
  synopsis: {
    width: '50%',
    marginLeft: '1em',
    marginTop: '3em',
    border: '0.5em #8eb1c7 solid',
    borderRadius: '0.5em',
    padding: '2em',
    backgroundColor: 'white'
  },
  synHeader: {
    paddingBottom: '0.5em',
    fontFamily: 'SpaceAndAstronomy',
    fontWeight: 'bold'
  },
  buildButton: {
    backgroundColor: '#eb4511',
    height: '5em',
    padding: '1em',
    fontSize: '1.5em',
    margin: '20px',
    fontFamily: 'SpaceAndAstronomy',
    fontWeight: 'bold'
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
  splashContent: {
    width: '80%',
    margin: '0 auto',
    display: 'flex',
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
  }
}));


export default function Splash() {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <Grid item xs={12} >
        <Container className={classes.containerBanner} >
        <Hidden smDown>

          <motion.div className={classes.splashTextOne}
            drag
            dragConstraints={{
              top: -140,
              left: -225,
              right: 1150,
              bottom: 175,
            }}
            style={{
              color: '#eb4511'
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
              color: '#eb4511'
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
            }}>
            Butts
          </motion.div>
              </Hidden>
{/* Mobile Physics Playground */}

              <Hidden smUp>
            <motion.div className={classes.splashTextOne}
              drag
              dragConstraints={{
                top: -60,
                left: -80,
                right: 60,
                bottom: 60,
              }}
              style={{
                color: '#eb4511'
              }}>
              Dun
          </motion.div>
            <motion.div className={classes.splashTextOne}
              drag
              dragConstraints={{
                top: -60,
                left: -90,
                right: 50,
                bottom: 60,
              }}
              style={{
                color: '#eb4511'
              }}>
              Gen
          </motion.div>
            <motion.div className={classes.splashTextTwo}
              drag
              dragConstraints={{
                top: -60,
                left: -80,
                right: 50,
                bottom: 60,
              }}>
              Snail
          </motion.div>
            <motion.div className={classes.splashTextTwo}
              drag
              dragConstraints={{
                top: -60,
                left: -90,
                right: 40,
                bottom: 60,
              }}>
              </motion.div>
              </Hidden>
        </Container >

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
          <Container className={classes.splashContent}>
            <Container className={classes.synopsis}>
              <Typography variant='h5' className={classes.synHeader}>
                Dungen Building should be easy.
                    </Typography>
              <Typography variant="body2" >
                A no nonsense approach to making dungeons because the hardest part of the game should be keeeping eveyone alive. Create an account and save your maps for later or just start building a map!
                    </Typography>
            </Container>
            <RouterBtn to="/builder" name="Build Maps Now!" classes={classes.buildButton} disableRippe={true} variant="contained" />
          </Container>
        </Hidden>
        {/* HIDE THESE ELEMENTS WHEN SCREEN SIZE IS XS */}

      </Grid>
    </div>
  )
}
