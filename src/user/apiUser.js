import { API } from '../config';

export const read = async (userId, token) => {
    try {
        const response = await fetch(`${API}/user/${userId}`, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    } catch (err) {
        console.log(err);
    }
};

export const update = async (userId, token, user) => {
    try {
        const response = await fetch(`${API}/user/${userId}`, {
            method: 'PUT',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
        });
        return response.json();
    } catch (err) {
        console.log(err);
    }
};

/**
 * Updates user in the localstorage
 */
export const updateUser = (user, next) => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            auth.user = user;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
};

export const getPurchaseHistory = async (userId, token) => {
    try {
        const response = await fetch(`${API}/orders/by/user/${userId}`, {
            method: 'GET',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    } catch (err) {
        console.log(err);
    }
};


