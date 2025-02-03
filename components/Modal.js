import React from 'react';

const Modal = ({ onClose, children }) => {
    return (
        <div className='overlay'>
            <div style={modalStyle}>
                <button onClick={onClose} style={closeButtonStyle}>X</button>
                {children}
            </div>
        </div>
    );
};

const modalStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '4px',
    width: '80%',
    maxWidth: '500px',
    position: 'relative'
};

const closeButtonStyle = {
    position: 'absolute',
    top: '3px',
    right: '3px',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer'
};

export default Modal;
