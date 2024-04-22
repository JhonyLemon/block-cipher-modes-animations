const Modal = (props) => {
    const {enabled, children, onOutsideClick} = props;
    if (!enabled) return null;
    return (
        <div
            style={
                {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }
            }
            onClick={onOutsideClick}
        >
        <div
            style={
                {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }
            }
            onClick={e => e.stopPropagation()}>
            {children}
        </div>
        </div>
    );
};

export default Modal;