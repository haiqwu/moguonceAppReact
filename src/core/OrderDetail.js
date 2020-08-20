import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import moment from 'moment';
import OrderedItem from './OrderedItem';
import { useMediaQuery } from 'react-responsive';

const OrderDetail = (props) => {
    const locationState = props.location.state;
    const order = locationState ? locationState.orderInfo : undefined;
    const isMobile = useMediaQuery({ query: `(max-width: 992px)` });

    const numItems = (products) => {
        return products.reduce((acc, nextValue) => {
            return acc + nextValue.count;
        }, 0);
    };

    if (locationState === undefined) {
        return null;
    }
    return (
        <Layout title="Moguonce" description="Order Detail" className="container-fluid mb-5">
        <div className="d-flex flex-wrap">
            <div className={ isMobile ? '' : 'col'}>
                <div className="alert alert-info text-center" role="alert">
                    <h4> Order # {order._id} </h4>         
                    <div> placed at { moment(order.createdAt).format('MMMM Do YYYY, h:mm:ss a') } </div>       
                </div>

                <div className="alert alert-success text-center" role="alert">
                    Order Status: <span className="font-weight-bold">{order.status}</span>
                </div>

                <div className="alert alert-success text-center" role="alert">
                    <p><span className="font-weight-bold">{ numItems(order.products) } </span>item(s) will be shipped to :</p>
                    <div>{order.shipping.full_name}</div>
                    <span>{order.shipping.street_address}</span>
                    <div>{order.shipping.city} , {order.shipping.state}</div>
                    <span>{order.shipping.postal_code} , {order.shipping.country_code}</span>
                </div>
                <div className="mb-5">
                    { order.products.map((p) => (
                        <OrderedItem className="text-center"
                            key={p._id}
                            product={p}
                        />

                    ))}
                </div>
            </div>
            
            <div className={ isMobile ? '' : 'col-5'}>
                <h4>Order Details</h4>
                <p> Order Subtotal: $ {order.required_total_pay - order.tax_fee - order.shipping_fee} </p>
                <p> Tax : $ {order.tax_fee} </p>
                <p>Shipping: $ {order.shipping_fee} </p>
                <p> Grand Total: $ {order.required_total_pay} </p>

                
                <h4>Transaction details</h4>
                <p>Payment Currency {order.actual_pay_currency_code}</p>
                <p> Transaction Charge {order.actual_pay_currency_code} {order.actual_total_pay}  </p>
                
                <h4> Returns/Replace Item </h4>
            </div>
            
        
        </div>
 
            
        </Layout>
    );
};

export default OrderDetail;
