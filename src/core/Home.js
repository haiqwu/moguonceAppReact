import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore';
import Card from './Card';
import './Home.css';
import Search from './Search';

const Home = () => {
    

    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    const loadProductsBySell = () => {
        getProducts('sold').then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setProductsBySell(data);
            }
        });
    };

    const loadProductsByArrival = () => {
        getProducts('createdAt').then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setProductsByArrival(data);
            }
        });
    };

    // component did mount 
    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    return (
        <Layout title="Moguonce" description="蘑菇一夏" className="container-fluid">
            
            <Search />

            <h2 className="title-text"> New Arrivals </h2>
            <div className="card-outer-div">
                { productsByArrival.map((product, i) => (
                    <Card key={i} product={product} />
                ))}
            </div>

            <h2 className="title-text">Best Sellers</h2>
            <div className="card-outer-div">
                { productsBySell.map((product, i) => (
                    <Card key={i} product={product} />
                ))}
            </div>
            
        </Layout>
    );
};


export default Home;
