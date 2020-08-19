import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ShowImage from './ShowImage';

const OrderedItem = ({ product }) => {
    return (
       
        <div className="card ">
            <div className="card-header">{product.name} * {product.count}</div>
            <div className="d-flex card-body">
                
                <div>
                    <ShowImage item={product} url="product" width={`100px`} height={`100px`} />
                </div>
      
                <div>
                    <div className="ml-3">   $ {product.price} </div>
                    
                </div>
      
           
                
                <div className="ml-3">
                    Subtotal : $ { product.price * product.count }
                </div>

                
                <Link to={`/product/${product._id}`} >
                    <button className="btn btn-outline-primary ml-5"> View Item </button>
                </Link>
           
             
               
            </div>
    
        </div>
    );
};

export default OrderedItem;
