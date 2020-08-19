/* eslint-disable no-throw-literal */
import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getProductsByIds } from './apiCore';
import Backdrop from '../utils/Backdrop';
import { getCart } from './cartHelpers';
import { useHistory } from 'react-router-dom';

const Checkout = ({ products, setRun = f => f, run = undefined, setCartError, cartReload }) => {
    const [data, setData] = useState({
        loading: false,
    });
    const [shippingFee, setShippingFee] = useState(0);
    const [taxFee, setTaxFee] = useState(0);
    const history = useHistory();

    const getCartSubtotal = () => {
        return products.reduce((acc, nextValue) => {
            return acc + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div> { showOrderSummary() } </div>
        ) : (
            <Link to="/signin">
                {/* In this case will direct user to log in */}
                <button className="btn btn-primary"> Proceed to checkout </button>
            </Link>
        );
    };
 
    const calculateTotals = () => {
        return getCartSubtotal() + shippingFee + taxFee;
    };

    const handleProceedToCheckout = async () => {
        setData({ ...data, loading: true }); 
        const cart = getCart();
        // console.log('cart  ', cart);
        const idsArray = [];
        cart.forEach((i) => {
            idsArray.push(i._id);
        });
        const reqBody = { ids: idsArray };
        try {
            const respArray = await getProductsByIds(reqBody);
            
            respArray.forEach((r) => {
                const cartItem = cart.find((c) => { return c._id === r._id; });
                // check (1/1) property count validity
                if ( isNaN(cartItem.count) || cartItem.count < 1 || !Number.isInteger(cartItem.count) ) {
                    throw 'Qty invalid';
                }
                // valid then, take (1/1) property count to true array
                r.count = cartItem.count;
            });

            // next, check stock:
            // if stock okay then redirect, else add specialNote to cart item
            // and call cartReload (from parent) to reload page
            let itemOutOfStock = false;
            respArray.forEach((r) => {
                if (r.quantity < r.count) {
                    itemOutOfStock = true;
                    if (r.quantity <= 0) {
                        r.specialNote = 'Out of Stock now. You may remove it from cart.';
                    } else {
                        r.specialNote = `Only ${r.quantity} items left in stock.`;
                    }
                }
            });
            if (itemOutOfStock) {
                localStorage.setItem('cart', JSON.stringify(respArray));
                cartReload();
                throw 'Sorry, some of your items are out of stock, please adjust quantity or remove item.';
            }
            // else
            // respArray is ready
            // console.log('resp', respArray);
            const trueSubtotal = respArray.reduce((acc, nextValue) => {
                return acc + nextValue.count * nextValue.price;
            }, 0);
            const trueGrandTotal = trueSubtotal + shippingFee + taxFee;

            history.push({
                pathname: '/pay',
                state: {
                    amount: trueGrandTotal,
                    taxFee: taxFee,
                    shippingFee: shippingFee,
                    trueCart: respArray,
                }
            });
        } catch (err) {
            console.log(err);
            setData({
                ...data,
                loading: false,
            });
            setCartError(err);

        }
    };

    const showOrderSummary = () => (
        <div>

            { products.length > 0 ? (
                <div>
                    <p> Subtotal: $ { getCartSubtotal() }</p>
                    <p> Shipping: $ {shippingFee} <span style={{color: 'red'}}>(Free shipping on order over $100)</span></p> 
                    <p> Estimated Tax: $ {taxFee} </p>
                    <p> Estimated Total: $ { calculateTotals() } </p>




                    <div className="form-group">
                        <h4> Shipping Method </h4>
                        <input id="radio-1" type="radio" name="shipping-radio" defaultChecked  
                            
                        />
                        <label  htmlFor="radio-1" className="form-control-label" >Standard Shipping</label>
{/* 
                        <input id="radio-2" type="radio" name="shipping-radio"  
                            
                        />
                        <label htmlFor="radio-2" className="form-control-label" >Express Shipping</label> */}
                    </div>

                    <button className="btn btn-success btn-block" onClick={handleProceedToCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            ) : null }
        </div>
    );

    const showLoading = (loading) => 
        loading && <Backdrop show={true} /> ;

    return (
        <div>
          
            {showLoading(data.loading)}
         
            
 
            {showCheckout()}
        </div>
    );
};

export default connect(null, {
})(Checkout);
