import React, { useState } from 'react';
import Layout from '../core/Layout';
import { signup } from '../auth';
import { Link } from 'react-router-dom';

const Signup = () => {

    const [values, setValues] = useState({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        closedBetaAC: '',
        error: '',
        success: false
    });
    const { closedBetaAC, lastName, firstName, email, password, error, success } = values;

    const handleChange = name => event => {
        setValues({
            ...values,
            error: false,
            [name]: event.target.value
        });
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        if (closedBetaAC === 'XCC123') {
            setValues({ ...values, error: false });
            signup({ last_name: lastName, first_name: firstName, email, password})
                .then( data => {
                    if (data.error) {
                        setValues({ ...values, error: data.error, success: false })
                    } else {
                        // clear fields
                        setValues({
                            ...values,
                            lastName: '',
                            firstName: '',
                            email: '',
                            closedBetaAC: '',
                            password: '',
                            error: '',
                            success: true
                        })
                    }
                });
        } else {
            setValues({
                ...values,
                error: 'Activation Code Incorrect',
            });
        }
    };
    
    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted"> First Name </label>
                <input 
                    onChange={handleChange('firstName')} 
                    type="text" 
                    className="form-control"
                    value={firstName}
                />
            </div>
            
            <div className="form-group">
                <label className="text-muted"> Last Name </label>
                <input 
                    onChange={handleChange('lastName')} 
                    type="text" 
                    className="form-control" 
                    value={lastName}
                />
            </div>

            <div className="form-group">
                <label className="text-muted"> Email </label>
                <input 
                    onChange={handleChange('email')} 
                    type="email" 
                    className="form-control" 
                    value={email}
                />
            </div>

            <div className="form-group">
                <label className="text-muted"> Password </label>
                <input 
                    onChange={handleChange('password')} 
                    type="password" 
                    className="form-control"
                    value={password}
                />
            </div>
            <p>Create account limited to closed beta</p>

            <div className="form-group">
                <label className="text-muted"> Beta Register Activation Code </label>
                <input 
                    onChange={handleChange('closedBetaAC')} 
                    type="text" 
                    className="form-control"
                    value={ closedBetaAC }
                />
            </div>

            <button onClick={clickSubmit} className="btn btn-outline-success">
                Create Account
            </button>
            <div>
                <p className="pt-4"> Already have an account? <Link to="/signin"> Log in now </Link> </p>
            </div>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            { error }
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/signin">Sign in</Link>
        </div>
    );


    return (
        <Layout 
            title="Moguonce" 
            description="Become a member to our Moguonce now"
            className="container col-md-8 offset-md-2"
        >
            { showSuccess() }
            { showError() }
            { signUpForm() }
        </Layout>
    );
};




export default Signup;
