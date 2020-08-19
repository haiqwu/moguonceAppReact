export const addItem = (item, qty, next) => {
    let cart = [];
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        const found = cart.find((i) => {
            return i._id === item._id;
        });
        if (found === undefined) {
            // did not find it OR empty cart(no 'cart' in localStorage)
            // add a new item
            cart.push({
                ...item,
                count: +qty,
            });
        } else {
            // found it, need to increment count
            found.count += +qty;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        next();
    }
};

/**
 * calculate number of total items in the cart.
 */
export const itemTotal = () => {
    let cart = [];
    let numItems = 0;
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            cart.forEach((i) => {
                numItems += i.count;
            });
            return numItems;
        }
    }
    return 0;
};

export const getCart = () => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            return JSON.parse(localStorage.getItem('cart'));
        }
    }
    return [];
};


export const updateItem = (productId, count, next) => {
    let cart = [];
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        cart.forEach((product, i) => {
            if (product._id === productId) {
                cart[i].count = +count;
            }
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        next();
    }
};

export const removeItem = (productId, next) => {
    let cart = [];
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
    
        cart.forEach((product, i) => {
            if (product._id === productId) {
                cart.splice(i, 1); // remove 1 from index i
            }
        });
 
        localStorage.setItem('cart', JSON.stringify(cart));
        next();
    }
};

export const emptyCart = (next) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        next();
    }
};





