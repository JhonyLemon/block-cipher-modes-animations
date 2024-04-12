import React, { Component } from "react";
import {
    Typography
} from '@mui/material';
import {NavigateFunction} from "react-router-dom";

class Gcm extends Component<{navigate: NavigateFunction}> {

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <Typography variant="h4" gutterBottom>
                    GCM
                </Typography>
            </div>
        );
    }
}

export default Gcm;