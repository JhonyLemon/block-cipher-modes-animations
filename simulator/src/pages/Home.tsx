import React, { Component } from "react";
import {
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    FormHelperText,
    SelectChangeEvent,
    Button,
    Typography
} from '@mui/material';
import {NavigateFunction} from "react-router-dom";
export default class Home extends Component<{navigate: NavigateFunction}> {
    state = {
        mode: ''
    };

    onClick() {
        this.props.navigate('/' + this.state.mode);
    }

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Typography variant="h4" gutterBottom>
                    Choose a Mode
                </Typography>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="mode-selector-label">Mode</InputLabel>
                    <Select
                        labelId="mode-selector-label"
                        id="mode-selector"
                        value={this.state.mode}
                        label="Mode"
                        onChange={(event: SelectChangeEvent)=>this.setState({mode: event.target.value})}
                    >
                        <MenuItem value={'Ecb'}>ECB</MenuItem>
                        <MenuItem value={'Cbc'}>CBC</MenuItem>
                        <MenuItem value={'Gcm'}>GCM</MenuItem>
                        <MenuItem value={'Xtr'}>XTR</MenuItem>
                    </Select>
                    <FormHelperText>Block cipher mode of operation</FormHelperText>
                    <Button
                        variant="contained"
                        color="primary"
                        endIcon={<span>&rarr;</span>}
                        disabled={this.state.mode === ''}
                        onClick={() => this.onClick()}
                    >
                        Next
                    </Button>
                </FormControl>
            </div>
        );
    }
}