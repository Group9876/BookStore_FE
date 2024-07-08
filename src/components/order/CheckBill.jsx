import React from "react";
import withRouter from "../product/WithRouter";
import "./Bill.css"
import req, {be_url, checkout_url, role, userId} from "../share/Share";
import NotFound from "../share/notfound/NotFound";

class CheckBill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: JSON.parse(localStorage.getItem("products")),
            total: parseFloat(localStorage.getItem("total")),
            dataToCheckout: JSON.parse(localStorage.getItem("dataToCheckout"))
        }
    }


    handleConfirm = () => {
        if (this.state.dataToCheckout.paymentMethod === "CASH") {
            req.post(be_url + "order/" + userId(), this.state.dataToCheckout)
                .then(() => {
                    console.log("Saved order.")
                    window.location = "/success"
                })
                .catch((error) => {
                    console.log(error)
                })
        } else if (this.state.dataToCheckout.paymentMethod === "PAYPAL") {
            //  handel online payment
            req.post(checkout_url + this.state.total)
                .then((response) => {
                    console.log("Confirm payment with paypal.")
                    localStorage.setItem("dataToPay", JSON.stringify(response.data.data));
                    const resdata = response.data.data;
                    alert("Redirect to payment page: " + resdata[1].href)
                    window.location = resdata[1].href;
                    window.location = resdata[1].href;
                })
                .catch((error) => {
                    console.log(error);
                });
            //window.location.href = fe_url + "success";
        }
    }

    render() {
        if (role() === "ROLE_CUSTOMER" || role() === "ROLE_ADMIN") {
            if (this.state.items && this.state.items.length !== 0) {
                return (<>
                        <div className="container">
                            <div className="row p-3">
                                <div className="col-auto"></div>
                                <div className="col-8">
                                    <div className="title">
                                        <h2>Confirm order information</h2></div>
                                    <div className="boxofbill p-3">
                                        <h3>Delivery address</h3>
                                        <div className="address">
                                            <p className="nameinbill">{this.state.dataToCheckout.userName}</p>
                                            <p className="phoneinbill">{this.state.dataToCheckout.userPhone}</p>
                                            <p className="addDetail"> {this.state.dataToCheckout.addressToReceive}</p>
                                        </div>
                                    </div>
                                    <div className="boxofbill p-3">
                                        <h4>Note:</h4>
                                        <p>{this.state.dataToCheckout.messageOfCustomer}</p>
                                    </div>

                                    <div className="boxofbill p-3">
                                        {this.state.items.map(item =>
                                            <div className="contentProductInfo" key={item.productId}>
                                                <img src={item.images[0]} alt="product"></img>
                                                <p>{item.name}</p>
                                                <h6>{item.price.toFixed(2)} $</h6>
                                                <p className="quantity_order">Quantity: {item.quantity}</p>
                                                <p className="total">{(item.quantity * item.price).toFixed(2)} $</p>
                                            </div>)}
                                        <div className="amount">
                                            <h5>{"Total: " + this.state.total.toFixed(2) + " $"}</h5>
                                        </div>
                                        <div className="amount">
                                            <h5>Payment: {this.state.dataToCheckout.paymentMethod}</h5>
                                        </div>

                                    </div>
                                    <div className="text-center">
                                        <button className="btn checkoutBtn mt-3" onClick={this.handleConfirm}>Confirm
                                            this order
                                        </button>
                                    </div>

                                </div>
                                <div className="col-auto"></div>
                            </div>
                        </div>
                    </>
                )
            } else {
                return (
                    <NotFound title='∘ ∘ ∘ ( °ヮ° ) ? No items found!'
                              details='Perhaps you should make an order first!'/>
                )
            }
        } else {
            return (
                <NotFound title='(╥﹏╥) Access denied!' details='You have no permission to access this page!'/>
            )
        }
    }
}

export default withRouter(CheckBill)