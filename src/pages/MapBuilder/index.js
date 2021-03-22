import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import SliderDrawer from '../../components/SliderDrawer'
import IconBtn from '../../components/IconBtn'
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import MapCanvas from '../../components/MapCanvas';
import { Container, Box, Typography, TextField, Button } from '@material-ui/core';
// import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
import SaveBar from '../../components/SaveBar'
import AuthBar from '../../components/AuthBar'
import API from '../../utils/API';
import snail from '../../images/DisapproverSnail.png';
// import ErrorBoundary from '../../components/ErrorBoundary';

const useStyles = makeStyles({
  tileGrid: {
    display: "flex",
    backgroundColor: "#372248",
    flexWrap: "wrap",
    width: 300,
    marginLeft: 500,
  },
  iconBtn: {
    width: 100,
    height: 50,
    color: "#E4572E",
  },
  actionBtn: {
    "&:hover": {
      color: "white",
      backgroundColor: "#eb4511",
    },
    width: 110,
    height: 60,
    backgroundColor: "white",
    color: "#eb4511",
    margin: 20,
    fontSize: "18px",
  },
  renderBtn: {
    "&:hover": {
      color: "#84e561",
      backgroundColor: "#36434b",
    },
    width: 100,
    height: 60,
    backgroundColor: "#84e561",
    color: "#36434b",
    margin: 20,
    fontSize: "18px",
  },
  clearBtn: {
    '&:hover': {
      backgroundColor: '#eb4511',
      color: 'white',
    },
    width: 100,
    height: 60,
    color: "#36434b",
    backgroundColor: "#f8b4a0",
    marginTop: 20,
    fontSize: "18px",
  },
  routerBtn: {
    "&:hover": {
      color: "#36434b",
      backgroundColor: "white",
    },
    width: 110,
    height: 60,
    backgroundColor: "#36434b",
    color: "#eb4511",
    marginTop: 20,
    fontSize: "18px",
  },
  titleInput: {
    borderRadius: "0.5em",
    width: "600px",
    "& .MuiFilledInput-input": {
      fontSize: "24px",
      fontFamily: "SpaceAndAstronomy",
      backgroundColor: "white",
    },
  },
  title: {
    fontFamily: "SpaceAndAstronomy",
    fontSize: "30px",
    marginTop: 20,
    // marginLeft: 80,
    flex: 1,
    // color: '#eb4511',
    // fontWeight: 900
  },
  titleBtn: {
    color: "white",
    alignSelf: "flex-end",
    marginRight: 20
  },
  titleWrapper: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    width: "80%",
  },
  btnWrapper: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
    width: "94.5%",
  },
  imageStyle: {
    padding: 40,
    borderRadius: "0.25em",
    width: "80%",
    height: "auto",
  },
  mobileMapBuilder: {
    fontFamily: "SpaceAndAstronomy",
    fontSize: "40px",
    marginTop: 20,
  },
  mobileMapBuilderSub: {
    fontSize: "14px",
    fontFamily: "SpaceAndAstronomy",
  },
  subTextWrapper: {
    width: "60%",
    marginTop: 10,
  },
});

//black and pink #232E21 #F42272
export default function MapBuilder(props) {
  const classes = useStyles();

  // for tile "drawer"
  const [titleState, setTitleState] = useState(false);
  // for the map title
  const [mapTitle, setMapTitle] = useState("Untitled Map");

  // map builder init data for new maps
  const [newMapData, setNewMapData] = useState(null);

  // FOR SNACKBAR NOTIFICATION!
  const [saved, setSavedState] = useState(false);
  // FOR SNACKBAR NOTIFICATION!
  const [auth, setAuthState] = useState(false);

  // for redirecting page after saving to builder/:id
  // AND for redirecting to "render" page
  const history = useHistory();
  // for loading a specific map from saved maps
  const { id } = useParams();

  // check to see if user is logged in
  const logIn = props.users.isLoggedIn;
  // console.log(logIn);

  const [open, setOpen] = useState(props.openModal);

  const savedMap = localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null;

  useEffect(() => {
    if (id !== undefined) {
      API.getSingleMap(id)
        .then((res) => {
          // console.log(res)
          if (res.data !== "") {
            setMapTitle(res.data.name);
            // setLoadedMapData(res.data);
          }
        })
        .catch(err => console.error(err));
    }

    if(savedMap !== null && savedMap.name !== "") {
      setMapTitle(savedMap.name);
    }

  }, []);

  const toggleSavedState = () => {
    setSavedState(false);
  };

  const toggleAuthState = () => {
    setAuthState(false);
  };

  const handleDraggableItem = (e) => {
    const tileData = {
      TileId: e.target.dataset.tileid,
      image_src: e.target.src
      // image_src: e.target.style.backgroundImage.substring(5, e.target.style.backgroundImage.length - 2)
    }
    e.dataTransfer.setData('dropped_tile', JSON.stringify(tileData));
  };

  const handleTitleSubmit = (event) => {
    event.preventDefault();

    if(savedMap !== null && mapTitle !== "Untitled Map") {
      savedMap.name = mapTitle;
      localStorage.setItem('dungen_map', JSON.stringify(savedMap));
      console.log("pMB206 localstorage", localStorage.getItem('dungen_map'));
    }

    setTitleState(false);
  };

  const handleStartMapFormSubmit = (mapData) => {
    console.log("pMB347", mapData);
    if(mapData.name !== "") { setMapTitle(mapData.name); }
    setNewMapData(mapData);
    console.log(mapData);
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return !isMobile ? (
    <Box>
      {/* MAP TITLE */}
      <Container className={classes.titleWrapper}>
        <Typography variant="h2" className={classes.title}>
          {mapTitle}
        </Typography>
        {!titleState ? (
          <Button
            onClick={() => setTitleState(true)}
            className={classes.titleBtn}
          >
            Edit Title
          </Button>
        ) : (
          <form onSubmit={handleTitleSubmit}>
            <TextField
              id="filled-basic"
              label="Map Title"
              variant="filled"
              value={mapTitle}
              onChange={(e) => setMapTitle(e.target.value)}
              className={classes.titleInput}
            />
          </form>
        )}
      </Container>

      {/* MAP BUILDER */}
      <MapCanvas
        loadThisMap={id}
        toggleSavedState={toggleSavedState}
        toggleAuthState={toggleAuthState}
        init={newMapData}
      />

      <SliderDrawer handleDraggableItem={handleDraggableItem} handleMapData={handleStartMapFormSubmit} />

      {/* SNACKBAR NOTIFICATIONS */}
      <SaveBar saved={saved} toggleSavedState={toggleSavedState} />
      <AuthBar auth={auth} toggleAuthState={toggleAuthState} />
    </Box>
  ) : (
    // else statement for mobile users
    <Box>
      <Typography variant="h3" className={classes.mobileMapBuilder}>
        Sorry, you can't make maps on mobile... yet...
      </Typography>
      <Container className={classes.subTextWrapper}>
        <Typography variant="h6" className={classes.mobileMapBuilderSub}>
          Besides, do you really want to build a map with your thumb?
        </Typography>
      </Container>
      <img src={snail} className={classes.imageStyle} />
    </Box>
  );
}
