import React from "react";
import req, {be_url, fe_url, role} from "../others/Share";
import withRouter from '../product/WithRouter';
import Header from "../header/Header";
import NotFound from "../others/NotFound";
import Footer from "../footer/Footer";

class OrderByStatus extends React.Component {
    state = {
        status: new URLSearchParams(this.props.location.search).get("status"),
        orders: []
    }
    base_link = fe_url + "admin/orders?status="

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
                                    <a className="admin-navigation current-pos" href={fe_url + "admin/orders"}>Manage
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
                                    <h1 className="manager">
                                        {this.state.status === "customer_confirmed" && <>Checked Out </>}
                                        {this.state.status === "admin_preparing" && <>Preparing </>}
                                        {this.state.status === "shipping" && <>Shipping </>}
                                        {this.state.status === "customer_request_cancel" && <>Cancel Request </>}
                                        Orders</h1>
                                    <tr>
                                        <th>Books information</th>
                                        <th>Payment method</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.orders.map(order =>
                                        (<tr key={order.id}>
                                            {order.items.map(item => (<tr className="item" key={item.productId}>
                                                <td><img src={item.images[0]} alt="product"></img></td>
                                                <td>{item.productName}</td>
                                                <td>{item.category}</td>
                                                <td>{item.price} $</td>
                                                <td>Quantity: {item.quantity}</td>
                                            </tr>))}
                                            <td>By {order.paymentMethod}</td>
                                            <td>{order.total} $</td>
                                            {(role === "ROLE_ADMIN" && order.orderStatus === "customer_confirmed") &&
                                                <button
                                                    onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "admin_preparing")}>Prepare</button>}&nbsp;
                                            {(role === "ROLE_ADMIN" && order.orderStatus === "admin_preparing") &&
                                                <button
                                                    onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "shipping")}>Ship</button>}&nbsp;
                                            {order.orderStatus === "customer_confirmed" && <button
                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "customer_canceled")}>Deny</button>}&nbsp;
                                            {order.orderStatus === "customer_request_cancel" && <button
                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "customer_canceled")}>Accept</button>}&nbsp;
                                            {order.orderStatus === "customer_request_cancel" && <button
                                                onClick={() => this.handleUpdateStatus(order.id, order.orderStatus, "shipping")}>Deny</button>}

                                        </tr>)
                                    )}
                                    </tbody>
                                    <tfoot>
                                    <p className="book-available">{this.state.orders.length} order(s)
                                        available</p>
                                    </tfoot>
                                </table>
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

export default withRouter(OrderByStatus)