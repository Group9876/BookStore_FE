import React from "react";
import withRouter from "../product/WithRouter";
import "./Order.css"
import req, {be_url, role, userId} from "../share/Share";
import Header from "../share/header/Header";
import NotFound from "../share/notfound/NotFound";
import Footer from "../share/footer/Footer";

class CheckoutOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: JSON.parse(localStorage.getItem("items")),
            total: parseFloat(localStorage.getItem("total")),
            userInfo: {},
            vouchers: [],
            newTotal: parseFloat(localStorage.getItem("total")),
        }
    }

    componentDidMount() {
        this.fetchUserInfo();
        this.fetchVoucherByUserId();
    }

    fetchUserInfo = () => {
        let url
        if (role() === "ROLE_CUSTOMER") {
            url = `${be_url}customer/${userId()}`
        } else {
            url = `${be_url}admin/user/${userId()}`
        }
        req.get(url)
            .then((res) => {
                this.setState({userInfo: res.data.data})
            })
    }

    fetchVoucherByUserId = () => {
        req.get(be_url + "vouchers/" + userId())
            .then((res) => {
                this.setState({vouchers: res.data.data})
            })
    }

    deleteOutdatedVoucher = (id) => {
        req.delete(be_url + "voucher/" + id)
            .then((res) => {
                alert("Deleted outdated vouchers.")
                this.setState({vouchers: this.state.vouchers.filter((voucher) => voucher.id !== id)})
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
        console.log(this.state.paymentMethod)
        if (this.state.paymentMethod === 'online') {
            dataToCheckout.paymentMethod = 'PAYPAL'
        } else {
            dataToCheckout.paymentMethod = "CASH"
        }
        if (this.state.userName) {
            dataToCheckout.userName = this.state.userName
        } else {
            dataToCheckout.userName = this.state.userInfo.username
        }
        if (this.state.userPhone) {
            dataToCheckout.userPhone = this.state.userPhone
        } else {
            dataToCheckout.userPhone = this.state.userInfo.phone
        }
        if (this.state.addressToReceive) {
            dataToCheckout.addressToReceive = this.state.addressToReceive
        } else {
            dataToCheckout.addressToReceive = this.state.userInfo.address
        }
        if (this.state.voucherChosen) {
            this.setState({total: this.state.newTotal}, () => {
                localStorage.setItem('total', this.state.total);
            })
            dataToCheckout.voucherId = this.state.voucherChosen.id
        } else {
            dataToCheckout.voucherId = -1
        }
        dataToCheckout.messageOfCustomer = this.state.messageOfCustomer

        localStorage.setItem('dataToCheckout', JSON.stringify(dataToCheckout));
        localStorage.setItem('products', localStorage.getItem("items"));
        window.location = "/bill"
    }

    handleSelectVoucher = (e) => {
        const voucherChosen = JSON.parse(e.target.value)
        if (new Date(voucherChosen.dueDate).valueOf() < Date.now().valueOf()) {
            console.log(1)
            this.deleteOutdatedVoucher(voucherChosen.id)
        } else {
            const newTotal = this.state.total * (1 - voucherChosen.rate / 100)
            this.setState({voucherChosen, newTotal}, () => {
                localStorage.setItem('total', this.state.total);
            })
        }
    }

    handleSelectChange = (e) => {
        const paymentMethod = e.target.value
        this.setState({paymentMethod: paymentMethod})
    }
    handleChange = (e) => {
        switch (e.target.name) {
            case "userName":
                this.setState({userName: e.target.value});
                break
            case "userPhone":
                this.setState({userPhone: e.target.value});
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
        if (role() === "ROLE_CUSTOMER" || role() === "ROLE_ADMIN") {
            if (this.state.items && this.state.items.length !== 0) {
                return (<>
                        <div className="checkoutContainer">
                            <div className="userInfo">
                                <h2 className="text-center mb-4">Checkout information</h2>
                                <form className="checkoutForm out card">
                                    <label className="h6 guide">Name</label>
                                    <input className="checkout p-3" required name="userName" placeholder="User's name"
                                           defaultValue={this.state.userInfo.username}
                                           onChange={this.handleChange}></input>

                                    <label className="h6 guide">Phone number</label>
                                    <input className="checkout p-3" required name="userPhone" placeholder="Phone number"
                                           defaultValue={this.state.userInfo.phone}
                                           onChange={this.handleChange}></input>

                                    <label className="h6 guide">Address</label>
                                    <input className="checkout p-3" required name="addressToReceive"
                                           defaultValue={this.state.userInfo.address}
                                           placeholder="Address to receive"
                                           onChange={this.handleChange}></input>


                                    <label className="h6 guide">Note</label>
                                    <input className="checkout p-3" required name="messageOfCustomer"
                                           placeholder="Message to shop"
                                           onChange={this.handleChange}></input>

                                    <label className="h6 guide">Payment method</label>
                                    <select className="form-control enter" onChange={this.handleSelectChange}>
                                        <option value="cash">By cash</option>
                                        <option value="online">Online</option>
                                    </select>
                                </form>
                            </div>

                            <div className="bill">
                                <h2 className="mb-4">Products information</h2>
                                <div className="productInfo">
                                    {this.state.items.map(item =>
                                        <div className="contentProductInfo" key={item.productId}>
                                            <img src={item.images[0]} alt="product"></img>
                                            <h5 className="text-start">{item.name}</h5>
                                            <p>{item.price.toFixed(2)} $</p>
                                            <p className="quantity_order">Quantity: {item.quantity}</p>
                                        </div>)}


                                    <div className="amount">
                                        <div className="voucher">
                                            <strong>Select voucher</strong>
                                            <select className="form-control enter"
                                                    onChange={this.handleSelectVoucher}>
                                                <option defaultChecked>No voucher selected</option>
                                                {this.state.vouchers.map((voucher) => (
                                                    <option key={voucher.id}
                                                            value={JSON.stringify(voucher)}>{voucher.title}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <h5>Total: {this.state.newTotal.toFixed(2)} $</h5>
                                        </div>
                                    </div>
                                    <div className="text-center pt-2">
                                        <button className="btn checkoutBtn" onClick={this.handleCheckout}>Checkout
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </>
                )
            } else {
                return (
                    <NotFound title='(╥﹏╥) No items found!'
                              details='Perhaps you should add some items to your cart first!'/>)
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

export default withRouter(CheckoutOrder)
