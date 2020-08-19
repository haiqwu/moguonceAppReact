import { SET_CART_COUNT } from '../actions/cartCount.action';
import { itemTotal } from '../core/cartHelpers';

export const cartCountReducer = (state = null, action) => {
	if (state === null) {
		state = itemTotal();
	}
    switch (action.type) {
		case SET_CART_COUNT:
			console.log('In reducer SET_CART_COUNT ', action.payload);
            return action.payload;
		default:
			return state;
	}
};