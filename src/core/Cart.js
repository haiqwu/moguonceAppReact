import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import { getCart } from './cartHelpers';
import Checkout from './Checkout';
import { connect } from 'react-redux';
import CartItem from './CartItem';

const Cart = ({ $cartCount }) => {
    const [items, setItems] = useState([]);
    // const [cartSize, setCartSize] = useState([]);
    const [run, setRun] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setItems(getCart());
    }, [run]);

    const cartReload = () => {
        setItems(getCart());
    };
    
    const showItems = items => {
        return (
            <div className=" ">
                { showError(error) }
                <h2> Shopping Cart ({`${$cartCount} Items`})  </h2>
                
                <hr />
                <div className="">
                    { items.map((product, i) => {
                        return (
                            <CartItem
                                key={i}
                                product={product}
                                setRun={setRun}
                                run={run}
                                setCartError={setError}
                                
                                // changeCartSize={changeCartSize}
                            />
                        );
                    })}
                </div>
            </div>
        );
    };
    
    const noItemsMessage = () => (
        <h3>
            Your Cart is empty. 
            <br />
            <Link to="/shop"> Continue shopping. </Link>
        </h3>
    );

    const showError = (error) => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            { error }
        </div>
    );
    
    return (
        <Layout title="Mogu-oncedep-away" description="Checkout now!" className="container-fluid">
            <div className="d-flex flex-wrap">
                <div className="">
                    {items.length > 0 ? showItems(items) : noItemsMessage()}
                </div>
                
                <div className="">
                    
                    {items.length > 0 ? <h2 className="mb-4"> Order Summary</h2> : <></> }
                    <hr />
                    <Checkout products={items} run={run} setRun={setRun} setCartError={setError} cartReload={cartReload}/>
                </div>
            </div>
        </Layout>
    );
};

const mapStateToProps = (state) => ({
	$cartCount: state.$cartCount,
});

export default connect(mapStateToProps, {

})(Cart);
