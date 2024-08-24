import {useRef, useState} from "react";
import Modal from "react-modal";
import {ab2wa, str2wa, wa2str} from "../util/CryptoHelpers";

export const DataInputModal = ({isOpen, setOpen, onClose, previousData, previousFile}) => {
    const [textData, setTextData] = useState((previousFile!==undefined && previousData!==null) ? '' : wa2str(previousData));
    const [fileData, setFileData] = useState(previousData);
    const [file, setFile] = useState(previousFile);
    const [inputMode, setInputMode] = useState((file!==undefined && file!==null) ? 'File' : 'Text');
    const inputFile = useRef(null)
    const fileReader = new FileReader();

    return (
        <Modal
            isOpen={isOpen}
            style={
                {
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)' // make overlay darker
                    },
                    content: {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        border: '1px solid #ccc',
                        background: '#fff',
                        overflow: 'auto',
                        borderRadius: '4px',
                        outline: 'none',
                        padding: '20px'
                    }
                }
            }
            onRequestClose={() => {
                setOpen(false);
                if (inputMode === 'Text') {
                    onClose(str2wa(textData), null);
                } else if(inputMode === 'File' && !(file===undefined || file===null)) {
                    console.log(file)
                    onClose(fileData, file);
                }
            }}
            shouldCloseOnOverlayClick={true}
        >
            <div
                style={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: '0 10px'
                    }
                }
            >
                <select
                    style={
                        {
                            margin: '10px 0',
                            minHeight: '30px',
                            minWidth: '500px',
                            maxWidth: '80%'
                        }
                    }
                    value={inputMode}
                    onChange={event => {
                        setInputMode(event.target.value);
                    }}
                >
                    <option value='Text'>Text</option>
                    <option value='File'>File</option>
                </select>
                {inputMode === 'Text' ? <textarea
                    value={textData}
                    onChange={event => {
                        setTextData(event.target.value);
                        setFile(null);
                    }}
                    placeholder="Enter text to encrypt"
                    style={
                        {
                            minWidth: '500px',
                            minHeight: '300px',
                            height: '100px',
                            resize: 'none',
                            margin: '10px 0',
                            maxWidth: '80%'
                        }
                    }
                /> : null}
                {inputMode === 'File' ? <div>
                    <input
                        type='file'
                        id='file'
                        ref={inputFile}
                        style={{display: 'none'}}
                        onChange={event => {
                            const tempFile = event.target.files[0]
                            if (tempFile) {
                                fileReader.readAsArrayBuffer(tempFile);
                                fileReader.onload = () => {
                                    setFileData(ab2wa(fileReader.result));
                                    setFile(tempFile);
                                }
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            inputFile.current.click();
                        }}
                        style={
                            {
                                padding: '10px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                minWidth: '100px',
                                width: "fit-content",
                                margin: '10px 0'
                            }
                        }
                    >
                        {(file!==undefined && file!==null) ? file.name : 'Choose file'}
                    </button>
                </div> : null}

            </div>
        </Modal>
    );
};