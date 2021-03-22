import React, { useState, useEffect } from "react";
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

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

// props comes FROM the mapbuilder page,
// but may be a function that's defined on the mapbuilder page
// data is always handled where the function is defined
export default function EncounterGeneratorForm(props) {
  const classes = useStyles();

  const savedEncounters =
    localStorage.getItem("dungen_encounters") !== undefined
      ? JSON.parse(localStorage.getItem("dungen_encounters"))
      : null;

  const savedMap =
    localStorage.getItem("dungen_map") !== undefined
      ? JSON.parse(localStorage.getItem("dungen_map"))
      : null;

  const [encounterOptions, setEncounterOptions] = useState({
    n_pc: savedEncounters !== null ? savedEncounters.n_pc : 1, // (number of PCs) 1 - 13
    level: savedEncounters !== null ? savedEncounters.level : 1, // (PC level, avg) 1 - 20
    difficulty: savedEncounters !== null ? savedEncounters.difficulty : "any", // any, easy, medium, hard, deadly
    environment: savedMap !== null ? savedMap.environment : "Arctic", // there's like 19, I'm not listing them all here
    treasure: savedEncounters !== null ? savedEncounters.treasure : false, // true or false,
    loot_type: savedEncounters !== null ? savedEncounters.loot_type : "", // null or Individual+Treasure or Treasure+Hoard
    number: 1, // number of encounters to generate
  });

  const n_pc = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  const level = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
  ];
  const difficulty = ["any", "easy", "medium", "hard", "deadly"];
  const environments = [
    "Arctic",
    "Coastal",
    "Desert",
    "Forest",
    "Grassland",
    "Hill",
    "Jungle",
    "Mountain",
    "Swamp",
    "Underdark",
    "Underwater",
    "Urban",
    "Celestial Plane",
    "Abyssal Plane",
    "Infernal Plane",
    "Elemental Air",
    "Elemental Earth",
    "Elemental Fire",
    "Elemental Water",
  ];
  const loot = ["Individual Treasure", "Treasure Hoard"];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEncounterOptions({
      ...encounterOptions,
      [name]: value,
    });
    console.log(event.target.name);
    console.log(event.target.value);
  };

  const handleCheck = (event) => {
    setEncounterOptions({
      ...encounterOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleEncounterSubmit = (event) => {
    console.log("::EncGenForm.53:: generating encounter(s)");

    API.getEncounters(encounterOptions)
      .then((results) => {
        console.log("::EncGenForm.68:: GENERATED ENCOUNTERS");
        console.log(results);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    console.log(environmentSelectState);
  }, [setEnvironmentSelectState]);

  return (
    <FormControl className={classes.formControl}>
      <div>
        {/* SELECT */}
        <div>
          <FormControl>
            <InputLabel
              style={{
                color: "#707078",
                position: "relative",
                left: "0%",
                top: ".3%",
              }}
            >
              {" "}
              Number of PCs
            </InputLabel>
            <Select
              labelId="select-n_pc"
              id="select-n_pc"
              name="n_pc"
              value={encounterOptions.n_pc}
              onChange={handleInputChange}
              className={classes.selectMenu}
            >
              {n_pc.map((num) => (
                <MenuItem
                  key={num}
                  value={num}
                  className={classes.menuItemStyle}
                >
                  {num} PCs
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* SELECT */}
        <div>
          <FormControl>
            <InputLabel
              style={{
                color: "#707078",
                position: "relative",
                left: "0%",
                top: ".3%",
              }}
            >
              {" "}
              PC level
            </InputLabel>
            <Select
              labelId="select-level"
              id="select-level"
              name="level"
              value={encounterOptions.level}
              onChange={handleInputChange}
              className={classes.selectMenu}
            >
              {level.map((num) => (
                <MenuItem
                  key={num}
                  value={num}
                  className={classes.menuItemStyle}
                >
                  Level {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* checkbox */}
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={encounterOptions.treasure}
              onChange={handleCheck}
              name="treasure"
            />
          }
          label="Want Treasure?"
        />
      </div>

      {encounterOptions.treasure ? (
        <>
          {/* SELECT */}
          <div>
            <FormControl>
              <InputLabel
                style={{
                  color: "#707078",
                  position: "relative",
                  left: "0%",
                  top: ".3%",
                }}
              >
                {" "}
                Treasure Type
              </InputLabel>
              <Select
                labelId="select-level"
                id="select-level"
                name="level"
                value={encounterOptions.loot_type}
                onChange={handleInputChange}
                className={classes.selectMenu}
              >
                {loot.map((loot) => {
                  let loot_val = loot.split(" ").join("+"); 
                  (<MenuItem
                    key={loot_val}
                    value={loot_val}
                    className={classes.menuItemStyle}
                  >
                    {loot}
                  </MenuItem>)
                })}
              </Select>
            </FormControl>
          </div>
        </>
      ) : (
        ""
      )}

      <Button onClick={(e) => handleEncounterSubmit(e)}>
        Generate Encounter(s)
      </Button>
    </FormControl>
  );
}
