import React, { useState, useEffect } from 'react';
import Layout from './Layout';

const OrderSuccess = (props) => {
    let locationState = props.location.state;

    if (locationState !== undefined) 
        return (
            <Layout title="Moguonce" description="Order Success" className="container-fluid text-center">
                <div className="alert alert-info">
                    <p> Thank you { locationState.userFirstName }! Your order has been placed! </p>
               
                    <p> Your order ID is : { locationState.orderId }  </p>
                  

                    <p> We are preparing your order and we will send an email with tracking number when we ship it! </p>
                    <p> You can always check your order information, just go to My Info to see your orders </p>
                    <p> Cheers ! </p>
                   

                </div>
            </Layout>
        );
    else return null;
};

export default OrderSuccess;