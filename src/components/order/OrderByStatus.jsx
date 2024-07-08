import React from "react";
import req, {be_url, role, userId} from "../share/Share";
import withRouter from "../product/WithRouter";
import NotFound from "../share/notfound/NotFound";

class OrderByStatus extends React.Component {
    state = {
        status: new URLSearchParams(this.props.location.search).get("status"),
        orders: [],
        pages: 0,
        current: 0,
    }

    componentDidMount() {
        this.fetchOrderByStatus();
    }

    fetchOrderByStatus = () => {
        req.get(`${be_url}order/0/${userId()}?status=${this.state.status.toUpperCase()}`)
            .then((res) => {
                console.log("Fetch orders by status " + this.state.status.toUpperCase())
                this.setState({
                    orders: res.data.data.content,
                    pages: res.data.data.totalPages,
                    current: res.data.data.number,
                })
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
            fromStatus: fromStatus.toUpperCase(),
            toStatus: toStatus.toUpperCase(),
        };
        try {
            if (id) {
                await req.put(be_url + "order/" + id, body).then(() => {
                    console.log("Status updated: " + fromStatus + " -> " + toStatus)
                })
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

    handleSwitch = (i) => {
        req.get(`${be_url}order/${i}/${userId()}?status=${this.state.status.toUpperCase()}`).then((res) => {
            console.log("[Normal] Switch to page " + i)
            this.setState({
                orders: res.data.data.content,
                current: i
            });
        })
    }


    render() {
        const arr = [];
        let max = 5;
        arr.push(<button disabled={this.state.current === 0} className="page page-click p-2"
                         key={"ad_pre_page_" + 0}
                         onClick={() => {
                             this.handleSwitch(0)
                         }}>◄</button>)
        for (let i = 0; i < this.state.pages; i++) {
            max--;
            if (this.state.current === i) {
                arr.push(<button className="page page-clicked" key={"ad_page_" + i}>{i + 1}</button>)
            } else {
                arr.push(<button className="page page-click" key={"ad_page_" + i} onClick={() => {
                    this.handleSwitch(i)
                }}>{i + 1}</button>)
            }
            if (max === 0) break
        }
        arr.push(<button disabled={this.state.current === this.state.pages - 1} className="page page-click p-2"
                         key={"search_pos_page_" + 0} onClick={() => {
            this.handleSwitch(this.state.pages - 1)
        }}>►</button>)
        if (role() === "ROLE_CUSTOMER" || role() === "ROLE_ADMIN") {
            return (
                <div>
                    {this.state.orders.length !== 0 && <div className="order_list">
                        <h1 className="py-3">
                            {this.state.status === "customer_confirmed" && <>Checked Out </>}
                            {this.state.status === "admin_preparing" && <>Preparing </>}
                            {this.state.status === "shipping" && <>Shipping </>}
                            {this.state.status === "success" && <>Successful </>}
                            {this.state.status === "customer_request_cancel" && <>Canceling </>}
                            {this.state.status === "canceled" && <>Canceled </>} Orders
                        </h1>
                    </div>}
                    {this.state.orders.length === 0 && <NotFound title="(˵ •̀ ᴗ - ˵ ) ✧ No orders found!"
                                                                 details="Please wait for the future updates!"></NotFound>}
                    {this.state.orders.length !== 0 &&
                        <div className="order_item">
                            {
                                this.state.orders.map(order => (
                                    <div className="line" key={order.id}>
                                        {order.items.map(item => (<div className="item" key={item.productId}>
                                            <p><img src={item.images[0]} alt="product"></img></p>
                                            <h5 className="name_cat">{item.name}</h5>
                                            <p className="price_quant px-3">Price: {item.price.toFixed(2)} $</p>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>))}
                                        <p className="mt-4">Address to receive: {order.addressToReceive}</p>
                                        <p>Total price: {order.total.toFixed(2)} $ - By {order.paymentMethod}</p>
                                        {(order.orderStatus === "admin_preparing".toUpperCase() || order.orderStatus === "customer_confirmed".toUpperCase()) &&
                                            <button className="btn btn-danger"
                                                    onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "customer_request_cancel")}>Cancel
                                                this order</button>}
                                        {order.orderStatus === "customer_request_cancel".toUpperCase() &&
                                            <button className="btn btn-primary mb-1"
                                                    onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "customer_confirmed")}>Restore</button>}
                                        {order.orderStatus === "shipping".toUpperCase() &&
                                            <button className="btn checkoutBtn mb-1"
                                                    onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "success")}>Received</button>}
                                        {order.orderStatus === "success".toUpperCase() &&
                                            <button className="btn btn-success" disabled>Succeeded</button>}
                                        {order.orderStatus === "canceled".toUpperCase() &&
                                            <button className="btn btn-secondary" disabled>Canceled</button>}
                                    </div>))
                            }
                        </div>
                    }
                    <div className="footer">
                        <div className="pagination">
                            {arr.map((item, index) => (<span key={"p" + index}>
                                                    {item}</span>
                            ))}
                        </div>
                    </div>
                </div>

            )
        } else {
            return (
                <NotFound title='(╥﹏╥) 404 error: Page not found!'
                          details='We cannot find this page, please try again later!'/>
            )
        }
    }
}

export default withRouter(OrderByStatus)