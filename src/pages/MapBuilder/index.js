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
    height: 50,
    backgroundColor: '#E52977',
    color: '#ABC686'
  },
  routerBtn: {
    width: 100,
    height: 50,
    backgroundColor: '#ABC686',
    color: '#E52977'
  },
  titleInput: {
    // backgroundColor: 'white',
    borderRadius: '0.5em',
    width: '600px',
    // fullWidth: true,
    '& .MuiFilledInput-input': {
      fontSize: '24px',
      fontFamily: 'SpaceAndAstronomy',
      backgroundColor: 'white'
    }
  },
  title: {
    fontFamily: 'SpaceAndAstronomy',
    fontSize: '40px',
    marginTop: 20,
    // color: '#eb4511',
    // fontWeight: 900
  },
  titleBtn: {
    // margin: 10,
    color: 'white',
    alignSelf: 'flex-end',
    marginRight: 20
  },
  titleWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    width: '80%'
  }
})

//black and pink #232E21 #F42272
export default function MapBuilder() {
  const [mapTitle, setMapTitle] = useState("Rambo's Throne of Marshmallows");
  const [lockState, setLockState] = useState(false);
  const [titleState, setTitleState] = useState(false);
  // for adding a new tile to the map grid
  const [addThisTile, setAddThisTile] = useState({
    tileid: null,
    environment: "",
    bg: ""
  });
  const [loadThisMap, setLoadThisMap] = useState(null);

  const classes = useStyles();

  let { id } = useParams();

  React.useEffect(() => {
    if (id !== undefined) {
      console.log(id);
      API.getSingleMap(id)
        .then(results => {
          console.log(results.data);
          // const loadedLayout = results.data
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
      environment: e.target.dataset.environment,
      bg: e.target.dataset.image
    });
  }

  const saveMapToDB = (e) => {
    // console.log(e.target);
    const mapLayout = JSON.parse(localStorage.getItem('dungen_map')).layout;

    API.saveMap({ UserId: 1, name: mapTitle, image_url: "" })
      .then(savedMap => {
        console.log(savedMap.data);
        const newMapId = savedMap.data.id;

        for (var i = 0; i < mapLayout.length; i++) {
          let tile = {
            MapId: newMapId,
            TileId: parseInt(mapLayout[i].tileId),
            xCoord: mapLayout[i].x,
            yCoord: mapLayout[i].y,
            orientation: mapLayout[i].orientation
          }

          API.saveMapTile(tile)
            .then(savedMapTile => {
              console.log(savedMapTile.data);
            })
            .catch(err => console.error(err));
        }

      })
      .catch(err => console.error(err));
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
          <Grid addThisTile={addThisTile} loadThisMap={loadThisMap} />
        </Container>
        {/* TODO: This functionality is for future development */}
        {/* <IconBtn name='icon' classes={classes.iconBtn} onClick={handleLock}>
          {lockState ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
        </IconBtn> */}
        <ActionBtn name='CLEAR' classes={classes.actionBtn} action={clearMap} />
        <ActionBtn name='SAVE' classes={classes.actionBtn} action={saveMapToDB} />
        <RouterBtn name='VIEW' classes={classes.routerBtn} action={viewMap} />
      </Container>
    </Container>
  )
}
