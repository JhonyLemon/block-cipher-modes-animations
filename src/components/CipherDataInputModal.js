import {useState} from "react";
import Modal from "react-modal";
import {
    AVAILABLE_PADDING,
    BLOCK_SIZE_DESCRIPTION,
    IV,
    IV_DESCRIPTION,
    KEY,
    KEY_DESCRIPTION,
    PADDING_DESCRIPTION
} from "../data/Constants";
import {Tooltip} from 'react-tooltip'
import Select from "./Select";
import information from "../information.png";

export const CipherDataInputModal = ({
                                         isOpen,
                                         setOpen,
                                         onClose,
                                         previousKey,
                                         previousIv,
                                         previousBlockSize,
                                         previousPadding
                                     }) => {
    const [key, setKey] = useState(previousKey);
    const [iv, setIv] = useState(previousIv);
    const [blockSize, setBlockSize] = useState(previousBlockSize);
    const [padding, setPadding] = useState(previousPadding);
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
                if (!isBlockSizeValid(blockSize)) {
                    setBlockSize(previousBlockSize);
                }
                if (!isKeyValid(key, blockSize)) {
                    setKey(previousKey);
                }
                if (!isIVValid(iv, blockSize)) {
                    setIv(previousIv);
                }
                onClose(key, iv, blockSize, padding);
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
                        padding: '10px 10px'
                    }
                }
            >

                <div style={{display: 'flex', alignItems: 'center'}}>
                    <label style={{margin: 0}}>Block size</label>
                    <img data-tooltip-id='blockSize' src={information} alt="Info"
                         style={{height: '15px', width: '15px', marginLeft: '5px'}}/>
                </div>
                <Tooltip id='blockSize' variant={'dark'}>
                    <div style={{
                        maxWidth: '200px'
                    }}
                    >
                        {BLOCK_SIZE_DESCRIPTION}
                    </div>
                </Tooltip>
                <select
                    disabled={true}
                    defaultValue={blockSize}
                    onChange={event => {
                        setBlockSize(event.target.value)
                    }}
                    style={
                        {
                            margin: '10px 0',
                            minHeight: '30px',
                            minWidth: '300px',
                            maxWidth: '80%'
                        }
                    }
                >
                    <option>128</option>
                    <option>192</option>
                    <option>256</option>
                </select>
                <label
                    style={
                        {
                            color: 'red',
                            display: isBlockSizeValid(blockSize) ? 'none' : 'block'
                        }
                    }
                >Invalid key size</label>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <label style={{margin: 0}}>Padding</label>
                    <img data-tooltip-id='padding' src={information} alt="Info"
                         style={{height: '15px', width: '15px', marginLeft: '5px'}}/>
                </div>
                <Tooltip id='padding' variant={'dark'}>
                    <div style={{
                        maxWidth: '200px'
                    }}
                    >
                        {PADDING_DESCRIPTION}
                    </div>
                </Tooltip>
                <Select
                    disabled={true}
                    defaultValue={0}
                    options={AVAILABLE_PADDING}
                    onChange={selectedMode => {
                        setPadding(selectedMode)
                    }}
                    style={
                        {
                            margin: '10px 0',
                            minHeight: '30px',
                            minWidth: '300px',
                            maxWidth: '80%'
                        }
                    }
                />
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <label style={{margin: 0}}>Key (as hexadecimal string)</label>
                    <img data-tooltip-id='key' src={information} alt="Info"
                         style={{height: '15px', width: '15px', marginLeft: '5px'}}/>
                </div>
                <Tooltip id='key' variant={'dark'}>
                    <div style={{
                        maxWidth: '200px'
                    }}
                    >
                        {KEY_DESCRIPTION}
                    </div>
                </Tooltip>
                <div
                    style={
                        {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }
                    }
                >
                    <input
                        value={key}
                        onChange={event => {
                            setKey(event.target.value)
                        }}
                        style={
                            {
                                margin: '10px 0',
                                minHeight: '30px',
                                minWidth: '300px',
                                maxWidth: '80%'
                            }
                        }
                    />
                    <button
                        onClick={() => {
                            setKey(KEY())
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
                    >Refresh
                    </button>
                </div>

                <label
                    style={
                        {
                            color: 'red',
                            display: isKeyValid(key, blockSize) ? 'none' : 'block'
                        }
                    }
                >Invalid key</label>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <label style={{margin: 0}}>Iv (as hexadecimal string)</label>
                    <img data-tooltip-id='padding' src={information} alt="Info"
                         style={{height: '15px', width: '15px', marginLeft: '5px'}}/>
                </div>
                <Tooltip id='padding' variant={'dark'}>
                    <div style={{
                        maxWidth: '200px'
                    }}
                    >
                        {IV_DESCRIPTION}
                    </div>
                </Tooltip>
                <div
                    style={
                        {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }
                    }
                >
                    <input
                        value={iv}
                        onChange={event => {
                            setIv(event.target.value)
                        }}
                        style={
                            {
                                margin: '10px 0',
                                minHeight: '30px',
                                minWidth: '300px',
                                maxWidth: '80%'
                            }
                        }
                    />
                    <button
                        onClick={() => {
                            setIv(IV())
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
                    >Refresh
                    </button>
                </div>
                <label
                    style={
                        {
                            color: 'red',
                            display: isIVValid(iv, blockSize) ? 'none' : 'block'
                        }
                    }
                >Invalid iv</label>

            </div>
        </Modal>
    );
};

const isHexadecimal = (character) => {
    return (character >= '0' && character <= '9') || (character >= 'a' && character <= 'f');
}

const isKeyValid = (key, blockSize) => {
    if (key.length !== blockSize / 4) {
        return false;
    }
    if (key === "") {
        return false;
    }
    for (let i = 0; i < key.length; i++) {
        if (!isHexadecimal(key[i])) {
            return false;
        }
    }
    return true;
}

const isIVValid = (iv, blockSize) => {
    if (iv.length !== blockSize / 4) {
        return false;
    }
    if (iv === "") {
        return false;
    }
    for (let i = 0; i < iv.length; i++) {
        if (!isHexadecimal(iv[i])) {
            return false;
        }
    }
    return true;
}

const isBlockSizeValid = (blockSize) => {
    return blockSize === 128 || blockSize === 192 || blockSize === 256;
}