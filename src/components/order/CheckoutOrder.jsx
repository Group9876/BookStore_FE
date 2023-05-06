import React from "react";
import withRouter from "../products/WithRouter";
import "./Order.css"
import req, {be_url, fe_url, role, userId} from "../others/Share";
import Header from "../header/Header";
import NotFound from "../others/NotFound";
import Footer from "../footer/Footer";

class CheckoutOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: JSON.parse(localStorage.getItem("items")),
            total: localStorage.getItem("total"),
            userInfo: {}
        }
    }

    componentDidMount() {
        this.fetchUserInfo();
    }

    fetchUserInfo = () => {
        req.get(be_url + "customer/" + userId)
            .then((res) => {
                this.setState({userInfo: res.data})
            })
    }

    handleCheckout = () => {
        const dataToCheckout = {}
        const itemsToCheckout = []
        for (let i = 0; i < this.state.items.length; i++) {
            const item = {}
            item.productId = this.state.items[i].productId
            item.quantity = this.state.items[i].quantity
            itemsToCheckout[i] = item
        }
        dataToCheckout.items = itemsToCheckout
        if (this.state.paymentMethod) {
            dataToCheckout.paymentMethod = this.state.paymentMethod
        } else {
            dataToCheckout.paymentMethod = "cash"
        }
        dataToCheckout.customerName = this.state.customerName
        dataToCheckout.phone = this.state.phone
        dataToCheckout.messageOfCustomer = this.state.messageOfCustomer
        dataToCheckout.addressToReceive = this.state.addressToReceive
        dataToCheckout.voucherId = this.state.voucher

        localStorage.setItem('dataToCheckout', JSON.stringify(dataToCheckout));
        localStorage.setItem('products', localStorage.getItem("items"));

        localStorage.setItem('total', localStorage.getItem("total"));

        req.post(be_url + "order/" + userId, dataToCheckout)
            .then(() => {
                localStorage.removeItem("items")
                // localStorage.removeItem("total")
                // window.location.href = fe_url + "order?status=customer_confirmed"
                window.location.href = fe_url + "bill"
            })
            .catch((error) => {
                console.log(error)
            })


    }

    handleSelectChange = (e) => {
        const paymentMethod = e.target.value
        this.setState({paymentMethod: paymentMethod})
    }
    handleChange = (e) => {
        switch (e.target.name) {
            case "customerName":
                this.setState({customerName: e.target.value});
                break
            case "phone":
                console.log(e.target.value)
                this.setState({phone: e.target.value});
                break
            case "addressToReceive":
                this.setState({addressToReceive: e.target.value});
                break
            case "messageOfCustomer":
                this.setState({messageOfCustomer: e.target.value});
                break
            case "voucher":
                this.setState({voucher: e.target.value});
                break
            default:
                throw new Error("error")
        }
    }

    render() {
        if (role === "ROLE_CUSTOMER") {
            return (
                <div className="checkoutContainer">
                    <div className="userInfo">
                        <h3>Checkout information</h3>
                        <form className="form out card">
                            <label className=" h6 guide">Name</label>
                            <input className="checkout" required name="customerName" placeholder="User name"
                                   onChange={this.handleChange}></input>

                            <label className=" h6 guide">Phone number</label>
                            <input className="checkout" required name="phone" placeholder="Phone number"
                                   onChange={this.handleChange}></input>

                            <label className="h6 guide">Address</label>
                            <input className="checkout" required name="addressToReceive"
                                   placeholder="Address to receive"
                                   onChange={this.handleChange}></input>


                            <label className="h6 guide">Note</label>
                            <input className="checkout" required name="messageOfCustomer" placeholder="Message to shop"
                                   onChange={this.handleChange}></input>

                            <label className=" h6 guide ">Payment method</label>
                            <select className="form-control enter" onChange={this.handleSelectChange}>
                                <option>Select Payment Method</option>
                                <option value="cash">By cash</option>
                                <option value="online">Online</option>

                            </select>

                        </form>

                    </div>


                    <div className="bill">
                        <h3>Products information</h3>
                        <div className="productInfo">
                            {this.state.items.map(item =>
                                <div className="contentProductInfo" key={item.productId}>
                                    <img src={item.images[0]} alt="product"></img>
                                    <h4>{item.name}</h4>
                                    <p>{item.price} $</p>
                                    <p className="quantity_order">Quantity: {item.quantity}</p>
                                </div>)}


                            <div className="amount">
                                <div className="voucher">
                                    <input placeholder="voucher code" name="voucher"
                                           onChange={this.handleChange}></input>
                                    <button>Use</button>
                                </div>
                                <div>
                                    <h5>Total: {this.state.total} $</h5>
                                </div>
                            </div>

                            <button onClick={this.handleCheckout}>Checkout</button>
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

export default withRouter(CheckoutOrder)