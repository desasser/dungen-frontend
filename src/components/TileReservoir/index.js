import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import API from '../../utils/API';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import DraggableTile from '../MapTile/DraggableTile';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
  base: {
    backgroundColor: 'tomato',
    position: 'absolute',
    right: 0,
    top: 75,
    width: 350,
    height: 'calc(100vh - 75px)',
    overflowY: 'auto'
  },
  tileGrid: {
    paddingTop: 15,
    paddingBottom: 100,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    "& .droppable-element": {
      margin: "0.75rem"
    }
  },
  tileHeader: {
    // margin: '10 auto',
    textAlign: 'center',
    color: 'white'
  },
  tileWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '10px 0px 0px 0px',

  },
  selectMenu: {
    marginRight: 20,
    '& .MuiSelect-select': {
      fontFamily: 'Immortal',
      color: 'white',
      textAlign: 'center'
    },
    '& .MuiSelect-icon': {
      color: 'white'
    },
  },
  tileError: {
    fontFamily: 'SpaceAndAstronomy',
    color: 'white',
    marginTop: 100
  },
  menuItemStyle: {
    color: 'black',
    textDecoration: 'none',
    fontFamily: 'SpaceAndAstronomy'
  },
}));

export default function TileReservoir({ handleMapData, handleDraggableItem }) {
  const classes = useStyles();
  const [tileSet, setTileSet] = useState([]);
  const [loadState, setLoadState] = useState(false);
  const [tileSetState, setTileSetState] = useState('1');
  const [tileSetListState, setTileSetListState] = useState([]);

  const handleChangeTileSet = (event) => {
    setTileSetState(event.target.value);
  };

  useEffect(() => {
    // GET ALL TILES FROM ONE TileSets, RERUN WHEN TileSets IS CHANGED
    API.getTilesByTileSet(tileSetState)
      .then(tiles => {
        const list = tiles.data;
        let tileList = [];
        for (let i = 0; i < list.length; i++) {
          const tile = {
            key: i,
            tileId: list[i].id,
            tileSet: list[i].TileSet.name,
            imageURL: list[i].image_url
          }
          tileList.push(tile);
        }
        setTileSet(tileList);
        setLoadState(true);
      })
      .catch(err => console.error(err))
  }, [tileSetState]);

  useEffect(() => {
    // FETCH ALL TileSets
    API.getTileSets().then(tileSets => {
      setTileSetListState(tileSets.data)
    }).catch(err => console.error(err))
  }, []);

  return (
    <div className={classes.base}>
      <Container className={classes.tileGrid}>
          <Typography variant='h5' className={classes.tileHeader}>
            Dungeon Tiles
          </Typography>

          {/* Drop down menu for tileSet change */}
          <InputLabel id="demo-simple-select-label" shrink style={{color: 'white'}}>Tile Sets</InputLabel>
          <Select
            labelId="select-tileSet"
            id="select-tileSet"
            value={tileSetState}
            onChange={handleChangeTileSet}
            className={classes.selectMenu}
          >
            {/* MAP OVER ALL TILESETS AND CREATE MENU ITEMS */}
            {tileSetListState.map(tileSet => <MenuItem key={tileSet.id} value={tileSet.id} className={classes.menuItemStyle}>{tileSet.name.charAt(0).toUpperCase() + tileSet.name.slice(1)}</MenuItem>)}
          </Select>

          {/* Tile display */}
          <Container className={classes.tileWrapper}>

            {tileSet.length > 0 ?
              tileSet.map(tile => <DraggableTile key={tile.key} tileId={tile.tileId} tileSet={tile.tileSet} imageURL={tile.imageURL} handleDraggableItem={handleDraggableItem} />) : (
                (!loadState ? (
                  // <CircularProgress />
                  <LinearProgress />
                ) : (
                    <Typography variant='h3' className={classes.tileError}>
                      No tiles!
                    </Typography>))
              )}
          </Container>
        </Container>
    </div>
  )
}
