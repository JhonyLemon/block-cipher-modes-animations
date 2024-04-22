import Modal from "./Modal";

const DataInputModal = (props) => {
    const {enabled, onOutsideClick, data} = props;
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
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            padding: '10px 40px',
                            maxWidth: '50%',
                        }
                    }
                >
                    <h2>Data</h2>
                    {data.isFile() ?
                        <button
                            style={
                                {
                                    minHeight: '30px'
                                }
                            }
                        >
                            <a
                                download={data.file.name}
                                target="_blank"
                                rel="noreferrer"
                                href={URL.createObjectURL(
                                    data.file
                                )}
                                style={{
                                    textDecoration: "inherit",
                                    color: "inherit",
                                }}
                            >
                                Download
                            </a>
                        </button> :
                        <span
                            style={
                                {
                                    margin: '10px 0',
                                    textAlign: 'center'
                                }}
                        >
                            {data.getContentAsString()}
                        </span>
                    }
                </div>
            }
        />
    );
};

export default DataInputModal;