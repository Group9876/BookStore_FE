import React, {Component} from 'react';
import './Header.css'
import {Link, useNavigate} from "react-router-dom";
import req, {accessToken, be_url, fe_url, role, userId} from '../others/Share';
import axios from "axios";

class HeaderWithNavigate extends Component {
    url = be_url + "search"

    state = {
        name: "",
        numberOfItemInCart: 0
    }
    baseLink = fe_url + "product/"

    componentDidMount() {
        this.getNumberOfItem();
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    search = (event) => {
        event.preventDefault();
        this.props.navigate(`/?name=${this.state.name}`, {state: {name: this.state.name}})
    }

    logout = () => {
        axios.post(`${be_url}logout`).then((res) => {
            if (res.status === 200) {
                localStorage.clear()
                this.setState({
                    accessToken: null
                })
                window.location = "/"
            }
        })
    }

    getNumberOfItem = () => {
        req.get(be_url + "cart/count/" + userId)
            .then((res) => {
                this.setState({numberOfItemInCart: res.data})
            })
    }

    render() {
        return (
            <nav>
                <div className='top'>
                    {!accessToken ?
                        <nav className='ml-auto'>
                            <a href='/login'>&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;</a>|
                            <a href='/register'>&nbsp;Register</a>
                        </nav>
                        : <nav className='ml-auto'>
                            <span className="logout"
                                  onClick={this.logout}>&nbsp;&nbsp;&nbsp;&nbsp;Logout&nbsp;&nbsp;</span>|
                            <a href='/login'>&nbsp;Re-login&nbsp;&nbsp;</a>
                            
                        </nav>
                    }
                </div>
                <div className='menu'>
                    <a href='/'><img src='/images/icon.jpg' alt='logo' className='logo mt-1'></img></a>
                    <div className='cats'>
                        <div className="dropdown">
                            <div className="drop-btn"><i className="bi bi-list"></i></div>
                            <div className="dropdown-content">
                                {/**/}
                            </div>
                        </div>
                        <a href={this.baseLink + "detective/0"}>Detective</a>
                        <a href={this.baseLink + "fiction/0"}>Fiction</a>
                        <a href={this.baseLink + "horror/0"}>Horror</a>
                        <a href={this.baseLink + "comic/0"}>Comic</a>
                        <a href={this.baseLink + "adventure/0"}>Adventure</a>
                        <a href={this.baseLink + "literature/0"}>Literature</a>
                        {role === "ROLE_ADMIN" && <a href={fe_url + 'admin/products'}>Manage product</a>}
                        {role === "ROLE_ADMIN" && <a href={fe_url + 'admin/orders'}>Manage order</a>}

                    </div>
                    <form className='d-flex'>
                        <div className='d-flex'>
                            <input type='search' placeholder='Enter name of book' className='search mr-2'
                                   id="name" onChange={this.handleChange}/>
                            <button className='btn green-btn' onClick={this.search}>Search</button>
                        </div>
                    </form>
                    {role === "ROLE_CUSTOMER" &&
                        <>
                            <a href='/#'><Link to={fe_url + "cart"}><i className="bi bi-cart2 customCart"><span
                                className='numberOfItem'>{this.state.numberOfItemInCart}</span></i></Link></a>
                            <li className='account'><img src='/images/account.png' alt='account'
                                                         className='account'></img>
                                <ul className='sub-account'>
                                    <div><a href='/my_profile'>Profile</a></div>
                                    <div className='orders'><a href={fe_url + "order"}>Orders</a></div>
                                </ul>
                            </li>
                        </>}
                </div>
                <hr></hr>
            </nav>
        );
    }
}

function Header(props) {
    let navigate = useNavigate();
    return <HeaderWithNavigate {...props} navigate={navigate}/>
}

export default Header;