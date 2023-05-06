import React from "react";
import "../others/backup/Admin.css";
import req, {be_url, fe_url, role} from "../others/Share";
import NotFound from "../others/NotFound";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import axios from "axios";

export default class ProductAdd extends React.Component {
    state = {
        name: '',
        description: '',
        price: '',
        inStock: '',
        images: '',
        category: '',
        discount: ''
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

    handleAddImage = (e) => {
        if (e.target.id === "images") {
            const images = e.target.value.split(",");
            this.setState({[e.target.id]: images});
        } else {
            this.setState({[e.target.id]: e.target.value});
        }
    }

    handleCategoryChange = (e) => {
        this.setState({
            category: e.target.value
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        event.target.reset();
        this.setState({
            name: '',
            description: '',
            price: '',
            inStock: '',
            images: [],
            category: '',
            discount: ''
        })

        const product = {
            name: this.state.name,
            description: this.state.description,
            price: Number(this.state.price),
            inStock: Number(this.state.inStock),
            images: this.state.images,
            category: this.state.category,
            discount: this.state.discount
        }

        req.post(be_url + 'admin/product', product)
            .then((res) => {
                if (res.status === 200) {
                    window.location = "/admin/products";
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
                                            <a href={fe_url + "admin/orders?status=customer_request_cancel"}>Cancel request</a>
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
                                    <h3 className=" text-primary-p-2 ">
                                        ADD NEW BOOK
                                    </h3>
                                    <form className="form add card " onSubmit={this.handleSubmit}>
                                        <label className=" h6 guide">Name</label>
                                        <input type="text" className="form-control enter" id="name"
                                               value={this.state.name} required
                                               onChange={this.handleChange}/>

                                        <label className=" h6 guide">Description</label>
                                        <input type="text" className="form-control enter" id="description"
                                               value={this.state.description}
                                               required onChange={this.handleChange}/>

                                        <label className="h6 guide">Price</label>
                                        <input type="number" min="0" className="form-control enter" id="price"
                                               value={this.state.price} required
                                               onChange={this.handleChange}/>


                                        <label className="h6 guide">Quantity</label>
                                        <input type="number" min="0" className="form-control enter" id="inStock"
                                               value={this.state.inStock}
                                               required
                                               onChange={this.handleChange}/>


                                        <label className="h6 guide">Images</label>
                                        <input type="text" className="form-control enter" id="images"
                                               value={this.state.images} required
                                               onChange={this.handleAddImage}/>

                                        <label className=" h6 guide ">Category</label>
                                        <select className="form-control enter" id="category"
                                                onChange={this.handleCategoryChange}>
                                            <option>Select Category</option>
                                            <option value="Comic">Comic</option>
                                            <option value="Detective">Detective</option>
                                            <option value="Literature">Literature</option>
                                            <option value="Adventure">Adventure</option>
                                            <option value="Classics">Classics</option>
                                            <option value="Fiction">Fiction</option>
                                            <option value="Horror">Horror</option>
                                        </select>

                                        <label className="h6 guide">Discount</label>
                                        <input type="text" min="0" className="form-control enter" id="discount"
                                               value="0" required
                                               onChange={this.handleAddImage}/>

                                        <div className="btnSubmit">
                                            <button type="submit" className="btn btn-primary  bg-success">Add Book
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