import req, {be_url, fe_url, role} from "../others/Share";
import './Admin.css'
import React from "react";
import axios from "axios";
import NotFound from "../others/NotFound";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default class AdminProducts extends React.Component {
    state = {
        products: [],
        pages: 0,
        current: 0,
        total: 0
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
        this.fetchProductList();
    }

    fetchProductList = () => {
        req.get(be_url).then((res) => {
            const products = res.data.content;
            const pages = res.data.totalPages;
            const current = res.data.number;
            const total = res.data.totalElements
            this.setState({
                products,
                pages,
                current,
                total,
            });
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.reloadList !== prevProps.reloadList) {
            this.fetchProductList();
        }
    }

    deleteRow = (id) => {
        req.delete(`${be_url}admin/product/${id}`)
            .then(res => {
                const products = this.state.products.filter(item => item.id !== id);
                this.setState({products})
            })
    }

    handleSwitch = (i) => {
        axios.get(`${be_url}${i}`).then((res) => {
            const products = res.data.content;
            console.log(res.data)
            this.setState({
                products,
                current: i
            });
        })
    }

    render() {
        if (role === "ROLE_ADMIN") {
            const arr = []
            if (this.state.products.length !== 0) {
                for (let i = this.state.pages - 1; i >= 0; i--) {
                    if (this.state.current === i) {
                        arr.push(<button className="clicked" key={"page_" + i} onClick={() => {
                            this.handleSwitch(i)
                        }}>{i + 1}</button>)
                    } else {
                        arr.push(<button className="click" key={"page_" + i} onClick={() => {
                            this.handleSwitch(i)
                        }}>{i + 1}</button>)
                    }
                }
                return (
                    <div className="container">
                        {/*aside*/}
                        <div className="row">
                            <div className="col-3">
                                <aside className="admin-aside">
                                    <div className="web-name">
                                        <a href={fe_url}><img className="admin-logo" src="/images/icon.jpg" alt="logo"/><span>PRO BOOKSTORE</span></a>

                                    </div>
                                    <a className="admin-navigation current-pos" href={fe_url + "admin/products"}>Manage
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
                                    <a className="admin-navigation" href={fe_url + "admin/vouchers"}>Manage vouchers</a>
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
                                        <h1 className="manager">Books</h1>
                                        <a className="btn btn-success btn-add" href={fe_url + "admin/product"}>Add
                                            new</a>
                                        <tr>
                                            <th className="table_header">Book Name</th>
                                            <th className="table_header">Price</th>
                                            <th className="table_header">In stock</th>
                                            <th className="table_header">Image</th>
                                            <th className="table_header">Category</th>
                                            <th className="table_header">Discount</th>
                                            <th className="table_header">Update</th>
                                            <th className="table_header">Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.products.map(product => {
                                                return (
                                                    <tr key={product.id}>
                                                        <td>{product.name}</td>
                                                        <td>{product.price}</td>
                                                        <td>{product.inStock}</td>
                                                        <td><img src={product.images[0]} alt={product.name}/></td>
                                                        <td>{product.category}</td>
                                                        <td>{product.discount}%</td>
                                                        <td>
                                                            <a href={`/admin/product/${product.id}`}><i
                                                                className="bi bi-pen"></i></a>
                                                        </td>
                                                        <td>
                                                            <i className="bi bi-trash" onClick={() => {
                                                                this.deleteRow(product.id)
                                                            }}></i>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        )}
                                        </tbody>
                                        <tfoot>
                                        <p className="book-available">{this.state.total} books
                                            available</p>
                                        <div className="arr">{arr}</div>
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
                                    <a className="admin-navigation current-pos" href={fe_url + "admin/products"}>Manage
                                        books</a>
                                    <a className="admin-navigation" href={fe_url + "admin/orders"}>Manage orders</a>
                                    <a className="admin-navigation" href={fe_url + "admin/vouchers"}>Manage vouchers</a>
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
                                        <h1 className="manager">Books</h1>
                                        <a className="btn btn-success btn-add" href={fe_url + "admin/product/add"}>Add
                                            new</a>
                                        <tr>
                                            <th className="table_header">Book Name</th>
                                            <th className="table_header">Price</th>
                                            <th className="table_header">In stock</th>
                                            <th className="table_header">Image</th>
                                            <th className="table_header">Category</th>
                                            <th className="table_header">Discount</th>
                                            <th className="table_header">Update</th>
                                            <th className="table_header">Delete</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        </tbody>
                                        <tfoot>
                                        <p className="book-available">0 books
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