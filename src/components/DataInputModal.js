import Modal from "./Modal";
import {Data} from "../models/Data";
import {useRef, useState} from "react";

const DataInputModal = (props) => {
    const {enabled, onOutsideClick, onSubmit, previousData} = props;
    const [data, setData] = useState(previousData);
    const [inputMode, setInputMode] = useState('');
    const inputFile = useRef(null)
    const fileReader = new FileReader();
    return (
        <Modal
            enabled={enabled}
            onOutsideClick={onOutsideClick}
            children={
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
                                minWidth: '300px',
                                maxWidth: '80%'
                            }
                        }
                        value={inputMode}
                        onChange={event => {
                            setInputMode(event.target.value);
                        }}
                    >
                        <option value=''>Select type of data input</option>
                        <option value='Text'>Text</option>
                        <option value='File'>File</option>
                    </select>
                    {inputMode === 'Text' ? <textarea
                        value={data?.getContentAsString()}
                        onChange={event => setData(Data.fromString(event.target.value))}
                        placeholder="Enter text to encrypt"
                        style={
                            {
                                minWidth: '300px',
                                minHeight: '100px',
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
                                        setData(Data.fromFileAndContent(tempFile, fileReader.result));
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
                            {data?.isFile() ? data.getFile().name : 'Choose file'}
                        </button>
                    </div> : null}
                    <button
                        disabled={!data}
                        onClick={() => {
                            onSubmit(data)
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
                    >Save
                    </button>

                </div>
            }
        />
    );
};

export default DataInputModal;