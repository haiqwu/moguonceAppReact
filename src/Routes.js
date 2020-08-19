import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Signup from './user/Signup';
import Signin from './user/Signin';
import Home from './core/Home';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import Dashboard from './user/UserDashboard';
import AdminDashboard from './user/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddProduct from './admin/AddProduct';
import UpdateProduct from './admin/UpdateProduct';
import Shop from './core/Shop';
import Product from './core/Product';
import Cart from './core/Cart';
import PaymentPage from './core/PaymentPage';
import OrderSuccess from './core/OrderSuccess';
import Orders from './admin/Orders';
import Profile from './user/Profile';
import OrderDetail from './core/OrderDetail';
import ManageProducts from './admin/ManageProducts';

const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/shop" exact component={Shop} />
                <Route path="/signin" exact component={Signin} />
                <Route path="/signup" exact component={Signup} />
                <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
                <PrivateRoute path="/order-detail" exact component={OrderDetail} />
                <AdminRoute path="/admin/dashboard" exact component={AdminDashboard} />
                <AdminRoute path="/create/category" exact component={AddCategory} />
                <AdminRoute path="/create/product" exact component={AddProduct} />
                <AdminRoute path="/admin/product/update/:productId" exact component={UpdateProduct} />
                <AdminRoute path="/admin/orders" exact component={Orders} />
                <AdminRoute path="/admin/products" exact component={ManageProducts} />

                <Route path="/product/:productId" exact component={Product} />
                <Route path="/cart" exact component={Cart} />
                <Route path="/pay" exact component={PaymentPage} />
                <Route path="/order-success" exact component={OrderSuccess} />

                <PrivateRoute path="/profile" exact component={Profile} />


            </Switch>
        </BrowserRouter>
    );
};

export default Routes;