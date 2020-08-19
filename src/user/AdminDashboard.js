import React from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const AdminDashboard = () => {

    const { user: { _id, first_name, last_name, email, role }} = isAuthenticated();
    
    const adminLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header"> Admin Account 管理员帐户 </h4>
                <ul className="list-group">
                    
                    <li className="list-group-item"> 

                        <Link className="" to="/create/category"> 
                            <button className="btn btn-outline-secondary btn-profile">
                                Create Category 创建类别 
                            </button> 
                        </Link>
                    </li>
                    <li className="list-group-item">  
                        <Link className="" to="/create/product"> 
                            <button className="btn btn-outline-secondary btn-profile">
                                Create Product 添加产品 
                            </button>
                        </Link>
                    </li>

                    <li className="list-group-item">  
                        <Link className="" to="/admin/orders"> 
                            <button className="btn btn-outline-secondary btn-profile">
                                View Orders 查看全部订单
                            </button>
                        </Link>
                    </li>

                    <li className="list-group-item">  
                        <Link to="/admin/products"> 
                            <button className="btn btn-outline-secondary btn-profile">
                                Manage Products 管理全部商品
                            </button>
                        </Link>
                    </li>

                </ul>
            </div>
        );
    };

    const adminInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header"> Profile </h3>
                
                <ul className="list-group">
                    <li className="list-group-item"> First Name: { first_name } </li>
                    <li className="list-group-item"> Last Name: { last_name } </li>
                    <li className="list-group-item">Email: { email } </li>
                    <li className="list-group-item"> {role === 1 ? 'Admin' : 'Registered User'} </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout title="Mogu A coco'unt" description={`Good Day! ${first_name}`} className="container-fluid">
            <div className="row">
                <div className="col-3">
                    { adminLinks() }
                </div>
                <div className="col-9">
                    { adminInfo() }
                </div>
            </div>
            
        </Layout>
    );
};

export default AdminDashboard;
