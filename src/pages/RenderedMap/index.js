import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import API from '../../utils/API';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  largeMap: {
    backgroundColor: 'white',
    outline: `${theme.palette.primary.main} 15px solid`,
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
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[5],
    fontFamily: 'Immortal',
    fontSize: '24px',
    position: 'relative',
    left: '9%',
    '&:hover' : {
      color:'white',
      backgroundColor: theme.palette.primary.main,
    }
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
    fontFamily: 'Immortal',
    fontSize: '50px',
    marginTop: 20,
    textAlign: 'center'
  },
}))

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

  const [mapData, setMapData] = React.useState({ image_url: "", mapTitle: "", mapId: null })

  const [rendered, setRendered] = useState(false);

  const savedSettings = JSON.parse(localStorage.getItem('dungen_map_settings')) || null;

  const savedURI = localStorage.getItem('dungen_map_image');

  let { id } = useParams();

  React.useEffect(() => {
    if (id !== undefined) {

      API.renderMap(id)
      .then(mapData => {
        console.log("mapdata", mapData.data);
        setMapData(mapData.data)
        setRendered(true);
      })
      .catch(err => console.error(err));

    } else {
      if(savedURI !== null) {
        if(savedSettings !== null && savedSettings.name !== "" && mapTitleRef.current) {
          setMapData({ ...mapData, mapTitle: savedSettings.name });
          mapTitleRef.current = savedSettings.name
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
    <Container>
      <Typography variant='h2' className={classes.title} ref={mapTitleRef}>
        Map Preview
      </Typography>
      <Container className={classes.largeMap}>
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
