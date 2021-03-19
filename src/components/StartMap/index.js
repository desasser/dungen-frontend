import React, { useState, useEffect } from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { MapOutlined } from '@material-ui/icons';
import API from '../../utils/API';




const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(2),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));



//NOTE: Props are coming from the Map builder page? or TO the MapBuilder Page?

function StartMap(props) {

    const classes = useStyles();

    const [newMap, setMapState] = useState({
        name: "",
        environment: "",
        infinite: true,
        row: null,
        column: null,
        public: false,
        init: true
    })



    const handleInputChange = event => {
        const { name, value } = event.target;
        setMapState({
            ...newMap,
            [name]: value
        })
        console.log(event.target.name)
        console.log(event.target.value)
    }

    const handleMapSubmit = event => {
        console.log("form submitted", event)
        API.saveMap(newMap).then(res => {
            console.log("trying to to save a map");

        }).catch(err => console.error(err))

        props.onClose(newMap)
    }

    const handleCheck = event => {
        setMapState({ ...newMap, [event.target.name]: event.target.checked, row: !newMap.infinite ? null : newMap.row, column: !newMap.infinite ? null : newMap.column });
        // setMapState({...newMap, row: null, column: null})
    };

    const [environmentState, setEnvironmentState] = useState(null)
    const [environmentSelectState, setEnvironmentSelectState] = useState([])

    // const handleChangeEnvironment = (event) => {
    //     setTileSetState(event.target.value);
    //   };

    //  useEffect(() => {
    //      //getting the list of available environments to use in the select dropdown later.
    //     API.getEnvironments(environmentState)
    //     .then(environments => {
    //         const existingEnvironments = environments.data;
    //         let environmentList =[];
    //         for (let i = 0; i < environmentList.length; i++) {
    //             const locations = {
    //                 key: i,
    //                 name: environmentList[i].name,
    //                 thumbnail_url: environmentList[i].thumbnail_url,
    //                 }
    //                 environmentList.push(existingEnvironments);
    //         }
    //             setEnvironmentState(existingEnvironments)
    //             console.log(environmentState)
    //     })
    //     console.log(environmentState)
    //  }, [] )

    useEffect(() => {
        API.getEnvironments(environmentSelectState).then(environments => {
            setEnvironmentSelectState(environments.data)
            console.log(environmentSelectState)
        }).catch(err => console.error(err))
        console.log("outside the function " + environmentSelectState)

    }, []);

    useEffect(() => {
        console.log(environmentSelectState)
    }, [setEnvironmentSelectState])

    return (
        <FormControl className={classes.formControl}>
            <div>

                <div>
                    <FormControl className={classes.formControl}>
                    <TextField id="standard-basic" type="text" label="Map Name" name="name"
                        onChange={handleInputChange}
                    />
                    </FormControl>
                </div>
                <div>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label" style={{ color: '#707078', position: 'relative', left: '0%', top: '.3%' }}> Environment</InputLabel>
                        <Select

                            labelId="select-environment"
                            id="select-environment"
                            name="environment"
                            value={newMap.environment}
                            onChange={handleInputChange}
                            className={classes.selectMenu}
                        >
                            {environmentSelectState.map(environment => <MenuItem
                                key={environment.id}
                                value={environment.id}
                                className={classes.menuItemStyle}

                            >
                                {environment.name.charAt(0).toUpperCase() + environment.name.slice(1)}
                            </MenuItem>)}
                        </Select>

                    </FormControl>
                </div>
                <div>

                    <FormControl>

                        <FormControlLabel
                            control={<Checkbox
                                checked={newMap.infinite}
                                onChange={handleCheck}
                                name="infinite" />}
                            label="Build on an infinite Map?"
                        />
                    </FormControl>
                    {!newMap.infinite ?
                        <>
                            <Typography variant="h6">
                                So what size is your map?
                    </Typography>

                            <FormControl className={classes.formControl}>
                                <TextField id="standard-basic" type="number" label="Rows" name="row"
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField id="standard-basic" type="number" label="Columns" name="column"
                                    onChange={handleInputChange}
                                />
                            </FormControl> </> : ""}
                </div>
            </div>
            <div>
                <FormControlLabel
                    control={<Checkbox
                        checked={newMap.public}
                        onChange={handleCheck}
                        name="public" />}
                    label="Share Map With Community"
                />
            </div>

            <Button
                // onClick={props.onClose} 
                onClick={(e) => handleMapSubmit(e)}> Save Map Info 
                </Button>
        </FormControl>

    )
}

export default StartMap
