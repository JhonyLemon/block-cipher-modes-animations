import React, {useEffect, useState} from "react";
import {
    DEFAULT_DATA,
    DEFAULT_MODE,
    AVAILABLE_MODES,
    KEY, BLOCK_SIZE,
    DEFAULT_PADDING, MODE_DESCRIPTION,
} from "./data/Constants";
import Select from "./components/Select";
import {AnimationPlayer, SIDE} from "./components/AnimationPlayer";
import Modal from "react-modal";
import {CipherDataInputModal} from "./components/CipherDataInputModal";
import {DataInputModal} from "./components/DataInputModal";
import {DataModal} from "./components/DataModal";
import information from "./information.png";
import {Tooltip} from "react-tooltip";
import {sha1} from "object-hash";

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

Array.prototype.anyMatch = function(func) {
    return this.some(func || function(x) { return x });
}

const App = () => {
    const [key, setKey] = useState(KEY());
    const [iv, setIv] = useState(KEY());
    const [blockSize, setBlockSize] = useState(BLOCK_SIZE);
    const [padding, setPadding] = useState(DEFAULT_PADDING);
    const [mode, setMode] = useState(DEFAULT_MODE);

    const [data, setData] = useState(DEFAULT_DATA);
    const [file, setFile] = useState(null);

    const [isDataModalOpen, setDataModalOpen] = useState(false);
    const [isDataInputModalOpen, setDataInputModalOpen] = useState(false);
    const [isCipherDataModalOpen, setCipherDataModalOpen] = useState(false);

    Modal.setAppElement('#root');

    const [elements, setElements] = useState(mode.animation(data,key,iv,blockSize,padding));
    const [elementsHash, setElementsHash] = useState(sha1(elements));

    useEffect(() => {
        const newElements = mode.animation(data,key,iv,blockSize,padding);
        const newElementsHash = sha1(newElements);
        if (newElementsHash !== elementsHash) {
            setElements(newElements);
            setElementsHash(newElementsHash);
        }
    }, [key, iv, blockSize, padding, mode, data, file]);

    return (
        <div
            style={
                {
                    margin: '0',
                    padding: '0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%'
                }
            }
        >
            <div
                style={
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }
                }
            >
                <img data-tooltip-id='mode' src={information} alt="Info"
                         style={{height: '25px', width: '25px', marginRight: '5px'}}/>
                <Tooltip id='mode' variant={'dark'}>
                    <div style={{
                        maxWidth: '200px'
                    }}
                    >
                        {[MODE_DESCRIPTION,'',mode.description].map((line, index) => (<p key={index}>{line}</p>))}
                    </div>
                </Tooltip>
                <Select
                    defaultSelected={0}
                    options={AVAILABLE_MODES}
                    onChange={selectedMode => {
                        setMode(selectedMode)
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
                </Select>
                <button
                    style={
                        {
                            margin: '10px 0',
                            minHeight: '30px',
                            minWidth: '100px',
                            maxWidth: '20%'
                        }
                    }
                    onClick={() => setDataModalOpen(true)}
                >
                    Show data
                </button>
                <button
                    style={
                        {
                            margin: '10px 0',
                            minHeight: '30px',
                            minWidth: '100px',
                            maxWidth: '20%'
                        }
                    }
                    onClick={() => setDataInputModalOpen(true)}
                >
                    Refresh data
                </button>
                <button
                    style={
                        {
                            margin: '10px 0',
                            minHeight: '30px',
                            minWidth: '100px',
                            maxWidth: '20%'
                        }
                    }
                    onClick={() => setCipherDataModalOpen(true)}
                >
                    Cipher data
                </button>
            </div>
            <CipherDataInputModal
                isOpen={isCipherDataModalOpen}
                setOpen={setCipherDataModalOpen}
                onClose={(key, iv, blockSize, padding) => {
                    setKey(key);
                    setIv(iv);
                    setBlockSize(blockSize);
                    setPadding(padding);
                }}
                previousKey={key}
                previousIv={iv}
                previousBlockSize={blockSize}
                previousPadding={padding}
            />
            <DataInputModal
                isOpen={isDataInputModalOpen}
                setOpen={setDataInputModalOpen}
                onClose={(data, isFile) => {
                    setData(data);
                    setFile(isFile);
                }}
                previousData={data}
                previousIsFile={file}
            />
            <DataModal
                isOpen={isDataModalOpen}
                setOpen={setDataModalOpen}
                data={data}
                file={file}
            />
            <div
                style={
                    {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }
                }
            >
                <AnimationPlayer elements={elements} elementsHash={elementsHash}/>
            </div>

        </div>
    );
}

export default App;
