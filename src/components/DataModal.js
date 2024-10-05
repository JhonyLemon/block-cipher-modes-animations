import Modal from "react-modal";
import {wa2str} from "../util/Helpers";
import {DATA_MODAL_DESCRIPTION} from "../data/Constants";
import {Tooltip} from "react-tooltip";
import information from "../information.png";
import React from "react";

export const DataModal = ({isOpen, setOpen, data, file}) => {
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
            onRequestClose={() => setOpen(false)}
            shouldCloseOnOverlayClick={true}
        >
            <div
                style={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        padding: '0 10px',
                        minWidth: '300px',
                        minHeight: '200px',
                    }
                }
            >
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <h2>Data for encryption</h2>
                    <img data-tooltip-id='dataDisplay' src={information} alt="Info"
                         style={{height: '15px', width: '15px', marginLeft: '5px'}}/>
                </div>
                <Tooltip id='dataDisplay' variant={'dark'}>
                    <div style={{
                        maxWidth: '200px'
                    }}
                    >
                        {DATA_MODAL_DESCRIPTION}
                    </div>
                </Tooltip>

                {(file !== undefined && file !== null) ?
                    <button
                        style={
                            {
                                minHeight: '30px',
                            }
                        }
                    >
                        <a
                            download={file.name}
                            target="_blank"
                            rel="noreferrer"
                            href={URL.createObjectURL(
                                file
                            )}
                            style={{
                                textDecoration: "inherit",
                                color: "inherit",
                            }}
                        >
                            {file.name}
                        </a>
                    </button> :
                    <span
                        style={
                            {
                                margin: '10px 0',
                                textAlign: 'center',
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #ccc',
                                overflowY: 'auto', // This will add vertical scroll if needed
                                maxHeight: '200px' // Set to desired max height
                            }}
                    >
                            {wa2str(data)}
                        </span>
                }
            </div>
        </Modal>
    );
};