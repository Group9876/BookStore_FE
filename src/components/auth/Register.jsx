import React, {Component} from 'react'
import {Button} from 'react-bootstrap'
import axios from 'axios';
import './Auth.css'
import {be_url} from '../others/Share';
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default class Register extends Component {
    state = {
        username: '',
        email: '',
        password: ''
    }

    url = be_url + "register"

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        event.target.reset();
        this.setState({
            username: '',
            email: '',
            password: ''
        })
        const Account = {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }
        axios.post(this.url, Account)
            .then(res => {
                console.log(res)
                if (res.data.code === '201') {
                    window.location = "/login";
                    alert("Registered successfully!")
                } else {
                    alert("Registered unsuccessfully!")
                }

            })
            .catch((error) => {
                if (error.response.data.errors) {
                    alert(error.response.data.errors[0].defaultMessage)
                } else {
                    alert(error.response.data.message)
                }
            })
    }

    render() {
        return (<>
            <Header/>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={this.handleSubmit}>
                        <h3>Register</h3>
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
                            <label>Email</label>
                            <input
                                type="email"
                                id='email'
                                required
                                className="form-control"
                                placeholder="Enter email"
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
                            <Button type="submit" className="btn" variant="outline-dark">
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer/>
        </>)
    }
}