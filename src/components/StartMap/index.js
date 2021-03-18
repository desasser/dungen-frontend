import React, { useState, useEffect } from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
    }

    const handleMapSubmit = event => {
        console.log("closing tiem")
        API.saveMap(newMap).then(res => {
            console.log("trying to to save a map")

        }).catch(err=> console.error(err))
        props.onClose()

    }

    const handleCheck = event => {
        setMapState({ ...newMap, [event.target.name]: event.target.checked, row: !newMap.infinite ? null : newMap.row , column: !newMap.infinite ? null: newMap.column });
        // setMapState({...newMap, row: null, column: null})
    };



    return (
        <FormControl className={classes.formControl}>
            <div>
                <Typography variant="h4">
                    Let's Get Started
                </Typography>
                <div>
                    <TextField id="standard-basic" type="text" label="Map Name" name="name"
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <FormControl>
                        <InputLabel id="environment"> Environment</InputLabel>
                        <Select
                            native
                            name="environment"
                            // label="Working Environment"
                            onChange={handleInputChange}

                        >
                            <option aria-label="Environment" value="" />
                            <option value={"Environment_1"}>Environment_1</option>
                            <option value={"Environment_2"}>Environment_2</option>
                            <option value={"Environment_3"}>Environment_3</option>
                            <option value={"Environment_4"}>Environment_4</option>
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
                                Then, let's pick a map size.
                    </Typography>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="rows"> Rows </InputLabel>
                                <Select
                                    native
                                    name="row"
                                    onChange={handleInputChange}
                                >
                                    <option aria-label="rows" value="" />
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="columns"> Columns </InputLabel>
                                <Select
                                    native
                                    name="column"
                                    onChange={handleInputChange}
                                >
                                    <option aria-label="rows" value="" />
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                    <option value={20}>20</option>
                                </Select>
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
                onClick={handleMapSubmit}> Start Building! </Button>
        </FormControl>

    )
}

export default StartMap
