import React from "react";
import "../others/backup/Admin.css";
import req, {be_url, fe_url, role} from "../others/Share";
import NotFound from "../others/NotFound";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import axios from "axios";

export default class VoucherAdd extends React.Component {
    state = {
        title: '',
        customerId: 0,
        rate: 0,
        dueDate: ''
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

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.target.reset();
        this.setState({
            title: '',
            customerId: 0,
            rate: 0,
            dueDate: ''
        })

        const voucher = {
            title: this.state.title,
            customerId: this.state.customerId,
            rate: this.state.rate,
            dueDate: this.state.dueDate
        }

        req.post(be_url + 'admin/voucher', voucher)
            .then((res) => {
                if (res.status === 200) {
                    window.location = "/admin/vouchers";
                }
            })
            .catch(error => {
                console.error(error);
            })
    }

    render() {
        if (role === "ROLE_ADMIN") {
            return (
                <div className="container">
                    {/*aside*/}
                    <div className="row">
                        <div className="col-3">
                            <aside className="admin-aside">
                                <div className="web-name">
                                    <a href={fe_url}><img className="admin-logo" src="/images/icon.jpg"
                                                          alt="logo"/><span>PRO BOOKSTORE</span></a>

                                </div>
                                <a className="admin-navigation" href={fe_url + "admin/products"}>Manage
                                    books</a>
                                <div className="dropdown">
                                    <a className="admin-navigation" href={fe_url + "admin/orders"}>Manage
                                        orders <i className="bi bi-chevron-down dropdown_icon"></i></a>
                                    <div className="dropdown-content">
                                        <a href={fe_url + "admin/orders?status=customer_confirmed"}>Checked out</a>
                                        <a href={fe_url + "admin/orders?status=admin_preparing"}>Preparing</a>
                                        <a href={fe_url + "admin/orders?status=shipping"}>Shipping</a>
                                        <a href={fe_url + "admin/orders?status=customer_request_cancel"}>Cancel
                                            request</a>
                                        <a href={fe_url + "admin/orders?status=success"}>Success</a>
                                    </div>
                                </div>
                                <a className="admin-navigation current-pos" href={fe_url + "admin/vouchers"}>Manage
                                    vouchers</a>
                            </aside>
                        </div>
                        {/*header*/}
                        <div className="col-9">
                            <article className="admin-header">
                                <span className="welcome">Welcome ADMIN!</span>&nbsp;&nbsp;
                                <span onClick={this.logout} className="bi bi-box-arrow-right"/>
                            </article>
                            {/*admin*/}
                            <article className="admin-body">
                                <div className="container text-center mt-3 mb-5">
                                    <h3 className=" text-primary- p-2 ">
                                        ADD NEW VOUCHER
                                    </h3>
                                    <form className="form add card " onSubmit={this.handleSubmit}>
                                        <label className="h6 guide">Title</label>
                                        <input type="text" className="form-control enter" id="title"
                                               value={this.state.title} required
                                               onChange={this.handleChange}/>

                                        <label className="h6 guide">Customer ID</label>
                                        <input type="number" className="form-control enter" min="0" id="customerId"
                                               value={this.state.customerId} required
                                               onChange={this.handleChange}/>

                                        <label className="h6 guide">Rate</label>
                                        <input type="number" min="0" className="form-control enter" id="rate"
                                               value={this.state.rate} required
                                               onChange={this.handleChange}/>


                                        <label className="h6 guide">Due Date</label>
                                        <input type="date" className="form-control enter" id="dueDate"
                                               value={this.state.dueDate}
                                               required
                                               onChange={this.handleChange}/>

                                        <div className="btnSubmit">
                                            <button type="submit" className="btn btn-primary  bg-success">Add Voucher
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <>
                    <Header/>
                    <NotFound title='(╥﹏╥) Access denied!' details='You have no permission to access this page!'/>
                    <Footer/>
                </>
            )
        }
    }
}





