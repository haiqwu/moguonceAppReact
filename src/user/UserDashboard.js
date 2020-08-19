import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import './UserDashboard.css';
import { getPurchaseHistory } from './apiUser';
import moment from 'moment';

const Dashboard = () => {

    const [history, setHistory] = useState([]);

    const { user: { _id, first_name, last_name, email, role }} = isAuthenticated();
    const token = isAuthenticated().token;

    const init = (userId, token) => {
        getPurchaseHistory(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setHistory(data.sort(byReverseLexicographicalOfCreatedAt));
            }
        })
    };

    useEffect(() => {
        init(_id, token);
    },[]);

    const userLinks = () => {
        return (
            <div className="card">
                {/* <h4 className="card-header">  </h4> */}
                <ul className="list-group">
                    <li className="list-group-item">  
                        <Link className="" to={{
                            pathname: '/profile',
                            state: {
                                userId: _id,
                            },
                        }}>
                            <button className="btn btn-outline-secondary btn-profile">
                                Edit Profile 
                            </button>
                        </Link>
                    </li>
                    <li className="list-group-item"> 

                        <Link className="" to="/cart"> 
                            <button className="btn btn-outline-secondary btn-profile">My Shopping Cart</button> 
                        </Link>
                    </li>
                    
                
                </ul>
            </div>
            
        );
    };

    const userInfo = () => {
        return (
            <div className="card mb-5 text-center">
                <h5 className="card-header"> My Information </h5>
                
                <ul className="list-group">
                    <li className="list-group-item"> First Name: { first_name } </li>
                    <li className="list-group-item"> Last Name: { last_name } </li>
                    <li className="list-group-item">Email: { email } </li>
                    <li className="list-group-item"> {role === 1 ? 'Admin' : 'Registered User'} </li>
                </ul>
            </div>
        );
    };

    const byReverseLexicographicalOfCreatedAt = (a, b) => {
        return (a.createdAt < b.createdAt) ? 1 : ((a.createdAt > b.createdAt) ? -1 : 0);
    };

    const purchaseHistory = (history) => {
        return (
            <div className="card mb-5">
                <h5 className="card-header text-center"> My Orders </h5>
                <ul className="list-group">
                    <li className="list-group-item"> 
                        { history.length < 1 && <>
                            No order yet, <Link to="/shop"> Shop now </Link>
                        </>
                        }
                        { history.length >= 1 && <>
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">Order Id</th>
                                    <th scope="col">Order status</th>
                                    <th scope="col"> Total </th>
                                    <th scope="col"> Order placed </th>
                                    
                                </tr>
                                </thead>
                                <tbody>
                                { history.map((o) => (
                                    <tr key={ o._id }>
                                        <th scope="row">
                                            <Link to={{
                                                pathname: '/order-detail',
                                                state: {
                                                    orderInfo: o,
                                                },
                                            }}>
                                                <span>
                                                    { o._id } 
                                                </span>
                                            </Link>
                                        </th>
                                        <td> { o.status }</td>
                                        <td>$ { o.required_total_pay } </td>
                                        <td>{ moment(o.createdAt).fromNow() }</td>
                                        
                                    </tr>
                                ))
                                }
                                </tbody>
                          </table>
                        </>
                        }   
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout title="Mogu A coco'unt" description={`Good Day! ${first_name}`} className="container-fluid">
            <div className="row">
                <div className="col-3">
                    { userLinks() }
                </div>
                <div className="col-9">
                    { userInfo() }
                    { purchaseHistory(history) }
                </div>
            </div>
            
        </Layout>
    );
};

export default Dashboard;
