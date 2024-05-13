import {useState} from "react";
import {DEFAULT_DATA, DEFAULT_MODE, AVAILABLE_MODES, DEFAULT_CIPHER_DATA} from "./data/Constants";
import Select from "./components/Select";
import DataInputModal from "./components/DataInputModal";
import DataModal from "./components/DataModal";
import CipherDataInputModal from "./components/CipherDataInputModal";
import AnimationPlayer from "./components/AnimationPlayer";

const App = () => {
    const [dataInputModal, setDataInputModal] = useState(false);
    const [data, setData] = useState(DEFAULT_DATA);

    const [dataModal, setDataModal] = useState(false);
    const [mode, setMode] = useState(DEFAULT_MODE);
    const [cipherDataInputModal, setCipherDataInputModal] = useState(false);
    const [cipherData, setCipherData] = useState(DEFAULT_CIPHER_DATA);
    return (
        <div
            style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
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
                    defaultValue={DEFAULT_MODE}
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
                    onClick={() => setDataModal(true)}
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
                    onClick={() => setDataInputModal(true)}
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
                    onClick={() => setCipherDataInputModal(true)}
                >
                    Cipher data
                </button>
            </div>
            <DataModal
                enabled={dataModal}
                onOutsideClick={() => {
                    setDataModal(false)
                }}
                data={data}
            />
            <DataInputModal
                enabled={dataInputModal}
                onSubmit={data => {
                    setData(data)
                    setDataInputModal(false)
                }}
                onOutsideClick={() => {
                    setDataInputModal(false)
                }}
            />
            <CipherDataInputModal
                enabled={cipherDataInputModal}
                previousData={cipherData}
                onSubmit={data => {
                    setCipherData(data)
                    setCipherDataInputModal(false)
                }}
                onOutsideClick={() => {
                    setCipherDataInputModal(false)
                }}
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
                <AnimationPlayer animation={mode.component.getAnimation(data, cipherData)}/>
            </div>
        </div>
    );
}

export default App;
