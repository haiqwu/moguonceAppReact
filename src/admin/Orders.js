import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { listOrders, getStatusValues, updateOrderStatus } from './apiAdmin';
import moment from 'moment';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusValues, setStatusValues] = useState([]);

    const { user, token } = isAuthenticated()

    const loadOrders = () => {
        listOrders(user._id, token).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setOrders(data);
            }
        })
    };

    const loadStatusValues = () => {
        getStatusValues(user._id, token).then((data) => {
            if (data.error) {
                console.log(data.error)
            } else {
                setStatusValues(data);
            }
        })
    };

    useEffect(() => {
        loadOrders();
        loadStatusValues();
    }, []);

    const showOrdersLength = () => {
        if (orders.length > 0) {
            return (
                <h5 className="text-danger"> Total Orders : {orders.length}  </h5>
            );
        } else {
            return <h5 className="text-danger"> No Orders </h5>
        }
    };

    const showInput = (key, value) => (
        <div className="input-group mb-2 mr-sm-2">
            <div className="input-group-prepend">
                <div className="input-group-text">
                    {key}
                </div>
            </div>
            <input type="text" value={value} className="form-control" readOnly />
        </div>
    );

    const handleStatusChange = (e, orderId) => {
        updateOrderStatus(user._id, token, orderId, e.target.value)
            .then(data => {
                if (data.error) {
                    console.log('Status update failed');
                } else {
                    loadOrders();
                }
            });
    };

    const showStatus = (o) => (
        <div className="form-group">
            <h4 className="mark mb-4">Status: {o.status} </h4>

            Update Status TO:
            <select className="form-control" onChange={(e) => handleStatusChange(e, o._id)} >

                <option> Select </option>
                {statusValues.map((status, index) => (
                    <option key={index} value={status} >
                        {status}
                    </option>
                ))}
            </select>

        </div>

    );


    return (
        <Layout title="Orders" description={`manage all orders: Orders sorted by create date`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    {showOrdersLength()}
                    {orders.map((o, oIndex) => {
                        return (
                            <div className="mt-5" key={oIndex} style={{ borderBottom: '4px solid red' }}>
                                <h2 className="mb-5">
                                    <span className="">
                                        Order ID: {o._id}
                                    </span>
                                </h2>

                                <ul className="list-group mb-2">
                                    <li className="list-group-item">
                                        {showStatus(o)}
                                    </li>
                                    <li className="list-group-item">
                                        Paypal order id:  {o.paypal_order_id}
                                    </li>
                                    <li className="list-group-item">
                                        Required Total Pay: {o.required_total_pay}
                                    </li>
                                    <li className="list-group-item">
                                        Actual Total Pay: {o.actual_pay_currency_code + " " + o.actual_total_pay}
                                    </li>
                                    <li className="list-group-item">
                                        Tax Fee: {o.tax_fee}
                                    </li>
                                    <li className="list-group-item">
                                        Shipping Fee: {o.shipping_fee}
                                    </li>

                                    <li className="list-group-item">
                                        Ordered by: <br /> Last name: {o.user.last_name}  <br />
                                        First name: {o.user.first_name} <br />
                                        UserId: {o.user._id} <br />
                                    </li>
                                    <li className="list-group-item">
                                        Ordered on:{" "}
                                        {moment(o.createdAt).fromNow()}
                                    </li>

                                    <li className="list-group-item">
                                        Delivery address info: {JSON.stringify(o.shipping)}
                                    </li>

                                    <li className="list-group-item">
                                        Paypal payer info: {JSON.stringify(o.paypal_payer_info)}
                                    </li>
                                </ul>

                                <h5 className="mt-4 mb-4 font-italic">

                                </h5>

                                {o.products.map((p, pIndex) => (
                                    <div
                                        className="mb-4"
                                        key={pIndex}
                                        style={{
                                            padding: "20px",
                                            border: "1px solid "
                                        }}
                                    >
                                        {showInput('Product name', p.name)}
                                        {showInput('Product price', p.price)}
                                        {showInput('BOUGHT QUANTITY', p.count)}
                                        {showInput('Product id', p._id)}

                                    </div>
                                ))}





                            </div>
                        )
                    })}

                </div>
            </div>

        </Layout>
    );



}

export default Orders;
