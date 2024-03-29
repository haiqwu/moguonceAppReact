import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import { createProduct, getCategories } from './apiAdmin';

const AddProduct = () => {

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

    // load categories and set form data
    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                });
            } else {
                setValues({
                    ...values,
                    categories: data, 
                    formData: new FormData(), // init the formData
                })
            }
        })
    };

    // componentDidMount
    useEffect(() => {
        init();
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

        createProduct(user._id, token, formData)
            .then((data) => {
                console.log('data: ', data);
                if (data.error) {
                    setValues({
                        ...values,
                        error: data.error,
                    });
                } else {
                    setValues({
                        ...values,
                        name: '',
                        description: '',
                        photo: '',
                        price: '',
                        quantity: '',
                        loading: false,
                        createdProduct: data.name,
                    });
                    alert('create success');
                    window.location.reload();
                }
            });
        
    };

    const newPostForm = () => (
        <form className="mb-3" onSubmit={clickSubmit}>
            <h4>Post Photo</h4>
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
                    { categories && categories.map((c, i) => (
                        <option key={i} value={c._id}>
                            { c.name } 
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Shipping Required?</label>
                <select onChange={handleChange('shipping')} className="form-control">
                    <option>Please select</option>
                    <option value="0"> No </option>
                    <option value="1"> Yes </option>
                </select>
            </div>

            <div className="form-group">
                <label className="text-muted">Quantity</label>
                <input onChange={handleChange('quantity')} type="number" className="form-control" value={quantity} />
            </div>

            <button className="btn btn-outline-primary">Create Product</button>
        </form>
    );

    
    const showError = () => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{display: createdProduct ? '' : 'none'}}>
            <h2>{`${createdProduct} is created successfully.`}</h2>
        </div>
    );

    const showLoading = () => (
        loading && (
            <div className="alert alert-success">
                <h2>Loading...</h2>
            </div>
        )
    );


    return (
        <Layout title="Add a new product" description={`Hello, ${user.first_name}`}>
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    { showLoading() }
                    { showSuccess() }
                    { showError() }
                    { newPostForm() }
                </div>
            </div>
            
        </Layout>
    );
};

export default AddProduct;
