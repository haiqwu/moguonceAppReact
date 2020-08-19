import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import { addItem, updateItem, removeItem, itemTotal } from './cartHelpers';
import './CartItem.css';
import { ruleQtyValue} from '../utils/rules';
import { dispatchSetCartCountAction } from '../actions/cartCount.action';
import { connect } from 'react-redux';

const CartItem = ({
    product,
    setRun = f => f,
    run = undefined,
    dispatchSetCartCountAction,
    setCartError,
    // changeCartSize
}) => {

    const [count, setCount] = useState(product.count);
    
    const handleChange = productId => event => {
        setRun(!run); // run useEffect in parent Cart
        setCartError('');
        const strictValue = ruleQtyValue(event.target.value, product.quantity);
        setCount(strictValue);
        updateItem(productId, strictValue, () => {
            // callback 
            dispatchSetCartCountAction(itemTotal());
        });
    };

    useEffect(() => {
        setCount(product.count);
    }, [product.count]);

    return (
        <div className="card ">
            <div className="card-header">{product.name}</div>
            <div className="d-flex card-body">
                {/* {shouldRedirect(redirect)} */}
                <div>
                    <ShowImage item={product} url="product" width={`100px`} height={`100px`} />
                </div>
                
                { product.quantity > 0 ? (
                    <div className="badge badge-primary badge-pill disp-inline-tab ml-3 mr-3">
                        In Stock 
                    </div>
                ) : 
                (
                    <div className="badge badge-danger badge-pill disp-inline-tab ml-3 mr-3">
                        Out of Stock 
                    </div>
                )}
                <div>
                    <div className="flex-start-ali"> Each: </div>
                    <div className="flex-end-ali">   $ {product.price}</div>
                </div>
          
                <div>
                    <div className="ml-3 flex-start-ali"> Qty : </div>
                    
                    <input 
                        type="number" 
                        className="form-control flex-end-ali width43 ml-3" 
                        value={count} 
                        onChange={handleChange(product._id)} 
                    />
                </div>
                
                <div className="btn-grp-ci">
                    <Link to={`/product/${product._id}`}  >
                        <button className="btn btn-outline-primary flex-start-ali vi-btn-width">View Item</button>
                    </Link>
                    <div>
                        <button
                            onClick={() => {
                                removeItem(product._id, () => {
                                    dispatchSetCartCountAction(itemTotal());
                                });
                                setRun(!run); // run useEffect in parent Cart
                                setCartError('');
                            }}
                            className="btn btn-outline-danger flex-end-ali"
                        > Remove Item </button>
                    </div>
                </div>

                <div className="ml-3">
                    Total : $ { product.price * count }
                </div>
               
                
            </div>
            { product.specialNote !== undefined &&
                <div className="mb-3 ml-3 text-center text-danger font-weight-bold">
                    { product.specialNote }
                </div>
            }
            
        </div>
    );
};

export default connect(null, {
    dispatchSetCartCountAction,
})(CartItem);