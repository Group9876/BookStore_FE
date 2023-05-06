import req, {be_url, fe_url, role} from "../others/Share";
import './Admin.css'
import React from "react";
import axios from "axios";
import NotFound from "../others/NotFound";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default class AdminVouchers extends React.Component {
    state = {
        vouchers: []
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

    componentDidMount() {
        this.fetchVoucherList();
    }

    fetchVoucherList = () => {
        req.get(be_url + "admin/vouchers").then((res) => {
            const vouchers = res.data
            console.log(res.data)
            this.setState({
                vouchers
            });
        })
    }

    deleteRow = (id) => {
        req.delete(`${be_url}admin/voucher/${id}`)
            .then(res => {
                const vouchers = this.state.vouchers.filter(item => item.id !== id);
                this.setState({vouchers})
            })
    }

    render() {
        if (role === "ROLE_ADMIN") {
            if (this.state.vouchers.length !== 0) {
                return (
                    <div className="container">
                        {/*aside*/}
                        <div className="row">
                            <div className="col-3">
                                <aside className="admin-aside">
                                    <div className="web-name">
                                        <a href={fe_url}><img className="admin-logo" src="/images/icon.jpg" alt="logo"/><span>PRO BOOKSTORE</span></a>

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
                                    <table className="table-list">
                                        <thead className="product-detail">
                                        <h1 className="manager">Vouchers</h1>
                                        <a className="btn btn-success btn-add" href={fe_url + "admin/voucher"}>Add
                                            new</a>
                                        <tr>
                                            <th className="table_header">Customer</th>
                                            <th className="table_header">Title</th>
                                            <th className="table_header">Rate</th>
                                            <th className="table_header">Due date</th>
                                            <th className="table_header">Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.vouchers.map(voucher => {
                                                return (
                                                    <tr key={voucher.id}>
                                                        <td>{voucher.customerEmail}</td>
                                                        <td>{voucher.title}</td>
                                                        <td>{voucher.rate}</td>
                                                        <td>{voucher.dueDate}</td>
                                                        <td>
                                                            <i className="bi bi-trash" onClick={() => {
                                                                this.deleteRow(voucher.id)
                                                            }}></i>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        )}
                                        </tbody>
                                        <tfoot>
                                        <p className="book-available">{this.state.vouchers.length} vouchers
                                            available</p>
                                        </tfoot>

                                    </table>
                                </article>
                            </div>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="container">
                        {/*aside*/}
                        <div className="row">
                            <div className="col-3">
                                <aside className="admin-aside">
                                    <div className="web-name">
                                        <a href={fe_url}><img className="admin-logo" src="/images/icon.jpg" alt="logo"/><span>PRO BOOKSTORE</span></a>

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
                                    <table className="table-list">
                                        <thead className="product-detail">
                                        <h1 className="manager">Voucher</h1>
                                        <a className="btn btn-success btn-add" href={fe_url + "admin/voucher/add"}>Add
                                            new</a>
                                        <tr>
                                            <th className="table_header">Customer</th>
                                            <th className="table_header">Title</th>
                                            <th className="table_header">Rate</th>
                                            <th className="table_header">Due date</th>
                                            <th className="table_header">Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                        <tfoot>
                                        <p className="book-available">0 voucher
                                            available</p>
                                        </tfoot>
                                    </table>
                                </article>
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <>
                    <Header/>
                    <NotFound title='(╥﹏╥) Access denied!' details='You have no permission to access this page!'/>
                    <Footer/>
                </>)
        }
    }
}