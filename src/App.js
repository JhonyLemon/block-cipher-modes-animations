import React, {useState} from "react";
import {
    DEFAULT_DATA,
    DEFAULT_MODE,
    AVAILABLE_MODES,
    KEY, BLOCK_SIZE,
    DEFAULT_PADDING,
} from "./data/Constants";
import Select from "./components/Select";
import {AnimationPlayer, SIDE} from "./components/AnimationPlayer";
import Modal from "react-modal";
import {CipherDataInputModal} from "./components/CipherDataInputModal";
import {DataInputModal} from "./components/DataInputModal";
import {DataModal} from "./components/DataModal";
import {ecb} from "./modes/Ecb";

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

Array.prototype.any = function(func) {
    return this.some(func || function(x) { return x });
}

const elements = {
    boxes: [
        {
            pos: {x: 0.5, y: 0.2},
            title: 'Box A',
            description: 'An initialization vector (IV) or starting variable (SV) is a block of bits that is used by several modes to randomize the encryption and hence to produce distinct ciphertexts even if the same plaintext is encrypted multiple times, without the need for a slower re-keying process.',
            content: {
                data: [
                    'bb2d58f0f6fa40e01cb5df978e8c537c',
                    'This is box A1',
                    'This is box A2'
                ],
                options: {
                    textSize: 12
                }
            }
        },
        {
            pos: {x: 0.2, y: 0.3},
            title: 'Box B',
            description: 'This is box B',
            content: {
                data: [
                    'bb2d58f0f6fa40e01cb5df978e8c537c',
                    'This is box B1',
                    'This is box B2'
                ],
                options: {
                    textSize: 12
                }
            }
        },
        {
            pos: {x: 0.5, y: 0.3},
            title: 'Box C',
            description: 'This is box C',
            content: {
                data: [
                    'bb2d58f0f6fa40e01cb5df978e8c537c',
                    'This is box C1',
                    'This is box C2'
                ],
                options: {
                    textSize: 12
                }
            }
        },
        {
            pos: {x: 0.2, y: 0.4},
            title: 'Box D',
            description: 'This is box D',
            content: {
                data: [
                    'bb2d58f0f6fa40e01cb5df978e8c537c',
                    'This is box D1',
                    'This is box D2'
                ],
                options: {
                    textSize: 12
                }
            }
        },
        {
            pos: {x: 0.5, y: 0.4},
            title: 'Box E',
            description: 'This is box E',
            content: {
                data: [
                    'bb2d58f0f6fa40e01cb5df978e8c537c',
                    'This is box E1',
                    'This is box E2'
                ],
                options: {
                    textSize: 12
                }
            }
        },
        {
            pos: {x: 0.5, y: 0.5},
            title: 'Box F',
            description: 'This is box F',
            content: {
                data: [
                    'bb2d58f0f6fa40e01cb5df978e8c537c',
                    'This is box F1',
                    'This is box F2'
                ],
                options: {
                    textSize: 12
                }
            }
        },
    ],
    connections: [
        {
            from: {boxId: 0, arrowOut: SIDE.DOWN},
            to: {boxId: 2, arrowIn: SIDE.UP},
            connectionColor: 'black',
            arrowSize: 10,
            dotSize: 5,
            dotColor: 'red'
        },
        {
            from: {boxId: 1, arrowOut: SIDE.RIGHT},
            to: {boxId: 2, arrowIn: SIDE.LEFT},
            connectionColor: 'black',
            arrowSize: 10,
            dotSize: 5,
            dotColor: 'red'
        },
        {
            from: {boxId: 2, arrowOut: SIDE.DOWN},
            to: {boxId: 4, arrowIn: SIDE.UP},
            connectionColor: 'black',
            arrowSize: 10,
            dotSize: 5,
            dotColor: 'red'
        },
        {
            from: {boxId: 3, arrowOut: SIDE.RIGHT},
            to: {boxId: 4, arrowIn: SIDE.LEFT},
            connectionColor: 'black',
            arrowSize: 10,
            dotSize: 5,
            dotColor: 'red'
        },
        {
            from: {boxId: 4, arrowOut: SIDE.DOWN},
            to: {boxId: 5, arrowIn: SIDE.UP},
            connectionColor: 'black',
            arrowSize: 10,
            dotSize: 5,
            dotColor: 'red'
        },
    ],
    connectionAnimation: {
        data: [
            {animations: [0, 1]},
            {animations: [2, 3]},
            {animations: [4]},
        ],
        options: {
            speed: 0.25
        }
    },
    contents: 3
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

    const ecbElements = ecb(data, key, iv, blockSize, padding);

    return (
        <div
            style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '1280px',
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
                <AnimationPlayer elements={ecbElements}/>
            </div>

        </div>
    );
}

export default App;
