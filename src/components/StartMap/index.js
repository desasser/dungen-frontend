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

// props comes FROM the mapbuilder page,
// but may be a function that's defined on the mapbuilder page
// data is always handled where the function is defined
function StartMap(props) {

    const classes = useStyles();

    const savedMap = localStorage.getItem('dungen_map') !== undefined ? JSON.parse(localStorage.getItem('dungen_map')) : null;

    const [newMap, setMapState] = useState({
        name: savedMap !== null ? savedMap.name : "",
        environment: savedMap !== null ? savedMap.environment : '1',
        infinite: savedMap !== null ? savedMap.infinite : true,
        rows: savedMap !== null ? parseInt(savedMap.rows) : 1,
        columns: savedMap !== null ? parseInt(savedMap.columns) : 1,
        public: savedMap !== null ? savedMap.public : true
    });

    useEffect(() => {
        if(savedMap === null) {
            localStorage.setItem( 'dungen_map', JSON.stringify(newMap) )
        } else {
            localStorage.setItem( 'dungen_map', JSON.stringify({...savedMap, ...newMap}) )
        }
    }, [newMap]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setMapState({
            ...newMap,
            [name]: name === 'rows' || name === 'columns' ? parseInt(value) : value
        })
    }

    const handleMapSubmit = event => {
        console.log("form submitted", event)
        API.saveMap(newMap).then(res => {
            console.log("trying to to save a map");

        }).catch(err => console.error(err))
        props.handleMapData(newMap)
    }

    const handleCheck = event => {
        setMapState({ ...newMap, [event.target.name]: event.target.checked, rows: !newMap.infinite ? 1 : parseInt(newMap.rows), columns: !newMap.infinite ? 1 : parseInt(newMap.columns) });
    };

    const [environmentState, setEnvironmentState] = useState(null)
    const [environmentSelectState, setEnvironmentSelectState] = useState([])

    useEffect(() => {
        API.getEnvironments(environmentSelectState).then(environments => {
            setEnvironmentSelectState(environments.data)
            // console.log(environmentSelectState)
        }).catch(err => console.error(err))
        console.log("outside the function " + environmentSelectState)

    }, []);

    // useEffect(() => {
    //     console.log(environmentSelectState)
    // }, [setEnvironmentSelectState])

    return (
        <FormControl className={classes.formControl}>
            <div>

                <div>
                    <FormControl className={classes.formControl}>
                    <TextField id="standard-basic" type="text" label="Map Name" name="name"
                        onChange={handleInputChange}
                        value={newMap.name}
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
                                {environment.name}
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
                                <TextField id="standard-basic" type="number" label="Rows" name="rows"
                                    onChange={handleInputChange}
                                    value={newMap.rows}
                                />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <TextField id="standard-basic" type="number" label="Columns" name="columns"
                                    onChange={handleInputChange}
                                    value={newMap.columns}
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
