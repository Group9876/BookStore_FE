import React from "react";
import withRouter from "../product/WithRouter";
import "./Bill.css"
import req, {be_url, userId} from "../share/Share";

class SuccessNotify extends React.Component {

    deleteItems = () => {
        req.delete(be_url + "cart/" + userId())
            .then(() => {
                console.log("Cart deleted successfully.");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        let dataToCheckout = JSON.parse(localStorage.getItem("dataToCheckout"))
        if (dataToCheckout)
            req.post(be_url + "order/" + userId(), dataToCheckout)
                .then(() => {
                    if (localStorage.getItem("isFromCart") === "true") {
                        this.deleteItems();
                    }
                    localStorage.removeItem("isFromCart")
                    localStorage.removeItem("items")
                    localStorage.removeItem("total")
                    localStorage.removeItem("dataToCheckout")
                    localStorage.removeItem("products")
                    console.log("Saved order.")
                })
                .catch((error) => {
                    console.log(error)
                })
    }

    handleContinue = () => {
        window.location = "/home"
    }

    render() {
        return (
            <div className="boxinnotif mt-5 mb-5">
                <div className="mess pt-3">
                    <h4>Order successfully!</h4>
                </div>
                <div className="text-center p-3">
                    <button className="btn-outline-dark px-3" onClick={this.handleContinue}>Continue shopping ➤
                    </button>
                </div>

            </div>
        )
    }
}

export default withRouter(SuccessNotify)