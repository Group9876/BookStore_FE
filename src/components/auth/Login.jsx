import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import axios from 'axios';
import './Auth.css';
import {be_url} from '../share/Share';

export default class Login extends Component {
    state = {
        username: '',
        password: ''
    }

    url = be_url + "login"

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        const Account = {
            username: this.state.username,
            password: this.state.password
        }
        axios.post(this.url, Account, {withCredentials: true})
            .then(res => {
                localStorage.setItem("access_token", res.data.accessToken);
                localStorage.setItem("userId", res.data.userId);
                localStorage.setItem("role", res.data.role);
                if (res.status === 200) {
                    if (res.data.role === "ROLE_ADMIN") {
                        console.log("Login successfully!")
                        window.location = "/admin/products"
                    } else if (res.data.role === "ROLE_CUSTOMER") {
                        console.log("Login successfully!")
                        window.location = "/home";
                    }
                }
                event.target.reset();
                this.setState({
                    username: '',
                    password: ''
                })
            })
            .catch((error) => {
                console.log(error)
                alert("Invalid username or password!")
            })
    }

    render() {
        return (<>

                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form onSubmit={this.handleSubmit}>
                            <h3>LOGIN TO ACCOUNT</h3>
                            <div className="mb-3">
                                <label>Username</label>
                                <input
                                    type="text"
                                    id='username'
                                    required
                                    className="form-control"
                                    placeholder="Enter username"
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    id='password'
                                    required
                                    className="form-control"
                                    placeholder="Enter password"
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div className="d-grid">
                                <Button type="submit" className="btn checkoutBtn m-0" variant="outline-dark">
                                    Login
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}