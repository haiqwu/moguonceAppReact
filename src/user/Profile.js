import React, { useState, useEffect } from 'react';
import Layout from '../core/Layout';
import { isAuthenticated } from '../auth';
import { Link, Redirect } from 'react-router-dom';
import { read, update, updateUser } from './apiUser';

const Profile = (props) => {
    let locationState = props.location.state;

    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        // email: '',
        // password: '',

        role: null,
        error: false,
        success: false,
    });

    const { first_name, last_name, error, success } = values;
    const { token } = isAuthenticated();

    const init = (userId) => {
        read(userId, token).then(data => {
            if (data.error) {
                setValues({
                    ...values,
                    error: true,
                })
            } else {
                // console.log(data);
                setValues({
                    ...values,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    role: data.role,
                })
            }
        });
    };

    useEffect(() => {
        if (locationState !== undefined) {
            init(locationState.userId);
        }
    }, []);

    const handleChange = (name) => (e) => {
        setValues({
            ...values,
            error: false,
            [name]: e.target.value
        });

    };

    const clickSubmit = (e) => {
        e.preventDefault();
        update(locationState.userId, token, {first_name, last_name})
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    updateUser(data, () => {
                        setValues({
                            ...values,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            success: true,
                        });
                    });
                }
            });
    };

    const redirectUser = (success) => {
        if (success) {
            return <Redirect to={values.role === 0 ? '/user/dashboard' : '/admin/dashboard' } /> 
        }
    }


    const profileUpdate = (first_name, last_name) => (
        <form>
            <div className="form-group">
                <label className="text-muted">First Name</label>
                <input type="text" onChange={handleChange('first_name')} className="form-control" value={first_name} />
            </div>
            <div className="form-group">
                <label className="text-muted"> Last Name </label>
                <input type="text" onChange={handleChange('last_name')} className="form-control" value={last_name} />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">
                Submit
            </button>
        </form>
    );

    if (locationState === undefined) {
        return null;
    }

    return (
        <Layout title="Moguonce" description="My Profile" className="container-fluid">
            
            <h2 className="title-text"> Profile Update </h2>
            { profileUpdate(first_name, last_name) }
            <hr />
            <p> Other options </p>
            <Link>Change My Password</Link><br />
            <Link>Change Email </Link>

            { redirectUser(success) }
        </Layout>
    );



}

export default Profile;
