import React, { Component } from "react";
import {
    Typography
} from '@mui/material';
import {NavigateFunction} from "react-router-dom";

class Cbc extends Component<{navigate: NavigateFunction}> {

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Typography variant="h4" gutterBottom>
                    CBC
                </Typography>
            </div>
        );
    }
}

export default Cbc;