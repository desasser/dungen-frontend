import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import API from '../../utils/API';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles({
  largeMap: {
    backgroundColor: 'white',
    outline: '#8eb1c7 15px solid',
    maxWidth: '80%',
    // backgroundImage: `url("http://paratime.ca/images/fantasy/dungeon-055.jpg")`,
    backgroundRepeat: 'no-repeat',
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
  },
  actionBtn: {
    '&:hover': {
      color: 'white',
      backgroundColor: '#eb4511'
    },
    width: 100,
    height: 60,
    backgroundColor: 'white',
    color: '#eb4511',
    margin: 20,
    fontSize: '18px',
  },
  routerBtn: {
    '&:hover': {
      color: '#36434b',
      backgroundColor: 'white'
    },
    width: 100,
    height: 60,
    backgroundColor: '#36434b',
    color: '#eb4511',
    marginTop: 20,
    fontSize: '18px',
  },
  title: {
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '50px',
    marginTop: 20,
  },
})

const FancyLinearProgress = withStyles((theme) => ({
  root: {
    height: 10,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: '#36434b',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#eb4511',
  },
}))(LinearProgress);

export default function RenderedMap(props) {
  const classes = useStyles();
  const history = useHistory();

  const mapTitleRef = React.useRef(null);

  const [mapData, setMapData] = React.useState({ img_url: "", mapTitle: "", mapId: null })

  const [rendered, setRendered] = useState(false);

  const savedMap = localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null;

  let { id } = useParams();

  React.useEffect(() => {
    if (id !== undefined) {

      API.renderMap(id)
      .then(mapData => {
        console.log("mapdata", mapData.data);
        setMapData(mapData.data);
        setRendered(true);

        API.updateMap({id: mapData.data.mapId, image_url: mapData.data.image_url})
        .then(results => {
          console.log("UPDATED MAP WITH IMAGE", results);
        })
        .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
    } else {
      const savedURI = localStorage.getItem('dungen_map_image');

      if(savedURI !== null) {
        if(savedMap !== null && savedMap.name !== "" && mapTitleRef.current) {
          setMapData({ ...mapData, mapTitle: savedMap.name });
          mapTitleRef.current = savedMap.name
        }
        
        setMapData({ ...mapData, image_url: savedURI});
        
        setRendered(true);
      }
    }
  }, [])

  const editButtonAction = () => {
    history.goBack();
  }

  return (
    <Container style={{paddingTop: 85}}>
      <Typography variant='h2' className={classes.title} ref={mapTitleRef}>
        {mapTitleRef.current}
      </Typography>
      <Container className={classes.largeMap} >
        {/* TODO: Add ternary operator to check if the image has finished rendering or not */}
        {!rendered ? <FancyLinearProgress /> : <img src={mapData.image_url} alt={mapData.mapTitle} />}
      </Container>
      {/* <ActionBtn name='SAVE' classes={classes.actionBtn} /> */}
      <ActionBtn name='EDIT' classes={classes.actionBtn} action={editButtonAction} />
      {/* <RouterBtn name='ORDER NOW' classes={classes.orderBtn} />
        <RouterBtn name='CLEAR' classes={classes.clearBtn} /> */}

    </Container>
  )
}
