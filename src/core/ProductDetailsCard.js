import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import ShowImage from './ShowImage';
import './ProductDetailsCard.css';
import moment from 'moment';
import { addItem, getCart } from './cartHelpers';
import { dispatchSetCartCountAction } from '../actions/cartCount.action';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { ruleQtyValue} from '../utils/rules';


const ProductDetailsCard = ({ product, dispatchSetCartCountAction, $cartCount }) => {
    const [qty, setQty] = useState(1);
    const [redirect, setRedirect] = useState(false);

    const isMobile = useMediaQuery({ query: `(max-width: 992px)` });

    
    const addToCart = () => {
        addItem(product, qty, () => {
            // setRedirect(true);
            // sync the cart number on menu bar 
            dispatchSetCartCountAction($cartCount + (+qty));
        });
    };

    const shouldRedirect = (redirect) => {
        if (redirect) {
            return <Redirect to="/cart" />;
        }
    };

    const alreadyInCart = () => {
        const cartItems = getCart();
        let exists = false;
        cartItems.forEach((i) => {
            if (i._id === product._id) {
                exists = true;
            }
        });
        return exists;
    };

    return (
        <div className="outer-div-pdc">

                { shouldRedirect(redirect) }

                <div className="left-div-pdc">
                    <Link to="#">
                        {/* Maybe show bigger img on click */}
                        <ShowImage item={product} url="product" 
                            width={isMobile ? `250px` : `550px`} 
                            height={isMobile ? `250px` : `550px`} />
                    </Link>
                </div>

                <div className=" right-div-pdc">
                    <p className="product-font">{product.name}</p>

                    <p className="category-name" >
                        {product.category && product.category.name} 
                    </p>
                    
                    <p className="mt-2">{product.description.substring(0, 100)} </p>

                    <p className=" product-font">$ {product.price}</p>
                    
                    {/* <p className="black-8"> Added on { moment(product.createdAt).fromNow() } </p> */}

                    {
                        product.quantity > 0 ? 
                            <span className="badge badge-primary badge-pill">In Stock</span> 
                            : 
                            <span className="badge badge-danger badge-pill">Out Of Stock</span> 
                    }
                    
                  
                    <div className="row pdc-qty">
                        <label htmlFor="quantity-1" className="product-font " >Quantity</label>
                        <input 
                            type="number" 
                            className="form-control pdc-qty-input" 
                            onChange={(e) => {
                                setQty(ruleQtyValue(e.target.value, product.quantity)); 
                            }}
                            value={qty}
                            id="quantity-1"
                        />
                    </div>
                  
                    { product.quantity > 0 && !alreadyInCart() &&
                        <button className="btn btn-outline-success" onClick={addToCart} >
                            Add to cart
                        </button>
                    }
                    {
                        alreadyInCart() && 
                        <Link to="/cart">
                            <button className="btn btn-primary">
                                View Cart
                            </button>
                        </Link>
                    }
                    
                </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
	$cartCount: state.$cartCount,
});

export default connect(mapStateToProps, {
    dispatchSetCartCountAction
})(ProductDetailsCard);
