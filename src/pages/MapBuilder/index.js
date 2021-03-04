import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import SliderDrawer from '../../components/SliderDrawer'
import IconBtn from '../../components/IconBtn'
import ActionBtn from '../../components/ActionBtn'
import RouterBtn from '../../components/RouterBtn'
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LockOpenOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import Grid from '../../components/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveBar from '../../components/SaveBar'
import AuthBar from '../../components/AuthBar'
import API from '../../utils/API';
import snail from '../../images/DisapproverSnail.png';

const useStyles = makeStyles({
  tileGrid: {
    display: 'flex',
    backgroundColor: '#372248',
    flexWrap: 'wrap',
    width: 300,
    marginLeft: 500,
  },
  iconBtn: {
    width: 100,
    height: 50,
    color: '#E4572E',
  },
  actionBtn: {
    '&:hover': {
      color: 'white',
      backgroundColor: '#eb4511'
    },
    width: 110,
    height: 60,
    backgroundColor: 'white',
    color: '#eb4511',
    margin: 20,
    fontSize: '18px',
  },
  renderBtn: {
    '&:hover': {
      color: '#84e561',
      backgroundColor: '#36434b'
    },
    width: 100,
    height: 60,
    backgroundColor: '#84e561',
    color: '#36434b',
    margin: 20,
    fontSize: '18px',
  },
  clearBtn: {
    '&:hover': {
      backgroundColor: '#eb4511',
    color: 'white',
    },
    width: 100,
    height: 60,
    color: '#36434b',
    backgroundColor: '#f8b4a0',
    marginTop: 20,
    fontSize: '18px',
  },
  routerBtn: {
    '&:hover': {
      color: '#36434b',
      backgroundColor: 'white'
    },
    width: 110,
    height: 60,
    backgroundColor: '#36434b',
    color: '#eb4511',
    marginTop: 20,
    fontSize: '18px',
  },
  titleInput: {
    borderRadius: '0.5em',
    width: '600px',
    '& .MuiFilledInput-input': {
      fontSize: '24px',
      fontFamily: 'SpaceAndAstronomy',
      backgroundColor: 'white'
    }
  },
  title: {
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '30px',
    marginTop: 20,
    // color: '#eb4511',
    // fontWeight: 900
  },
  titleBtn: {
    color: 'white',
    alignSelf: 'flex-end',
    marginRight: 20
  },
  titleWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    width: '80%'
  },
  btnWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '94.5%'
  },
  imageStyle: {
    padding: 40,
    borderRadius: '0.25em',
    width: '80%',
    height: 'auto'
  },
  mobileMapBuilder: {
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '40px',
    marginTop: 20
  },
  mobileMapBuilderSub: {
    fontSize: '14px',
    fontFamily: 'SpaceAndAstronomy'
  },
  subTextWrapper: {
    width: '60%',
    marginTop: 10
  }
})

//black and pink #232E21 #F42272
export default function MapBuilder(props) {
  // for tile "drawer"
  const [lockState, setLockState] = useState(false);
  const [titleState, setTitleState] = useState(false);
  // for the map title
  const [mapTitle, setMapTitle] = useState("Untitled Map");
  // for adding a new tile to the map grid
  const [addThisTile, setAddThisTile] = useState({
    tileid: null,
    mapTileId: null,
    environment: "",
    bg: "",
    x: null,
    y: null
  });
  const [loadedMapData, setLoadedMapData] = useState({ name: "" });

  const [saved, setSavedState] = useState(false);

  const [auth, setAuthState] = useState(false)

  // STATE to track view or build mode
  const [viewState, setViewState] = useState(false);

  const classes = useStyles();

  const history = useHistory();
  let { id } = useParams();

  React.useEffect(() => {
    if (id !== undefined) {
      API.getSingleMap(id)
        .then(res => {
          // console.log(res)
          if (res.data !== "") {
            setMapTitle(res.data.name);
            setLoadedMapData(res.data);
          }
        })
        .catch(err => console.error(err));
    }
  }, []);
  const logIn = props.users.isLoggedIn
  console.log(logIn)

  const handleLock = () => {
    if (lockState) {
      setLockState(false);
    } else {
      setLockState(true);
    }
  }

  const toggleSavedState = () => {
    setSavedState(false)
  }

  const toggleAuthState = () => {
    setAuthState(false)
  }

  const saveMap = () => {
    saveMapToDB(false);
  }

  const saveMapToDB = (render) => {
    let savedMap = JSON.parse(localStorage.getItem('dungen_map'));
    console.log(id, id === null, id === undefined);
    console.log('check me', props);
    let results;

    if (logIn === false) {
      setAuthState(true)
    }
    if (id === null || id === undefined) {
      console.log("NO ID, SAVING NEW MAP")
      // console.log(e.target);
      const mapLayout = savedMap.layout;

      results = API.saveMap({ UserId: props.users.id, name: mapTitle, image_url: "" })
        .then(savedMap => {
          // console.log(savedMap.data);
          const newMapId = savedMap.data.id;

          const newMapTiles = createMapTiles(newMapId);

          for (var i = 0; i < newMapTiles.length; i++) {
            if (newMapTiles[i].TileId !== null) {
              API.saveMapTile(newMapTiles[i])
                .then(savedMapTile => {
                  // mapTile successfully saved!
                })
                .catch(err => console.error(err));
            }
          }
          setSavedState(true);
          
          console.log("TO RENDER, OR NOT TO RENDER?", render);
          if(render) {
            history.push(`/render/${newMapId}`);
          } else {
            history.push(`/builder/${newMapId}`);
          }
        })
        .catch(err => console.error(err));

    } else {
      console.log("ID PROVIDED, SAVING MAP TILES FOR SPECIFIED MAP")
      // we should probably ask the user if they want to save a NEW map
      // or save over the existing map
      // but that's a "later guy" problem, imho
      if (savedMap.mapTitle !== mapTitle) {
        results = API.updateMap({ id: id, name: mapTitle })
          .then(results => {
            setSavedState(true)
            // map title updated!
          })
          .catch(err => console.error(err));
        }

      API.deleteAllMapTilesForMap(id)
        .then(results => {
          console.log(results);

          for (var i = 0; i < savedMap.layout.length; i++) {
            // console.log(savedMap.layout[i]);
            let tile = newMapTile(id, savedMap.layout[i]);
            API.saveMapTile(tile)
              .then(results => {
                setSavedState(true)
                console.log(results);
              })
              .catch(err => console.error(err));
          }

          console.log("TO RENDER, OR NOT TO RENDER?", render);
          if(render) {
            history.push(`/render/${id}`);
          } else {
            history.push(`/builder/${id}`);
          }

        })
        .catch(err => console.error(err));

      // for(var i = 0; i < savedMap.layout.length; i++) {
      //   // console.log(savedMap.layout[i]);
      //   let tile = newMapTile(id, savedMap.layout[i]);
      //   API.saveMapTile(tile)
      //   .then(results => {
      //     console.log(results);
      //   })
      //   .catch(err => console.error(err));

      //   // if(tile.mapTileId === undefined || tile.mapTileId === null) {
      //   //   API.saveMapTile(tile)
      //   //   .then(results => {
      //   //     console.log(results);
      //   //   })
      //   //   .catch(err => console.error(err));

      //   // } else {
      //   //   API.updateMapTile(tile)
      //   //   .then(results => {
      //   //     console.log(results.data);
      //   //   })
      //   //   .catch(err => console.error(err));
      //   // }
      // }
    }
  }

  const newMapTile = (mapId, tileData) => {
    // console.log("tileData -> newMapTile", tileData);
    let newTile = {
      MapId: parseInt(mapId),
      TileId: parseInt(tileData.tileId),
      xCoord: parseInt(tileData.x),
      yCoord: parseInt(tileData.y),
      orientation: tileData.orientation,
      mirror: tileData.mirror
    }
    // console.log(newTile);
    return newTile;
  }

  const createMapTiles = (mapId) => {
    const mapLayout = JSON.parse(localStorage.getItem('dungen_map')).layout;
    let mapTiles = [];
    for (var i = 0; i < mapLayout.length; i++) {
      const tile = newMapTile(mapId, mapLayout[i]);
      mapTiles.push(tile);
    }

    return mapTiles;
  }

  const renderMap = (e) => {
    // true = render map after saving
    console.log("RENDER THE DAMN MAP")
    saveMapToDB(true);
  }
  
  const viewMap = () => {
    setViewState((prev) => !prev)
  }

  const clearMap = (e) => {
    console.log("clear the grid")
    localStorage.removeItem('dungen_map');
    setLoadedMapData({ name: "" });
  }

  const handleDraggableItem = (e) => {
    // console.log(e.target.dataset.tileid);
    setAddThisTile({
      ...addThisTile,
      tileid: e.target.dataset.tileid,
      maptileid: e.target.dataset.maptileid,
      environment: e.target.dataset.environment,
      bg: e.target.dataset.image
    });
  }

  const handleTitleSubmit = (event) => {
    event.preventDefault();
    setTitleState(false);
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  console.log('check me out!', navigator.userAgent);
  console.log('mobile?', isMobile);

  return (
    !isMobile ?
      (<Container>
        <Container>
          <Container className={classes.titleWrapper}>
            <Typography variant='h2' className={classes.title}>{mapTitle}</Typography>
            {!titleState ? <Button onClick={() => setTitleState(true)} className={classes.titleBtn}>Edit Title</Button> :
              <form onSubmit={handleTitleSubmit}>
                <TextField id="filled-basic" label="Map Title" variant="filled" value={mapTitle} onChange={(e) => setMapTitle(e.target.value)} className={classes.titleInput} />
              </form>}
          </Container>

          {/* The "handleDraggableItem" prop here is to get the data for the AddThisTile const */}
          <SliderDrawer handleDraggableItem={handleDraggableItem} />
          {/* GRID BOX */}
          <Container className="grid-base" style={{ outline: '#8eb1c7 15px solid', height: '1000px', width: '1000px', marginTop: '25px', padding: '0px' }}>
            <Grid addThisTile={addThisTile} loadThisMap={id} viewState={viewState} />
          </Container>
          {/* TODO: This functionality is for future development */}
          {/* <IconBtn name='icon' classes={classes.iconBtn} onClick={handleLock}>
          {lockState ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
          </IconBtn> */}
          <Container className={classes.btnWrapper}>
            {/* <ActionBtn name='CLEAR' classes={classes.actionBtn} action={clearMap} /> */}
            <ActionBtn name='RENDER' classes={classes.actionBtn} action={renderMap} />
            <ActionBtn name={!viewState ? 'PREVIEW' : 'BUILD'} classes={classes.routerBtn} action={viewMap} />
            <ActionBtn name='SAVE' classes={classes.actionBtn} action={saveMapToDB} />
          </Container>
        </Container>
        <SaveBar saved={saved} toggleSavedState={toggleSavedState} />
        <AuthBar auth={auth} toggleAuthState={toggleAuthState} />
      </Container>) :
      (
        <Container>
          <Typography variant='h3' className={classes.mobileMapBuilder}>
            Sorry, you can't make maps on mobile... yet...
        </Typography>
          <Container className={classes.subTextWrapper}>
            <Typography variant='h6' className={classes.mobileMapBuilderSub}>
              Besides, do you really want to build a map with your thumb?
        </Typography>
          </Container>
          <img
            src={snail}
            className={classes.imageStyle}
          />
        </Container>
      )

  )
}
