import React from "react";
import withRouter from "../products/WithRouter";
import "./Bill.css";
import req, {checkout_url, fe_url, role} from "../others/Share";
import Header from "../header/Header";
import NotFound from "../others/NotFound";
import Footer from "../footer/Footer";

class CheckBill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: JSON.parse(localStorage.getItem("products")),
            total: localStorage.getItem("total"),
            dataToCheckout: JSON.parse(localStorage.getItem("dataToCheckout")),
        };
    }

    handleConfirm = () => {
        if (this.state.dataToCheckout.paymentMethod === "cash") {
            window.location.href = fe_url + "success";
        }

        if (this.state.dataToCheckout.paymentMethod === "online") {
            localStorage.setItem("dataToLak", "hehe là nó nè");
            //  handel online payment
            req
                .post(checkout_url + this.state.total)
                .then((response) => {
                    localStorage.setItem("dataToPay", JSON.stringify(response.data));
                    const resdata = response.data;
                    const url = resdata[1].href;
                    window.location.href = url;
                })
                .catch((error) => {
                    console.log(error);
                });
            // window.location.href = fe_url + "success";

        }
    };

    render() {
        if (role === "ROLE_CUSTOMER") {
            return (
                <div className="container">
                    <div className="title">
                        <h3>Confirm order information</h3>
                    </div>
                    <div className="boxofbill">
                        <h3>Delivery address</h3>
                        <div className="address">
                            <p className="nameinbill">
                                {this.state.dataToCheckout.customerName}
                            </p>
                            <p className="phoneinbill">{this.state.dataToCheckout.phone}</p>
                            <p className="addDetail">
                                {" "}
                                {this.state.dataToCheckout.addressToReceive}
                            </p>
                        </div>
                    </div>
                    <div className="boxofbill">
                        <h4>Note:</h4>
                        <p>{this.state.dataToCheckout.messageOfCustomer}</p>
                    </div>

                    <div className="boxofbill">
                        {this.state.items.map((item) => (
                            <div className="contentProductInfo" key={item.productId}>
                                <img src={item.images[0]} alt="product"></img>
                                <p>{item.name}</p>
                                <h6>{item.price} $</h6>
                                <p className="quantity_order">Quantity: {item.quantity}</p>
                                <p className="total">{item.quantity * item.price} $</p>
                            </div>
                        ))}
                        <div className="amount">
                            <h5>Total: {this.state.total} $</h5>
                        </div>
                        <div className="amount">
                            <h5>Payment: {this.state.dataToCheckout.paymentMethod}</h5>
                        </div>
                    </div>
                    <div className="btnconfirm">
                        <button onClick={this.handleConfirm}>Confirm</button>
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    <Header/>
                    <NotFound
                        title="(╥﹏╥) Access denied!"
                        details="You have no permission to access this page!"
                    />
                    <Footer/>
                </>
            );
        }
    }
}

export default withRouter(CheckBill);


