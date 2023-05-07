import React from "react";
import req, {be_url, fe_url, role} from "../others/Share";
import withRouter from "../product/WithRouter";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import NotFound from "../others/NotFound";

class OrderByStatus extends React.Component {
    state = {
        status: new URLSearchParams(this.props.location.search).get("status"),
        orders: []
    }
    base_link = fe_url + "order?status="

    componentDidMount() {
        this.fetchOrderByStatus();
    }

    fetchOrderByStatus = () => {
        req.get(be_url + "order?status=" + this.state.status)
            .then((res) => {
                this.setState({orders: res.data})
            })
            .catch((error) => {
                console.log(error)
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.reloadList !== prevProps.reloadList) {
            this.fetchOrderByStatus();
        }
    }

    handleUpdateStatus = async (id, fromStatus, toStatus) => {
        const body = {
            fromStatus: fromStatus,
            toStatus: toStatus,
        };
        try {
            if (id) {
                await req.put(be_url + "order/" + id, body);
                const updatedOrders = [...this.state.orders];
                const updatedOrderIndex = updatedOrders.findIndex(order => order.id === id);
                updatedOrders[updatedOrderIndex].orderStatus = toStatus;
                this.setState({orders: updatedOrders});
                this.fetchOrderByStatus();
            }
        } catch (error) {
            console.log(error);
        }
    }


    render() {
        if (role === "ROLE_CUSTOMER") {
            return (<>
                    <Header/>
                    <div>
                        <div className="order_list">
                            <h1>{"Orders: " + this.state.status}</h1>
                        </div>
                        {this.state.orders.length !== 0 &&
                            <div className="order_item">
                                <hr></hr>
                                {
                                    this.state.orders.map(order => (
                                        <div key={order.id}>
                                            <hr></hr>
                                            {order.items.map(item => (<div className="item" key={item.productId}>
                                                <p><img src={item.images[0]} alt="product"></img></p>
                                                <p className="name_cat"><h4>{item.productName}</h4>
                                                    <p>{item.category}</p></p>
                                                <p className="price_quant"><h6>{item.price} $</h6>
                                                    <p>Quantity: {item.quantity}</p></p>
                                                <p>Total/1 item: {item.price * item.quantity} $</p>
                                            </div>))}
                                            <p>Payment method: {order.paymentMethod}</p>
                                            <p>Total order: {order.total} $</p>

                                            {(role === "ROLE_CUSTOMER" && order.orderStatus === "admin_preparing") &&
                                                <button
                                                    onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "customer_request_cancel")}>Request
                                                    cancel</button>}&nbsp;
                                            {order.orderStatus === "customer_confirmed" && <button
                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "customer_canceled")}>Cancel</button>}&nbsp;
                                            {(role === "ROLE_CUSTOMER" && order.orderStatus === "shipping") && <button
                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "success")}>Received</button>}&nbsp;
                                            <hr></hr>
                                        </div>))
                                }
                            </div>
                        }
                        {this.state.orders.length === 0 && <NotFound title="(╥﹏╥)No order found!"
                                                                     details={"There is no order being " + this.state.status}></NotFound>}
                    </div>
                    <Footer/>
                </>
            )
        } else {
            return (
                <>
                    <Header/>
                    <NotFound title='(╥﹏╥) 404 error: Page not found!'
                              details='We cannot find this page, please try again later!'/>
                    <Footer/>
                </>
            )
        }
    }
}

export default withRouter(OrderByStatus)