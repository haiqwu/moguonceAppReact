export const SET_CART_COUNT = 'SET_CART_COUNT';

export const dispatchSetCartCountAction = (c) => {
    return {
        type: SET_CART_COUNT,
        payload: c,
    };
};
