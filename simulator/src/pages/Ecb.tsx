import React, { Component } from "react";
import {
    IconButton,
    Typography
} from '@mui/material';
import { Tab } from '@mui/base/Tab';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { Tabs } from '@mui/base/Tabs';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {NavigateFunction} from "react-router-dom";
import TextInput from "../components/TextInput";


import { buttonClasses } from '@mui/base/Button';
import { tabClasses } from '@mui/base/Tab';
import { styled } from '@mui/material/styles';
import Data from "../components/Data";
import {alignProperty} from "@mui/material/styles/cssUtils";

class Ecb extends Component<{navigate: NavigateFunction}> {
    state = {
        input: ''
    };

    handleReturnClick = () => {
        this.props.navigate('/');
    };

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                {/* Return button */}
                <IconButton onClick={this.handleReturnClick} style={{ position: 'absolute', top: '20px', left: '20px', backgroundColor: '#ffffff' }}>
                    <ArrowBackIcon />
                </IconButton>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4" gutterBottom style={{textAlign: 'center'}}>
                        ECB
                    </Typography>
                    <Tabs className="text-center p-2 border border-gray-400 rounded cursor-pointer" defaultValue={0}>
                        <TabsList className="text-center p-2 border border-gray-400 rounded cursor-pointer" style={{ display: 'flex', justifyContent: 'center' }}>
                            <Tab className="text-center p-2 border border-gray-400 rounded cursor-pointer" value={0}>Input</Tab>
                            <Tab className="text-center p-2 border border-gray-400 rounded cursor-pointer" value={1}>Animation</Tab>
                        </TabsList>
                        <TabPanel className="text-center p-2 border border-gray-400 rounded cursor-pointer" value={0}>
                            <TextInput input={this.state.input} onTextChange={(text)=> this.setState({input: text})}/>
                        </TabPanel>
                        <TabPanel className="text-center p-2 border border-gray-400 rounded cursor-pointer" value={1}>
                            <Data values={this.state.input.split("")} size={16}/>
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        );
    }
}
export default Ecb;