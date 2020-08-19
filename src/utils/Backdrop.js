import React from 'react';
import './Backdrop.css';

const Backdrop = (props) => {
    return (
        props.show ? 
        <div className="back-drop">
            <div className="loader "></div>
        </div>
        : 
        null
    );
};

export default Backdrop;