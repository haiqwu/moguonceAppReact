import React from 'react';
import { Link } from 'react-router-dom';
import ShowImage from './ShowImage';
import './Card.css';

const Card = ({product}) => {
    return (
        <div className="mb-3">
            <div className="card-body  ">
                <Link to={`/product/${product._id}`}>
                    <ShowImage item={product} url="product" width={`250px`} height={`250px`} />
                </Link>
                <p className="product-name">{product.name}</p>
                {/* <p className="card-p  mt-2">{product.description.substring(0, 100)} </p> */}
                <p className=" product-name">$ {product.price}</p>
                {/* <p className="black-9">Category: {product.category && product.category.name}</p> */}
                {/* <p className="black-8">Added on {moment(product.createdAt).fromNow()}</p> */}
                
                {/* <div className="">
                    <button className="btn btn-outline-success product-name" >
                        
                    </button>
                </div> */}
            </div>
        </div>
    );
};

export default Card;
