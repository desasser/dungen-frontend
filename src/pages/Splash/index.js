import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import RouterBtn from '../../components/RouterBtn'
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import { motion } from "framer-motion"

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
    padding: "10% 25%",
    // backgroundColor: 'pink',
    // backgroundImage: 'url("../images/fantasy-wallpaper-psdvault-18.jpg")'
    backgroundImage: 'url("https://www.ubackground.com/_ph/23/968914319.jpg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
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
    // fontWeight: 'bold'
  },
  splashContent: {
    width: '80%',
    margin: '0 auto',
    // backgroundColor: 'pink',
    display: 'flex',
    alignItems: 'center'
  },
  splashText: {
    fontWeight: 'bold',
    fontSize: '60px',
    fontFamily: 'ESKARGOT'
  }
}));


export default function Splash() {
  const classes = useStyles();


  return (
    <div className={classes.root}>
      <Grid item xs={12} >
        <Container className={classes.containerBanner} >
          <motion.div className={classes.splashText}
            drag
            dragConstraints={{
              top: -140,
              left: -625,
              right: 600,
              bottom: 175,
            }}
            style={{
              color: '#eb4511'
            }}>
            Dun
          </motion.div>
          <motion.div className={classes.splashText}
            drag
            dragConstraints={{
              top: -140,
              left: -725,
              right: 600,
              bottom: 175,
            }}
            style={{
              color: '#eb4511'
            }}>
            Gen
          </motion.div>
          <motion.div className={classes.splashText}
            drag
            dragConstraints={{
              top: -140,
              left: -825,
              right: 600,
              bottom: 175,
            }}>
            Snail
          </motion.div>
          <motion.div className={classes.splashText}
            drag
            dragConstraints={{
              top: -140,
              left: -950,
              right: 600,
              bottom: 175,
            }}>
            Butts
          </motion.div>
        </Container >
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
      </Grid>
    </div>
  )
}
