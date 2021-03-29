import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import IconBtn from '../../components/IconBtn'
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import SuperDrawer from '../../components/SuperDrawer';
import MapCanvas from '../../components/MapCanvas/MapCanvas.js';
import CanvasContextProvider from '../../contexts/CanvasContext';
import DatabaseContextProvider from '../../contexts/DatabaseContext';
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
      fontFamily: "Immortal",
      backgroundColor: "white",
    },
  },
  title: {
    fontFamily: "Immortal",
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
    fontFamily: "Immortal",
    fontSize: "40px",
    marginTop: 20,
  },
  mobileMapBuilderSub: {
    fontSize: "14px",
    fontFamily: "Immortal",
  },
  subTextWrapper: {
    width: "60%",
    marginTop: 10,
  },
});

//black and pink #232E21 #F42272
export default function MapBuilder(props) {
  const classes = useStyles();

  // map builder init data for new maps
  const [mapData, setMapData] = useState(null);

  // FOR SNACKBAR NOTIFICATION!
  const [saved, setSavedState] = useState(false);
  // FOR SNACKBAR NOTIFICATION!
  const [auth, setAuthState] = useState(false);

  // for redirecting page after saving to builder/:id
  const history = useHistory();

  // for loading a specific map from saved maps
  const { id } = useParams();

  // check to see if user is logged in
  const logIn = props.users.isLoggedIn;
  // console.log(logIn);

  useEffect(() => {
    console.log(id);
    if (id !== "undefined" && id !== undefined && id !== null) {
      API.getSingleMap(id)
        .then((res) => {
          if (res.data !== "") {
            const savedMapSettings = JSON.parse(localStorage.getItem('dungen_map_settings')) || null;
            
            if(savedMapSettings !== null && savedMapSettings.updatedLocallyAt < res.data.updatedAt) {
              const dt = new Date();
              const year = dt.getFullYear();
              const month = (dt.getMonth() + 1).toString().padStart(2, '0');
              const day = dt.getDate().toString().padStart(2, '0');
              const hour = dt.getHours().toString().padStart(2, '0');
              const min = dt.getMinutes().toString().padStart(2, '0');
              const sec = dt.getSeconds().toString().padStart(2, '0');

              let dateTime = `${year}-${month}-${day} ${hour}:${min}:${sec}`;

              const mapSettings = {
                name: res.data.name,
                rows: res.data.rows,
                columns: res.data.columns,
                infinite: res.data.rows === null || res.data.columns === null ? true : false,
                EnvironmentId: res.data.EnvironmentId,
                public: res.data.public,
                id: parseInt(res.data.id),
                UserId: res.data.UserId,
              }

              localStorage.setItem('dungen_map_settings', JSON.stringify({...mapSettings, updatedLocallyAt: dateTime}));
              localStorage.setItem('dungen_map_tiles', JSON.stringify(res.data.MapTiles !== undefined ? res.data.MapTiles : []));
              localStorage.setItem('dungen_map_encounters', JSON.stringify(res.data.MapEncounters !== undefined ? res.data.MapEncounters : []));

              let savedGrid = localStorage.getItem('dungen_map_grid') !== undefined ? JSON.parse(localStorage.getItem('dungen_map_grid')) : null
              if(savedGrid !== null) {
                savedGrid = {
                  ...savedGrid,
                  rows: mapSettings.rows,
                  columns: mapSettings.columns,
                  infinite: mapSettings.infinite,
                  containerWidth: mapSettings.columns * savedGrid.tileSize,
                  containerHeight: mapSettings.rows * savedGrid.tileSize,
                  startX: mapSettings.columns * savedGrid.tileSize * -1,
                  startY: mapSettings.rows * savedGrid.tileSize * -1,
                  endX: mapSettings.columns * savedGrid.tileSize,
                  endY: mapSettings.rows * savedGrid.tileSize,
                }

                localStorage.setItem('dungen_map_grid', JSON.stringify(savedGrid));
              }

              const xOffset = ((window.innerWidth - 380) - (savedGrid.tileSize * savedGrid.columns)) / 2;
              const yOffset = ((window.innerHeight - 75) - (savedGrid.tileSize * savedGrid.rows)) / 2;
              const gridWidth = savedGrid.tileSize * savedGrid.columns;
              const gridHeight = savedGrid.tileSize * savedGrid.rows;

              let newStagePosition = {x: 0, y: 0, recenterX: 0, recenterY: 0}

              if(window.innerWidth - 380 > gridWidth) {
                newStagePosition = {...newStagePosition, x: xOffset, recenterX: xOffset}
              } else {
                newStagePosition = { ...newStagePosition, x: 0, recenterX: 0 }
              }

              if(window.innerHeight - 75 > gridHeight) {
                newStagePosition = {...newStagePosition, y: yOffset, recenterY: yOffset}
              } else {
                newStagePosition = { ...newStagePosition, y: 0, recenterY: 0 }
              }

              localStorage.setItem('dungen_stageposition', JSON.stringify(newStagePosition))

            }
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  const toggleSavedState = () => {
    setSavedState(false);
  };

  const toggleAuthState = () => {
    setAuthState(false);
  };

  /**
   * MAP CANVAS + MAP CONTROLS FUNCTIONS
   */
  // TILES RESEVOIR
  // const handleDraggableItem = (e) => {
  //   const tileData = {
  //     TileId: e.target.dataset.tileid,
  //     image_src: e.target.src
  //     // image_src: e.target.style.backgroundImage.substring(5, e.target.style.backgroundImage.length - 2)
  //   }
  //   e.dataTransfer.setData('dropped_tile', JSON.stringify(tileData));
  // };

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return !isMobile ? (
    <Box>
      <div>
        <CanvasContextProvider mapId={id} user={props.users}>
          <DatabaseContextProvider mapId={id} user={props.users}>
            <SuperDrawer />
          </DatabaseContextProvider>
          <MapCanvas mapId={id} user={props.users} />
        </CanvasContextProvider>
      </div >
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
