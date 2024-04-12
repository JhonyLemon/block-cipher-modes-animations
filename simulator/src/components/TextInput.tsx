import React, { Component } from "react";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

export {};
class TextInput extends Component<{input: string, onTextChange: (input: string)=> void}> {
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <TextareaAutosize
                    minRows={10}
                    maxLength={1000}
                    value={this.props.input}
                    onChange={(event) => {
                        this.props.onTextChange(event.target.value);
                    }}
                    style={{ marginBottom: '20px', width: '400px', maxWidth: '80%', padding: '10px', resize: 'none' }}
                />
            </div>
        );
    }
}
export default TextInput;