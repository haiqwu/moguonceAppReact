// import React, { useState, useEffect } from 'react';
// import { getProducts, getBraintreeClientToken, processPayment, createOrder } from './apiCore';
// import { emptyCart } from './cartHelpers';
// import { isAuthenticated } from '../auth';
// import { Link } from 'react-router-dom';
// // import "braintree-web"; // not using this package
// import DropIn from 'braintree-web-drop-in-react';
// import { connect } from 'react-redux';
// import { dispatchSetCartCountAction } from '../actions/cartCount.action';


// const Checkout = ({ products, setRun = f => f, run = undefined, dispatchSetCartCountAction }) => {
//     const [data, setData] = useState({
//         loading: false,
//         success: false,
//         clientToken: null,
//         error: '',
//         instance: {},
//         address: '',
//     });

//     const userId = isAuthenticated() && isAuthenticated().user._id;
//     const token = isAuthenticated() && isAuthenticated().token;
 
//     const getToken = (userId, token) => {
//         getBraintreeClientToken(userId, token).then(d => {
//             if (d.error) {
//                 console.log(d.error);
//                 setData({
//                     ...data, 
//                     error: d.error 
//                 });
//             } else {
//                 // console.log(d);
//                 console.log('token got success on Component mount/');
//                 setData({
//                     ...data,
//                     clientToken: d.clientToken 
//                 });
//             }
//         });
//     };
 
//     // Comp did mount
//     useEffect(() => {
//         if (userId) {
//             getToken(userId, token);
//         }
//     }, []);
 
//     const handleAddress = event => {
//         setData({ ...data, address: event.target.value });
//     };
 
//     const getTotal = () => {
//         return products.reduce((acc, nextValue) => {
//             return acc + nextValue.count * nextValue.price;
//         }, 0);
//     };
 
//     const showCheckout = () => {
//         return isAuthenticated() ? (
//             <div> { showDropIn() } </div>
//         ) : (
//             <Link to="/signin">
//                 {/* In this case will direct user to log in */}
//                 <button className="btn btn-primary"> Proceed to checkout </button>
//             </Link>
//         );
//     };
 
//     let deliveryAddress = data.address;
    
//     const filledDataValidation = () => {





//         // put error message into the state which is data.error 
//         // return false; // invalid
//         return true; // valid 
//     };

//     const itemStockCheck = () => {
//         return true;
//     };

//     const buy = async () => {
//         if (filledDataValidation() && itemStockCheck()) {
//             console.log('buying');
//             setData({ loading: true });
//             try {
//                 // send the nonce to your server
//                 const { nonce } = await data.instance.requestPaymentMethod();
//                 // once we have nonce (card type, card number ...) we send nonce as 'paymentMethodNonce'
//                 // as well as totals as amount to backend
//                 // console.log("send nonce and total to process: ", nonce, getTotal(products) );
//                 const paymentData = {
//                     paymentMethodNonce: nonce,
//                     amount: getTotal(products),
//                 };

//                 const response = await processPayment(userId, token, paymentData);
                
//                 console.log(response);

//                 if (!response.success) {
//                     // payment fail
//                     setData({
//                         ...data,
//                         success: false,
//                     });
//                     throw new Error('Payment fail: ' + response.message);
//                 }
//                 // empty cart
//                 // create order
//                 const createOrderData = {
//                     products: products,
//                     transaction_id: response.transaction.id,
//                     amount: response.transaction.amount,
//                     address: deliveryAddress,

//                     // ...


//                 };
                
//                 // TODO: as well need to consider sending confirmation email to customer
//                 // TODO: send email to Admin Order Reciever Email if necessary
//                 const lastResp = await createOrder(userId, token, createOrderData);

//                 emptyCart(() => {
//                     setRun(!run); // run useEffect in parent Cart
//                     console.log('payment success and empty cart');
//                     dispatchSetCartCountAction(0);
//                     setData({
//                         loading: false,
//                         success: true,
//                     });
//                 });
//             } catch (err) {
//                 console.log(err);
//                 setData({
//                     ...data,
//                     error: err.message,
//                     loading: false,
//                 });
//             }
//         } else {
//             // form invalid:
//             console.log('form invalid');
//         }
//     };

//     const showDropIn = () => (
//         <div onBlur={() => setData({ ...data, error: '' })} >
//             { data.clientToken !== null && products.length > 0 ? (
//                 <div className="">
//                     <div className="gorm-group">
//                         <h2> Shipping Address </h2>
//                         <label className="form-control-label">  First Name </label>
//                         <input className="form-control" />

//                         <label className="form-control-label">  Last Name </label>
//                         <input className="form-control" />

//                         <label className="form-control-label">Street Address</label>
//                         <input
//                             onChange={handleAddress}
//                             className="form-control"
//                             value={data.address}
//                             placeholder="Enter your address..."
//                         />

//                         <label className="form-control-label">Additional Address Information </label>
//                         <input
//                             className="form-control"
//                             placeholder="Additional Address Info (Optional)"
//                         />

//                         <label className="form-control-label"> City </label>
//                         <input className="form-control" />

//                         <div className="form-group">
//                             <label className="form-control-label" htmlFor="shippingStatedefault">
//                                 State
//                             </label>
//                             <select className="form-control" id="shippingStatedefault">
//                                 <option id="" value=""> Select State </option>
//                                 <option id="AL" value="AL">Alabama</option>
//                                 <option id="AK" value="AK">Alaska</option>
//                                 <option id="AS" value="AS">American Samoa</option>
//                                 <option id="AZ" value="AZ">Arizona</option>
//                                 <option id="AR" value="AR">Arkansas</option>
//                                 <option id="CA" value="CA">California</option>
//                                 <option id="CO" value="CO">Colorado</option>
//                                 <option id="CT" value="CT">Connecticut</option>
//                                 <option id="DE" value="DE">Delaware</option>
//                                 <option id="DC" value="DC">District of Columbia</option>
//                                 <option id="FL" value="FL">Florida</option>
//                                 <option id="GA" value="GA">Georgia</option>
//                                 <option id="GU" value="GU">Guam</option>
//                                 <option id="HI" value="HI">Hawaii</option>
//                                 <option id="ID" value="ID">Idaho</option>
//                                 <option id="IL" value="IL">Illinois</option>
//                                 <option id="IN" value="IN">Indiana</option>
//                                 <option id="IA" value="IA">Iowa</option>
//                                 <option id="KS" value="KS">Kansas</option>
//                                 <option id="KY" value="KY">Kentucky</option>
//                                 <option id="LA" value="LA">Louisiana</option>
//                                 <option id="ME" value="ME">Maine</option>
//                                 <option id="MD" value="MD">Maryland</option>
//                                 <option id="MA" value="MA">Massachusetts</option>
//                                 <option id="MI" value="MI">Michigan</option>
//                                 <option id="MN" value="MN">Minnesota</option>
//                                 <option id="MS" value="MS">Mississippi</option>
//                                 <option id="MO" value="MO">Missouri</option>
//                                 <option id="MT" value="MT">Montana</option>
//                                 <option id="NE" value="NE">Nebraska</option>
//                                 <option id="NV" value="NV">Nevada</option>
//                                 <option id="NH" value="NH">New Hampshire</option>
//                                 <option id="NJ" value="NJ">New Jersey</option>
//                                 <option id="NM" value="NM">New Mexico</option>
//                                 <option id="NY" value="NY">New York</option>
//                                 <option id="NC" value="NC">North Carolina</option>
//                                 <option id="ND" value="ND">North Dakota</option>
//                                 <option id="OH" value="OH">Ohio</option>
//                                 <option id="OK" value="OK">Oklahoma</option>
//                                 <option id="OR" value="OR">Oregon</option>
//                                 <option id="PA" value="PA">Pennsylvania</option>
//                                 <option id="PR" value="PR">Puerto Rico</option>
//                                 <option id="RI" value="RI">Rhode Island</option>
//                                 <option id="SC" value="SC">South Carolina</option>
//                                 <option id="SD" value="SD">South Dakota</option>
//                                 <option id="TN" value="TN">Tennessee</option>
//                                 <option id="TX" value="TX">Texas</option>
//                                 <option id="UT" value="UT">Utah</option>
//                                 <option id="VT" value="VT">Vermont</option>
//                                 <option id="VI" value="VI">Virgin Islands</option>
//                                 <option id="VA" value="VA">Virginia</option>
//                                 <option id="WA" value="WA">Washington</option>
//                                 <option id="WV" value="WV">West Virginia</option>
//                                 <option id="WI" value="WI">Wisconsin</option>
//                                 <option id="WY" value="WY">Wyoming</option>
//                                 <option id="AA" value="AA">ARMED FORCES AMERICAS (Military only - No Residential)</option>
//                                 <option id="AE" value="AE">ARMED FORCES EUROPE (Military only - No Residential)</option>
//                                 <option id="AP" value="AP">ARMED FORCES PACIFIC (Military only - No Residential)</option>
//                                 <option id="OTHER" value="OTHER">Non-US/Other</option>
//                             </select>
//                         </div>

//                         <label className="form-control-label "> Zip code </label>
//                         <input className="form-control"/>

//                         <label className="form-control-label"> Phone number </label>
//                         <input className="form-control" />

//                         <h2> Shipping Method </h2>
//                         <input id="radio-1" type="radio" checked  />
//                         <label htmlFor="radio-1" className="form-control-label" >Standard Shipping</label>
                        

//                     </div>
                    
//                     <DropIn 
//                         options={{
//                             authorization: data.clientToken,
//                             paypal: {
//                                 flow: 'vault',
//                             }
//                         }}
//                         onInstance={instance => (data.instance = instance)}
//                     />
                    
//                     <button onClick={buy} className="btn btn-success btn-block">
//                         Place Order
//                     </button>
//                 </div>
//             ) : null }
//         </div>
//     );

//     const errMsg = (error) => {
//         if (error === 'No payment method is available.') {
//             return 'Please check your payment method';
//         }
//         if (error === 'Payment fail: Cannot use a payment_method_nonce more than once.') {
//             return 'Session time out: Please reload page';
//         }
//         return error;
//     };
 
//     const showError = (error) => (
//         <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
//             { errMsg(error) }
//         </div>
//     );
 
//     const showSuccess = success => (
//         <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
//             Thank you! Your order has been placed!
            
//         </div>
//     );
 
//     const showLoading = (loading) => 
//         loading && <h2 className="text-danger">Please wait...</h2>;

//     return (
//         <div>
      
//             <p> Subtotal: $ { getTotal() }</p>
//             <p> Shipping: $ 0 </p>
//             <p> Estimated Tax: $ 0 </p>
//             <p> Estimated Total: $ { getTotal() } </p>

//             {showLoading(data.loading)}
//             {showSuccess(data.success)}
            
//             {showError(data.error)}
//             {showCheckout()}
//         </div>
//     );
// };

// export default connect(null, {
//     dispatchSetCartCountAction,

// })(Checkout);
