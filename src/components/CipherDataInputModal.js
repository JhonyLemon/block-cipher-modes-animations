import Modal from "./Modal";
import {useState} from "react";
import Select from "./Select";
import {Padding} from "../models/Padding";
import {generateIv, generateKey} from "../util/CryptoHelpers";
import {CipherData} from "../models/CipherData";

const CipherDataInputModal = (props) => {
    const {enabled, onOutsideClick, onSubmit, previousData} = props;
    const [key, setKey] = useState(previousData.key);
    const [iv, setIv] = useState(previousData.iv);
    const [blockSize, setBlockSize] = useState(previousData.blockSize);
    const [padding, setPadding] = useState(previousData.padding);
    return (
        <Modal
            enabled={enabled}
            onOutsideClick= {() => {
                setKey(previousData.key)
                setIv(previousData.iv)
                setBlockSize(previousData.blockSize)
                setPadding(previousData.padding)
                onOutsideClick()
            }}
            children={
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

                    <label>Key size</label>
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
                    <label>Padding</label>
                    <Select
                        disabled={true}
                        defaultValue={Padding.ZERO}
                        options={Padding.PADDINGS}
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
                    <label
                        style={
                            {
                                color: 'red',
                                display: isPaddingValid(padding) ? 'none' : 'block'
                            }
                        }
                    >Invalid padding</label>
                    <label>Key (as hexadecimal string)</label>
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
                                setKey(generateKey(blockSize))
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
                        >Refresh</button>
                    </div>

                    <label
                        style={
                            {
                                color: 'red',
                                display: isKeyValid(key, blockSize) ? 'none' : 'block'
                            }
                        }
                    >Invalid key</label>
                    <label>Iv (as hexadecimal string)</label>
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
                                setIv(generateIv(blockSize))
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
                        >Refresh</button>
                    </div>
                    <label
                        style={
                            {
                                color: 'red',
                                display: isIVValid(iv, blockSize) ? 'none' : 'block'
                            }
                        }
                    >Invalid iv</label>
                    <button
                        disabled={!isValid(key, iv, blockSize, padding)}
                        onClick={() => {
                            onSubmit(new CipherData(key, iv, blockSize, padding))
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

const isPaddingValid = (padding) => {
    return Padding.PADDINGS.includes(padding);
}

const isValid = (key, iv, blockSize, padding) => {
    return isKeyValid(key, blockSize) && isIVValid(iv, blockSize) && isBlockSizeValid(blockSize) && isPaddingValid(padding);
}

export default CipherDataInputModal;