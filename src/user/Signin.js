import React, { useState } from 'react';
import Layout from '../core/Layout';
import { signin, authenticate, isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './Signin.css';

const Signin = ({$cartCount}) => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        redirectToReferrer: false,
    });

    const { email, password, loading, error, redirectToReferrer } = values;
    const { user } = isAuthenticated();

    const handleChange = name => event => {
        setValues({
            ...values,
            error: false,
            [name]: event.target.value
        });
    };

    const clickSubmit = (event) => {
        event.preventDefault();
        setValues({ ...values, error: false, loading: true });
        signin({ email, password })
            .then( data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                } else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            redirectToReferrer: true,
                        });
                    });
                }
            });
    };
    
    const signUpForm = () => (
        <form>
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
            <button onClick={clickSubmit} className="btn btn-outline-success">
                Log In
            </button>
            <br />
            <div >
                <p className="pt-4"> <Link className="forgot-password-link">Forgot password?</Link> </p>
            </div>
            <div>
                <p> Don't have an account? <Link to="/signup"> Create an account </Link> </p>
            </div>
        </form>
    );

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            { error }
        </div>
    );

    const showLoading = () => 
        loading && (
            <div className="alert alert-info">
                <h2> Loading... </h2>
            </div>
        );
    
    const redirectUser = () => {
        if (redirectToReferrer) {
            if (user && user.role === 1) {
                return <Redirect to="/admin/dashboard" />
            } else {
                if ($cartCount > 0) {
                    return <Redirect to="/cart" />;
                }
                return <Redirect to="/" />;
            }
        }
        // if redirectToReferrer is not set
        // and in the mean time, user already logged in
        if (isAuthenticated()) {
            if ($cartCount > 0) {
                return <Redirect to="/cart" />;
            }
            return <Redirect to="/" />;
        }
    }

    return (
        <Layout 
            title="Moguonce" 
            description="Log in to Moguonce"
            className="container col-md-8 offset-md-2"
        >
            { showLoading() }
            { showError() }
            { signUpForm() }
            { redirectUser() }
        </Layout>
    );
};

const mapStateToProps = (state) => ({
	$cartCount: state.$cartCount,
});

export default connect(mapStateToProps, {

})(Signin);
