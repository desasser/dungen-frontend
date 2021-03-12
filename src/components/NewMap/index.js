import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button';

//LOOK AT THE MAP TABLE IN THE DB FOR ALL FIELDS.
//ADD SIZE TO THE TABLE

function index() {
    return (
        <FormControl className={classes.formControl}>
            <div>
                <Typography variant="h3">
                    Let's Build a Map
            </Typography>
                <div>
                    <TextField id="standard-basic" type="text" label="name" name="name"
                        onChange={props.handleInputChange}
                    />
                </div>
                <Select
                    native
                    value={state.environment}
                    onChange={handleChange}
                    inputProps={{
                        name: 'Environment',
                        id: '',
                    }}
                >
                    <option aria-label="None" value="" />
                    <option value={10}>Ten</option>
                    <option value={20}>Twenty</option>
                    <option value={30}>Thirty</option>
                </Select>
                <Select
                    native
                    value={state.size}
                    onChange={handleChange}
                    inputProps={{
                        name: 'Size',
                        id: '',
                    }}
                >
                    <option aria-label="None" value="" />
                    <option value={10}>10x10</option>
                    <option value={20}>10x20</option>
                    <option value={30}>20x20</option>
                </Select>
            </div>
            <FormLabel component="legend">Public</FormLabel>
            <RadioGroup aria-label="public" name="public" value={value} onChange={handleChange}>
                <FormControlLabel value="public" control={<Radio />} label="Public Sharing" />
            </RadioGroup>
        </FormControl>
    )
}

export default index
