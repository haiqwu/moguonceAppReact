import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { read, listRelated } from './apiCore';
import Card from './Card';
import ProductDetailsCard from './ProductDetailsCard';
import './Product.css';

const Product = (props) => {

    const [product, setProduct] = useState({});
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState(false);

    const loadSingleProduct = (productId) => {
        read(productId).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setProduct(data);
                // fetch related products
                listRelated(data._id).then(data => {
                    if (data.error) {
                        setError(data.error);
                    } else {
                        setRelatedProduct(data);
                    }
                })
            }
        });
    };

    
    useEffect(() => {
        const productId = props.match.params.productId;
        loadSingleProduct(productId);
    }, [props]);



    return (
        <Layout 
            title={`Moguonce`} 
            description={`蘑菇一夏`} 
            className="container-fluid"
        >
            
            <div className="d-flex flex-wrap">

                <div className="left-panel-prod">
                    { product && product.description &&
                        <ProductDetailsCard product={product} />

                    }
                </div>
                <div className="related-prods">
                    { relatedProduct.length > 0 &&
                        <h4> You Might Also Like  </h4>
                    }
                    
                    { relatedProduct.map((p, i) => (
                        
                        <Card key={i} product={p} />
                        
                    ))

                    }
                </div>
                
            </div>
        </Layout>
    );
};

export default Product;
