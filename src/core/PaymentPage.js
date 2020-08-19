import React, { useState, useEffect } from 'react';
import { emptyCart } from './cartHelpers';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { dispatchSetCartCountAction } from '../actions/cartCount.action';
import { PayPalButton } from "react-paypal-button-v2";
import Layout from './Layout';
import { useHistory } from 'react-router-dom';
import { createOrder } from './apiCore';
import Backdrop from '../utils/Backdrop';

const PaymentPage = (props) => {
    let locationState = props.location.state;
    const history = useHistory();
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;
    const user = isAuthenticated() && isAuthenticated().user;

    useEffect(() => {
        history.listen((newLocation, action) => {
            if (action === 'POP' && newLocation.pathname === '/pay') {
                history.push('/cart');
            }
        });

    }, []);

    const showError = (error) => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            { error }
        </div>
    );
    
    if (locationState !== undefined) 
        return (
            <Layout title="Moguonce" description="Checkout" className="container-fluid text-center">
                <h4>Select a payment method to check out </h4>
                <h6>Your totals: $ {locationState.amount}</h6>
           
                <PayPalButton
            
                    amount={locationState.amount}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onSuccess={ async (details, data) => {
                        console.log("Transaction successfully completed by " + details.payer.name.given_name);
                        setLoading(true);
                        //console.log(data);
                        //console.log(details);
                        try {
                            console.log(locationState.trueCart);

                            // create order
                            const shippingInfo = details.purchase_units[0].shipping;
                            const createOrderData = {
                                products: locationState.trueCart,
                                taxFee: locationState.taxFee,
                                shippingFee: locationState.shippingFee,
                                requiredTotalPay: locationState.amount,

                                paypalOrderId: data.orderID,
                                paypalPayerId: data.payerID,
                                paypalPayerEmail: details.payer.email_address,
                                paypalPayerFirstName: details.payer.name.given_name, // firstname
                                paypalPayerLastName: details.payer.name.surname, // last name
                                paypalPayerPhone: (details.payer.phone && details.payer.phone.phone_number)
                                    ? details.payer.phone.phone_number.national_number : '',

                                actualTotalPay: details.purchase_units[0].amount.value,
                                actualCurrencyCode: details.purchase_units[0].amount.currency_code,

                                shippingFullName: shippingInfo.name.full_name,
                                shippingPostalCode: shippingInfo.address.postal_code,
                                shippingCountryCode: shippingInfo.address.country_code,
                                shippingState: shippingInfo.address.admin_area_1,
                                shippingCity: shippingInfo.address.admin_area_2,
                                shippingStreetAddress: (shippingInfo.address.address_line_2) 
                                    ? shippingInfo.address.address_line_1 + ' ' +
                                    shippingInfo.address.address_line_2
                                    : shippingInfo.address.address_line_1,
                            };
                            
                            // TODO: as well need to consider sending confirmation email to customer
                            // TODO: send email to Admin Order Reciever Email if necessary
                            const createOrderResp = await createOrder(userId, token, createOrderData);

                            emptyCart(() => {
                                // setRun(!run); // run useEffect in parent Cart
                                props.dispatchSetCartCountAction(0);
                            });
                            setLoading(false);
                            history.push({
                                pathname: '/order-success',
                                state: {
                                    userFirstName: user.first_name,
                                    orderId: createOrderResp._id,
                                },
                            });
                        } catch (err) {
                            setError(err.message);
                            setLoading(false);
                        }
                        // OPTIONAL: Call your server to save the transaction
                        // return fetch("/paypal-transaction-complete", {
                        //     method: "post",
                        //     body: JSON.stringify({
                        //         orderID: data.orderID
                        //     }),
                        // });
                    }}
                    options={{
                        // sanbox client id currently...
                        clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID,
                    }}
                />
                <Backdrop show={loading} /> 
                {showError(error)}  
            </Layout>
        );
    else return null;
};

export default connect(null, {
    dispatchSetCartCountAction,

})(PaymentPage);
