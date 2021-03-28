import { useState, useEffect, useContext } from "react";
import { makeStyles, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { MapOutlined } from "@material-ui/icons";
import API from "../../utils/API";
import { CanvasContext } from "../../contexts/CanvasContext";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  mapSizeText: {
    color: theme.palette.secondary.contrastText
  },
  dropdownStyle: {
    backgroundColor: '#3e4a59'
  },
  selectMenu: {
    color: theme.palette.secondary.contrastText
  },
  menuItemStyle: {
    color: theme.palette.secondary.contrastText
  },
  input: {
    color: theme.palette.secondary.contrastText
  },
  saveMapBtn: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    boxShadow: theme.shadows[5],
    '&:hover' : {
      color:'white',
      backgroundColor: theme.palette.primary.main,
    },
  }
}));

// props comes FROM the mapbuilder page,
// but may be a function that's defined on the mapbuilder page
// data is always handled where the function is defined
function StartMap(props) {
  const { settingsData } = useContext(CanvasContext);
  const { mapSettings, setMapSettings, handleMapSubmit } = settingsData;
  console.log("map settings", mapSettings);

  const classes = useStyles();

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setMapSettings({
      ...mapSettings,
      [name]: name === "rows" || name === "columns" ? parseInt(value) : value,
    });
  };

  const handleCheck = (event) => {
    setMapSettings({
      ...mapSettings,
      [event.target.name]: event.target.checked,
      rows: !mapSettings.infinite ? 1 : parseInt(mapSettings.rows),
      columns: !mapSettings.infinite ? 1 : parseInt(mapSettings.columns),
    });
  };

  const [environmentSelectList, setEnvironmentSelectList] = useState([]);

  useEffect(() => {
    API.getEnvironments(environmentSelectList)
      .then((environments) => {
        setEnvironmentSelectList(environments.data);
      })
      .catch((err) => console.error(err));

  }, []);

  return (
    <FormControl className={classes.formControl}>
      <div>
        <div>
          <FormControl className={classes.formControl}>
            <TextField
              id="standard-basic"
              type="text"
              label="Map Name"
              name="name"
              onChange={handleInputChange}
              value={mapSettings.name}
              required
            />
          </FormControl>
        </div>
        <div>
          <FormControl>
            <InputLabel
              id="demo-simple-select-label"
              style={{
                color: "#707078",
                position: "relative",
                left: "0%",
                top: ".3%",
              }}
            >
              {" "}
              Environment
            </InputLabel>
            <Select
              labelId="select-environment"
              id="select-environment"
              name="environment"
              value={mapSettings.environment}
              onChange={handleInputChange}
              className={classes.selectMenu}
              MenuProps={{
                classes: { paper: classes.dropdownStyle },
                variant: 'menu'
              }}
            >
              {environmentSelectList.map((environment) => (
                <MenuItem
                  key={environment.id}
                  value={environment.id}
                  className={classes.menuItemStyle}
                >
                  {environment.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={mapSettings.infinite}
                  onChange={handleCheck}
                  name="infinite"
                />
              }
              label="Build on an infinite Map?"
              className={classes.selectMenu}
            />
          </FormControl>
          {!mapSettings.infinite ? (
            <>
              <Typography variant="h6" className={classes.mapSizeText}>So what size is your map?</Typography>
              <FormControl className={classes.formControl}>
                <TextField
                  id="standard-basic"
                  type="number"
                  label="Rows"
                  name="rows"
                  onChange={handleInputChange}
                  value={mapSettings.rows}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  id="standard-basic"
                  type="number"
                  label="Columns"
                  name="columns"
                  onChange={handleInputChange}
                  value={mapSettings.columns}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </FormControl>{" "}
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={mapSettings.public}
              onChange={handleCheck}
              name="public"
            />
          }
          label="Share Map With Community"
          className={classes.selectMenu}
        />
      </div>

      <Button
        onClick={(e) => handleMapSubmit(e)}
        className={classes.saveMapBtn}
        style={{marginTop: 10}}
      >
        <Typography variant="h6" style={{fontSize: '16px'}}>
          Save Map Info
        </Typography>
      </Button>
    </FormControl>
  );
}

export default StartMap;
