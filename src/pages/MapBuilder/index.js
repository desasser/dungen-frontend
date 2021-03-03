import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
import API from '../../utils/API';

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
    width: 100,
    height: 60,
    backgroundColor: '#eb4511',
    color: '#36434b',
    margin: 20,
    fontSize: '18px',
  },
  routerBtn: {
    width: 100,
    height: 60,
    backgroundColor: '#36434b',
    color: '#eb4511',
    margin: 20,
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
    width: '80%'
  }
})

//black and pink #232E21 #F42272
export default function MapBuilder() {
  // for tile "drawer"
  const [lockState, setLockState] = useState(false);
  const [titleState, setTitleState] = useState(false);
  // for the map title
  const [mapTitle, setMapTitle] = useState("Rambo's Throne of Marshmallows");
  // for adding a new tile to the map grid
  const [addThisTile, setAddThisTile] = useState({
    tileid: null,
    mapTileId: null,
    environment: "",
    bg: "",
    x: null,
    y: null
  });
  // for the map data to load
  const [loadedMapData, setLoadedMapData] = useState([]);

  const classes = useStyles();

  let { id } = useParams();

  React.useEffect(() => {
    if(id !== undefined && loadedMapData.length === 0) {
      API.getSingleMap(id)
      .then(singleMap => {
        setMapTitle(singleMap.data.name);
        const mapTiles = singleMap.data.MapTiles;
        let gridTiles = [];
        for( var i = 0; i < mapTiles; i++ ) {
          const mapTile = mapTiles[i];
          const tile = {
            tileid: mapTile.TileId,
            maptileid: mapTile.id,
            environment: mapTile.EnvironmentId,
            bg: mapTile.Tile.image_url,
            x: tile.xCoord,
            y: mapTile.yCoord
          }
          gridTiles.push(tile);
        }

        const loadLayout = {
          mapId: id,
          layout: gridTiles,
          mapTitle: mapTitle
        }

        setLoadedMapData([...loadLayout]);
      })
      .catch(err => console.error(err));
    }
  }, []);

  const handleLock = () => {
    if (lockState) {
      setLockState(false);
    } else {
      setLockState(true);
    }
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

  const saveMapToDB = (e) => {
    let savedMap = JSON.parse(localStorage.getItem('dungen_map'));

    if( id === null || id === undefined ) {
      // console.log(e.target);
      const mapLayout = savedMap.layout;
      
      API.saveMap({UserId: 1, name: mapTitle, image_url: ""})
      .then(savedMap => {
        // console.log(savedMap.data);
        const newMapId = savedMap.data.id;
        
        const newMapTiles = createMapTiles();

        for(var i = 0; i < newMapTiles.length; i++) {
          API.saveMapTile(newMapTiles[i])
          .then(savedMapTile => {
            // console.log(savedMapTile.data);
          })
          .catch(err => console.error(err));
        }
        
      })
      .catch(err => console.error(err));

    } else {
      // we should probably ask the user if they want to save a NEW map
      // or save over the existing map
      // but that's a "later guy" problem, imho
      if( loadedMapData.name !== mapTitle ) {
        API.updateMap({id: id, name: mapTitle})
        .then(results => {
          // console.log(results);
        })
        .catch(err => console.error(err));

      }
      
      for(var i = 0; i < savedMap.layout.length; i++) {
        // console.log(savedMap.layout[i]);
        let tile = newMapTile(id, savedMap.layout[i]);
        if(tile.mapTileId === undefined || tile.mapTileId === null) {
          API.saveMapTile(tile)
          .then(results => {
            console.log(results);
          })
          .catch(err => console.error(err));

        } else {
          API.updateMapTile(tile)
          .then(results => {
            console.log(results.data);
          })
          .catch(err => console.error(err));
        }
      }
    }
  }

  const newMapTile = (mapId, tileData) => {
    return {
      MapId: mapId,
      TileId: parseInt(tileData.tileId),
      xCoord: tileData.x,
      yCoord: tileData.y,
      orientation: tileData.orientation
    }
  }

  const createMapTiles = (mapId) => {
    const mapLayout = JSON.parse(localStorage.getItem('dungen_map')).layout;
    let mapTiles = [];
    for(var i = 0; i < mapLayout.length; i++) {
      const tile = newMapTile(mapId, mapLayout[i]);
      mapTiles.push(tile);
    }

    return mapTiles;
  }

  const viewMap = (e) => {
    console.log(e.target);
  }

  const clearMap = (e) => {
    console.log("clear the grid")
  }

  const handleTitleSubmit = (event) => {
    event.preventDefault();
    setTitleState(false);
  }

  return (
    <Container>
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
        <Container className="grid-base" style={{ outline: '#8eb1c7 15px solid', height: '1000px', width: '1000px', marginLeft: '0px', marginTop: '25px', padding: '0px' }}>
          <Grid addThisTile={addThisTile} loadThisMap={loadedMapData} />
        </Container>
        {/* TODO: This functionality is for future development */}
        {/* <IconBtn name='icon' classes={classes.iconBtn} onClick={handleLock}>
          {lockState ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
        </IconBtn> */}
        <Container className={classes.btnWrapper}>
          <ActionBtn name='CLEAR' classes={classes.actionBtn} action={clearMap} />
          <RouterBtn name='VIEW' classes={classes.routerBtn} action={viewMap} />
          <ActionBtn name='SAVE' classes={classes.actionBtn} action={saveMapToDB} />
        </Container>
      </Container>
    </Container>
  )
}
