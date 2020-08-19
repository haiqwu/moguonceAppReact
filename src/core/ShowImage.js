/* eslint-disable no-restricted-globals */
import React from 'react';
import { API } from '../config';
import './ShowImage.css';

const ShowImage = ({ item, url, width, height, className }) => {

    return (
        <div className="product-img-div">
            <img
                className={`mb-3 prod-img ${className}`}
                src={`${API}/${url}/photo/${item._id}`} 
                alt={item.name} 
                style={{ width: width, height: height }}
            />
        </div>
    );
};

export default ShowImage;


