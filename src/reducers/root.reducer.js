import { combineReducers } from 'redux';
import { cartCountReducer } from './cartCount.reducer';

export const rootReducer = combineReducers({
    $cartCount: cartCountReducer,
    
});
