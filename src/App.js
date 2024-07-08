import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Register from './components/auth/Register'
import Homepage from './components/homepage/Homepage'
import Login from "./components/auth/Login";
import "./App.css"
import ProductDetails from './components/product/ProductDetails';
import UpdateCustomer from "./components/profile/UpdateCustomer";
import ProductsByCategory from './components/product/ProductsByCategory';
import ShoppingCart from './components/cart/ShoppingCart'
import CheckoutOrder from './components/order/CheckoutOrder';
import CheckBill from './components/order/CheckBill';
import SuccessNotify from './components/order/SuccessNotify';
import AdminProducts from "./components/admin/AdminProducts";
import Page404 from "./components/share/page404/Page404";
import OrderByStatus from "./components/order/OrderByStatus";
import FailNotify from "./components/order/FailNotify";
import Layout from "./components/share/layout/Layout";
import ProductAdd from "./components/admin/ProductAdd";
import ProductUpdate from "./components/admin/ProductUpdate";
import AdminOrders from "./components/admin/AdminOrders";
import AdminVouchers from "./components/admin/AdminVouchers";
import VoucherAdd from "./components/admin/VoucherAdd";


function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* permit all */}
                    <Route path="/product/:id" element={<Layout><ProductDetails/></Layout>}/>
                    <Route path="/home" element={<Layout><Homepage/></Layout>}/>
                    <Route path="/" element={<Layout><Homepage/></Layout>}/>
                    <Route path="/register" element={<Layout><Register/></Layout>}/>
                    <Route path="/login" element={<Layout><Login/></Layout>}/>
                    <Route path='/category/:category' element={<Layout><ProductsByCategory/></Layout>}></Route>
                    <Route path='/success' element={<Layout><SuccessNotify/></Layout>}></Route>
                    <Route path='/cancel' element={<Layout><FailNotify/></Layout>}></Route>
                    {/* user only */}
                    <Route path='/cart' element={<Layout><ShoppingCart/></Layout>}></Route>
                    <Route path='/order' element={<Layout><CheckoutOrder/></Layout>}></Route>
                    <Route path='/my_orders' element={<Layout><OrderByStatus/></Layout>}></Route>
                    <Route path="/my_profile" element={<Layout><UpdateCustomer/></Layout>}/>
                    <Route path="/bill" element={<Layout><CheckBill/></Layout>}/>
                    {/* admin and other routes without header/footer */}
                    <Route path="/admin/products" element={<AdminProducts/>}/>
                    <Route path="/admin/product" element={<ProductAdd/>}/>
                    <Route path="/admin/product/:id" element={<ProductUpdate/>}/>
                    <Route path="/admin/orders" element={<AdminOrders/>}></Route>
                    <Route path="/admin/vouchers" element={<AdminVouchers/>}></Route>
                    <Route path="/admin/voucher" element={<VoucherAdd/>}></Route>
                    <Route path="/*" element={<Layout><Page404 title='(╥﹏╥) 404 error: Page not found!'
                                                               details='We cannot find this page, please try again later!'/></Layout>}/>
                </Routes>
            </div>
        </Router>
    )
}

export default App
