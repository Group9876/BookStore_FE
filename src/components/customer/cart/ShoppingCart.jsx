import React from "react";
import "./ShoppingCart.css"
import req, {be_url, fe_url, role, userId} from "../../others/Share";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import NotFound from "../../others/NotFound";

export default class ShoppingCart extends React.Component {

    state = {
        outputCarts: [],
        total: 0
    }

    url = be_url + "cart/"

    componentDidMount() {
        console.log("fetch")
        this.fetchProducts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.reloadList !== prevProps.reloadList) {
            window.location.reload();
            this.fetchProducts();
        }
    }

    fetchProducts = () => {
        req.get(this.url + userId).then((res) => {
            const outputCarts = res.data;
            let totalPrice = 0;
            outputCarts.forEach(product => {
                // totalPrice += (product.price - product.price * product.discount / 100) * product.quantity;
                totalPrice += product.price * product.quantity;

            });
            console.log(totalPrice)
            this.setState({
                outputCarts: outputCarts,
                total: totalPrice
            });
        });
    };

    handleDelete = (id) => {
        req.delete(this.url + userId + `/${id}`).then(res => {
            this.fetchProducts();
        });
    };

    handleIncrement = (outputCart) => {
        const productId = outputCart.productId;
        const quantity = outputCart.quantity + 1;
        this.handleClick(quantity, productId);
        this.updateState(quantity, productId)
    };

    handleDecrement = (outputCart) => {
        const productId = outputCart.productId;
        const quantity = outputCart.quantity - 1;
        if (quantity > 0) {
            this.handleClick(quantity, productId);
            this.updateState(quantity, productId)
        } else if (quantity === 0) {
            this.handleDelete(productId)
        }
    };

    updateState = (quantity, productId) => {
        let totalPrice = 0;
        let outputCarts = this.state.outputCarts
        outputCarts.map((item) => {
            if (item.productId === productId) {
                item.quantity = quantity;
            }
            totalPrice += (item.price - item.price * item.discount / 100) * item.quantity;
            return quantity;
        })
        this.setState({
            outputCarts: outputCarts,
            total: totalPrice
        })
    }

    handleClick = (quantity, productId) => {
        req.put(this.url + userId + "/" + productId + "/" + quantity)
            .then((res) => {

            })
            .catch(error => {
                this.setState({
                    statusCode: error.response.status,
                    errorMessage: error.message,
                })
            })
    };

    handleCheckout = () => {
        let itemList = [];
        let total = 0;
        for (let i = 0; i < this.state.outputCarts.length; i++) {
            const outputCart = this.state.outputCarts[i]
            const data = {}
            data.productId = outputCart.productId
            data.images = outputCart.images
            data.price = outputCart.price - outputCart.price * outputCart.discount / 100
            data.name = outputCart.name
            data.quantity = outputCart.quantity
            itemList[i] = data
            // total = total + (outputCart.price - outputCart.price * outputCart.discount / 100) * outputCart.quantity
            total = total + (outputCart.price) * outputCart.quantity

        }
        localStorage.setItem("total", total)
        localStorage.setItem("items", JSON.stringify(itemList));
        localStorage.setItem("isFromCart", "true")
        window.location.href = `${fe_url}orders`;
    }


    render() {
        if (role === "ROLE_CUSTOMER") {
            return (
                <>
                    <Header/>
                    <div className="container text-center mt-3">
                        <table className="table">
                            <thead>
                            <tr>
                                <th colSpan="5" className="h3">My shopping cart</th>
                            </tr>
                            <tr className="h5">
                                <th></th>
                                <th>Book name</th>
                                <th>Book price</th>
                                <th>Number</th>
                                <th>Delete</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.outputCarts
                                    .map(outputCart =>
                                        <tr key={outputCart.productId}>
                                            <td><img src={outputCart.images[0]} alt="img"></img></td>
                                            <td><a href={"/product/"+outputCart.productId}>{outputCart.name}</a></td>
                                            <td> {outputCart.price - outputCart.price * outputCart.discount / 100} $</td>
                                            <td>
                                                <div className='bar'>
                                                    <button className='nBtn'
                                                            onClick={() => this.handleIncrement(outputCart)}>+
                                                    </button>
                                                    <span className='number'>{outputCart.quantity}</span>
                                                    <button className='nBtn'
                                                            onClick={() => this.handleDecrement(outputCart)}>-
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn green-btn" onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this book?")) {
                                                        this.handleDelete(outputCart.productId);
                                                    }
                                                }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )
                            }
                            </tbody>
                        </table>
                        <p>Total price: <strong>{this.state.total} $</strong></p>
                        <button className='buyNow' onClick={this.handleCheckout}>
                            Buy now
                        </button>
                    </div>
                    <Footer/>
                </>
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