import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from './apiAdmin';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);

    const { user, token } = isAuthenticated();

    const loadProducts = () => {
        getProducts().then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setProducts(data);
            }
        })
    };

    useEffect(() => {
        loadProducts();
    },[]);

    const destroy = (productId) => {
        // deleteProduct(productId, user._id, token).then((data) => {
        //     if (data.error) {
        //         console.log(data.error);
        //     } else {
        //         loadProducts();
        //     }
        // });
    };

    return (
        <Layout title="Moguonce" description="Manage products" className="container-fluid">
            <div className="row">
                 <div className="col-12">
                    <h4 className="text-center">
                        Total {products.length} products
                    </h4>
                    <hr />
                    <ul className="list-group" >
                        {products.map((p, i) => (
                            <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <strong>{p.name}</strong>
                                <Link to={`/admin/product/update/${p._id}`}>
                                    <button> Update </button>
                                </Link>
                                {/* <button
                                    onClick={() => destroy(p._id)}
                        
                                >
                                    Delete [NOTE ! CLICK on THIS WILL DELETE IMMIDIATELY]
                                </button> */}
                            </li>
                        ))}
                    </ul>
                     
                 </div>
            </div>
            
        </Layout>
    );
};

export default ManageProducts;
