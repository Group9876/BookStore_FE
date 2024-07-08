import React, {Component} from 'react';
import './Header.css'
import {Link, useNavigate} from "react-router-dom";
import req, {accessToken, be_url, fe_url, role, userId} from '../Share';
import axios from "axios";

class HeaderWithNavigate extends Component {
    url = be_url + "search"

    state = {
        name: "",
        numberOfItemInCart: 0,
        avatar: null,
        isActive: ''
    }
    baseLink = fe_url + "category/"

    componentDidMount() {
        this.getNumberOfItem();
        this.getUserProfile();
    }

    getUserProfile = () => {
        let url
        if (role() === "ROLE_CUSTOMER") {
            url = `${be_url}customer/${userId()}`
        } else {
            url = `${be_url}admin/user/${userId()}`
        }
        req.get(url).then((res) => {
            const avatarUrl = res.data.data.avatar;
            console.log("Avatar loaded.")
            if (avatarUrl !== '/account.jpg') {
                this.setState({
                    avatar: avatarUrl
                })
            } else {
                this.setState({
                    avatar: "/images" + avatarUrl
                })
            }

        }).catch((error) => {
            console.log(error)
            this.logout()
        })
    }

    search = (event) => {
        event.preventDefault();
        this.props.navigate(`/home?name=${this.state.name}`, {state: {name: this.state.name}})
    }

    logout = () => {
        if (accessToken()) {
            axios.post(`${be_url}logout`).then((res) => {
                if (res.status === 200) {
                    localStorage.clear()
                    console.log("Logout successfully!")
                    window.location = "/home"
                }
            })
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    getNumberOfItem = () => {
        req.get(`${be_url}cart/${userId()}`)
            .then((res) => {
                console.log("Cart loaded.")
                this.setState({numberOfItemInCart: res.data.data.length})
            })
    }

    isActive = (category) => {
        const pathname = window.location.pathname;
        return pathname.startsWith(`/category/${category}`);
    }

    render() {
        return (
            <nav>
                <div className='top'>
                    {!accessToken() ?
                        <nav className='ml-auto'>
                            <Link to='/login'>&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;</Link>|
                            <Link to='/register'>&nbsp;&nbsp;&nbsp;Register&nbsp;&nbsp;</Link>|
                        </nav>
                        : <nav className='ml-auto'>
                            <span className="logout"
                                  onClick={this.logout}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Logout&nbsp;&nbsp;&nbsp;&nbsp;</span>|
                            {/* <a href='/login'>&nbsp;Re-login&nbsp;&nbsp;</a>|
                            <a href='/register'>&nbsp;Re-register&nbsp;&nbsp;</a> */}
                        </nav>
                    }
                </div>
                <div className='menu'>
                    <Link to='/home'><img src='/images/icon.jpg' alt='logo' className='logo mt-1'></img></Link>
                    <div className='cats'>
                        {(role() === "ROLE_ADMIN" || role() === "ROLE_CUSTOMER") &&
                            <div className="dropdown">
                                <div className="drop-btn"><i className="bi bi-cart-check"></i></div>
                                <div className="dropdown-content">
                                    <a href={fe_url + 'my_orders?status=customer_confirmed'}>Checked out orders</a>
                                    <a href={fe_url + 'my_orders?status=admin_preparing'}>Preparing orders</a>
                                    <a href={fe_url + 'my_orders?status=shipping'}>Shipping orders</a>
                                    <a href={fe_url + 'my_orders?status=customer_request_cancel'}>Canceling orders</a>
                                    <a href={fe_url + 'my_orders?status=canceled'}>Canceled orders</a><a
                                    href={fe_url + 'my_orders?status=success'}>Successful orders</a>
                                </div>
                            </div>}
                        {role() === "ROLE_ADMIN" &&
                            <div className="dropdown pr-3">
                                <div className="drop-btn"><i className="bi bi-person"></i></div>
                                <div className="dropdown-content">
                                    <a href={fe_url + 'admin/products'}>Manage books</a>
                                    <a href={fe_url + 'admin/orders?status=customer_confirmed'}>Manage orders</a>
                                    <a href={fe_url + 'admin/vouchers'}>Manage vouchers</a>
                                </div>
                            </div>}
                        <span className="pt-0">
                        <a href={this.baseLink + "detective"}
                           className={this.isActive('detective') ? 'active' : ''}>Detective</a>
                            <a href={this.baseLink + "fiction"}
                               className={this.isActive('fiction') ? 'active' : ''}>Fiction</a>
                            <a href={this.baseLink + "horror"}
                               className={this.isActive('horror') ? 'active' : ''}>Horror</a>
                            <a href={this.baseLink + "comic"}
                               className={this.isActive('comic') ? 'active' : ''}>Comic</a>
                            <a href={this.baseLink + "adventure"}
                               className={this.isActive('adventure') ? 'active' : ''}>Adventure</a>
                            <a href={this.baseLink + "literature"}
                               className={this.isActive('literature') ? 'active' : ''}>Literature</a>
                        </span>
                    </div>

                    <form className='search-bar'>
                        <input type='search' placeholder='Enter name of book'
                               className={userId() ? 'mr-2 pl-2' : 'search mr-2'}
                               id="name" onChange={this.handleChange}/>
                        <button className='btn green-btn' onClick={this.search}>Search</button>
                    </form>
                    {(role() === "ROLE_ADMIN" || role() === "ROLE_CUSTOMER") && <>
                        <Link to={fe_url + "cart"} className="mt-2"><i
                            className="bi bi-cart2 customCart"><span
                            className='numberOfItem'>{this.state.numberOfItemInCart}</span></i></Link>
                        <a href='/my_profile'><img className="account" src={this.state.avatar} alt="avatar"/></a>
                    </>}
                    <div></div>
                </div>
                <hr className="mb-0"></hr>
            </nav>
        );
    }
}

function Header(props) {
    let navigate = useNavigate();
    return <HeaderWithNavigate {...props} navigate={navigate}/>
}

export default Header;