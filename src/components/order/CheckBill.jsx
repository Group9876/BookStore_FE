import React from "react";
import withRouter from "../product/WithRouter";
import "./Bill.css"
import  req, {be_url, userId, fe_url, role} from "../others/Share";
import Header from "../header/Header";
import NotFound from "../others/NotFound";
import Footer from "../footer/Footer";

class CheckBill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: JSON.parse(localStorage.getItem("products")),
            total: localStorage.getItem("total"),
            dataToCheckout: JSON.parse(localStorage.getItem("dataToCheckout"))
        }
    }


    handleConfirm = () => {
        if (this.state.dataToCheckout.paymentMethod === "cash") {
            req.post(be_url + "order/" + userId, this.state.dataToCheckout)
                .then(() => {

                })
                .catch((error) => {
                    console.log(error)
                })
            if (localStorage.getItem("isFromCart") === "true") {
                this.deleteItems();
            }
            window.location.href = fe_url + "success"
            localStorage.removeItem("isFromCart")
            localStorage.removeItem("items")
            localStorage.removeItem("total")
            localStorage.removeItem("dataToCheckout")
            localStorage.removeItem("products")
        }

    }

    deleteItems = () => {
        req.delete(be_url + "cart/" + userId)
            .then(() => {
                console.log("Cart deleted successfully.");
            })
            .catch((error) => {
                console.log(error);
            });
    }


    render() {
        if (role === "ROLE_CUSTOMER") {
            if (this.state.items && this.state.items.length !== 0) {
                return (<>
                        <Header/>
                        <div className="container">
                            <div className="row">
                                <div className="col-auto"></div>
                                <div className="col-8">
                                    <div className="title">
                                        <h3>Confirm order information</h3></div>
                                    <div className="boxofbill">
                                        <h3>Delivery address</h3>
                                        <div className="address">
                                            <p className="nameinbill">{this.state.dataToCheckout.customerName}</p>
                                            <p className="phoneinbill">{this.state.dataToCheckout.phone}</p>
                                            <p className="addDetail"> {this.state.dataToCheckout.addressToReceive}</p>
                                        </div>
                                    </div>
                                    <div className="boxofbill">
                                        <h4>Note:</h4>
                                        <p>{this.state.dataToCheckout.messageOfCustomer}</p>
                                    </div>

                                    <div className="boxofbill">
                                        {this.state.items.map(item =>
                                            <div className="contentProductInfo" key={item.productId}>
                                                <img src={item.images[0]} alt="product"></img>
                                                <p>{item.name}</p>
                                                <h6>{item.price} $</h6>
                                                <p className="quantity_order">Quantity: {item.quantity}</p>
                                                <p className="total">{item.quantity * item.price} $</p>
                                            </div>)}
                                        <div className="amount">
                                            <h5>{"Total: " + this.state.total + " $"}</h5>
                                        </div>
                                        <div className="amount">
                                            <h5>Payment: {this.state.dataToCheckout.paymentMethod}</h5>
                                        </div>

                                    </div>
                                    <div className="text-center">
                                        <button className="btn btn-outline-dark" onClick={this.handleConfirm}>Confirm
                                        </button>
                                    </div>

                                </div>
                                <div className="col-auto"></div>
                            </div>
                        </div>
                        <Footer/>
                    </>
                )
            } else {
                return (
                    <>
                        <Header/>
                        <NotFound title='(╥﹏╥) No items found!' details='Perhaps you should make an order first!'/>
                        <Footer/>
                    </>
                )
            }
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

export default withRouter(CheckBill)
