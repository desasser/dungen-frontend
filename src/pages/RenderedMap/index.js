import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import API from '../../utils/API';

const useStyles = makeStyles({
  largeMap: {
    backgroundColor: '#372248',
    border: '1px black solid',
    maxWidth: '80%',
    // width: '80%',
    // height: 1000,
    borderRadius: '0.5em',
    // backgroundImage: `url("http://paratime.ca/images/fantasy/dungeon-055.jpg")`,
    backgroundRepeat: 'no-repeat',
    // backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    margin: "2rem auto",
    padding: "2rem",

    "& img": {
      width: '100%',
      margin: "0 auto",
      display: "block",
      border: "4px solid black"
    }
  },
  saveBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#E52977',
    color: '#ABC686',
    margin: "0 1rem"
  },
  editBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#ABC686',
    color: '#E52977',
    margin: "0 1rem"
  },
  orderBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#E52977',
    color: '#ABC686',
    margin: "0 1rem"
  },
  clearBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#ABC686',
    color: '#E52977',
    margin: "0 1rem"
  }
})

export default function RenderedMap(props) {
  const classes = useStyles();

  const [mapData, setMapData] = React.useState({img_url: "", mapTitle: "", mapId: null})

  let { id } = useParams();
  
  // TODO: Maybe can't be done front side?
  React.useEffect(() => {
    console.log("RENDER THIS ID:", id)
    if(id !== undefined) {
      API.renderMap(id)
      .then(mapData => {
        console.log(mapData);
        setMapData(mapData.data);
      })
      .catch(err => console.error(err));
    }
  }, [])
  
  return (
    <Container>
      <Typography variant='h2' style={{marginTop: "2rem"}}>
        {mapData.mapTitle}
      </Typography>
      <Container className={classes.largeMap} >
        <img src={mapData.img_url} alt={mapData.mapTitle} />
      </Container>
        <ActionBtn name='SAVE' classes={classes.saveBtn} />
        <RouterBtn name='EDIT' classes={classes.editBtn} />
        <RouterBtn name='ORDER NOW' classes={classes.orderBtn} />
        <RouterBtn name='CLEAR' classes={classes.clearBtn} />

    </Container>
  )
}
