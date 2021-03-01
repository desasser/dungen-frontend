import React, {useEffect} from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
// import mergeImg from 'merge-img';

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
  saveBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#E52977',
    color: '#ABC686'
  },
  editBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#ABC686',
    color: '#E52977'
  },
  orderBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#E52977',
    color: '#ABC686'
  },
  clearBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#ABC686',
    color: '#E52977'
  }
})


export default function RenderedMap() {
  const classes = useStyles();
  
  // TODO: Maybe can't be done front side?
  // useEffect(() => {
  //   mergeImg(['../../../public/2EDC02', '../../../public/2EDC03', '../../../public/2EDC04', '../../../public/2EDC05']).then((img) => {
  //     img.toFile('output.png', () => console.log('done'))
  //   })
  // }, [])

  return (
    <Container>
      <Typography variant='h2'>
        This where you can see a big map!
      </Typography>
      <Container className={classes.largeMap}>
      </Container>
        <ActionBtn name='SAVE' classes={classes.saveBtn} />
        <RouterBtn name='EDIT' classes={classes.editBtn} />
        <RouterBtn name='ORDER NOW' classes={classes.orderBtn} />
        <RouterBtn name='CLEAR' classes={classes.clearBtn} />

    </Container>
  )
}
