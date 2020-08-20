import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import './UserDashboard.css';
import { getPurchaseHistory } from './apiUser';
import moment from 'moment';
import { useMediaQuery } from 'react-responsive';

const Dashboard = () => {

    const isMobile = useMediaQuery({ query: `(max-width: 992px)` });

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
                 
                        <Link to="/cart">
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
                <h5 className="card-header"> 
                    My Information {` `}
                    <Link to={{
                        pathname: '/profile',
                        state: {
                            userId: _id,
                        },
                    }}>
                        <svg className="svg-icon" viewBox="0 0 20 20">
                            <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
                        </svg>
                    </Link>
                </h5>
                
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
                { !isMobile &&
                    <div className="col-3">
                        { userLinks() }
                    </div>
                }
                
                <div className={ isMobile ? "" : "col-9"}>
                    { userInfo() }
                    { purchaseHistory(history) }
                </div>
            </div>
            
        </Layout>
    );
};

export default Dashboard;
