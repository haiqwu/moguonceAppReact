import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import { getProduct, getCategories, updateProduct } from './apiAdmin';

const UpdateProduct = ({ match }) => {
    const { user, token } = isAuthenticated();
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '',
        categories: [], // all categories
        category: '',
        shipping: '',
        quantity: '',
        photo: '',
        loading: false,
        error: '',
        createdProduct: '',
        redirectToProfile: false,
        formData: '',
    });
    const {
        name,
        description,
        price,
        categories, // all categories
        category,
        shipping,
        quantity,
        loading,
        error,
        createdProduct,
        redirectToProfile,
        formData, // as a FormData, used for sending to backend
    } = values;

    const init = (productId) => {
        getProduct(productId).then((data) => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                });
            } else {
                // load categories
                getCategories().then((data2) => {
                    if (data2.error) {
                        setValues({
                            ...values,
                            error: data2.error,
                        });
                    } else {
                        // all data ready 
                        setValues({
                            ...values,

                            name: data.name,
                            description: data.description,
                            price: data.price,
                            category: '' + data.category._id,
                            shipping: data.shipping,
                            quantity: data.quantity,

                            formData: new FormData(),
                            categories: data2, 
                        });
                    
                        
                    }
                });
            }
        });
    };

    useEffect(() => {
        if (formData) {
            formData.set('name', name);
            formData.set('description', description);
            formData.set('price', price);
            formData.set('category', category);
            formData.set('shipping', shipping);
            formData.set('quantity', quantity);
        }
    }, [formData]);

    // componentDidMount
    useEffect(() => {
        init(match.params.productId);
    }, []);

    const handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        formData.set(name, value); // update the formData 
        setValues({ 
            ...values,
            [name]: value,
        });
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({
            ...values,
            error: '',
            loading: true,
        });

        console.log('Rdy to update', formData);

        updateProduct(match.params.productId, user._id, token, formData)
            .then((data) => {
                if (data.error) {
                    setValues({
                        ...values,
                        error: data.error,
                    });
                } else {
                    // no error
                    setValues({
                        ...values,
                        loading: false,
                        createdProduct: data.name,
                        redirectToProfile: true,
                        error: '', // 
                    });
                    alert('update success');
                    // window.location.reload();
                }
            });
    };

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Change Photo (Upload if photo change is needed)</h4>
            <div className="form-group">
                <label className="btn btn-secondary">
                    <input onChange={handleChange('photo')} type="file" name="photo" accept="image/*" />
                </label>
            </div>

            <div className="form-group">
                <label className="text-muted"> Name </label>
                <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
            </div>

            <div className="form-group">
                <label className="text-muted"> Description </label>
                <textarea onChange={handleChange('description')} className="form-control" value={description} />
            </div>

            <div className="form-group">
                <label className="text-muted">Price</label>
                <input onChange={handleChange('price')} type="number" className="form-control" value={price} />
            </div>

            <div className="form-group">
                <label className="text-muted">Category</label>
                <select onChange={handleChange('category')} className="form-control">
                    <option> Please select </option>
                    { categories && categories.map((c, i) => {
                        return (
                            <option key={i} value={c._id} selected={c._id === category}>
                                { c.name } 
                            </option> 
                        );
                    })}
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping Required?</label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please select</option>
                    
                    <option value="0"  selected={shipping === false }> No </option>
                    <option value="1" selected={shipping === true }> Yes </option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />
            </div>

            <button className="btn btn-outline-primary"> Update Product </button>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{display: createdProduct ? '' : 'none'}}>
            <h2>{`${createdProduct} is updated successfully.`}</h2>
        </div>
    );

    const showLoading = () => (
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        )
    );

    const redirectUser = () => {
        if (redirectToProfile) {
            if (!error) {
                return <Redirect to="/admin/products" />
            }
        }
    };

    return (
        <Layout title="Add a new product" description={`Hello, ${user.first_name}`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    { showLoading() }
                    { showSuccess() }
                    { showError() }
                    { newPostForm() }
                    { redirectUser() }
                </div>
            </div>
            
        </Layout>
    );
};

export default UpdateProduct;
