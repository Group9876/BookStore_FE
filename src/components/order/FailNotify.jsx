import React from "react";
import withRouter from "../product/WithRouter";
import "./Bill.css"
import {fe_url} from "../others/Share";

class FailNotify extends React.Component {

    handleContinue = () => {
        window.location.href = fe_url
    }

    render() {
        return (
            <div className="boxinnotif">
                <div className="mess">
                    <h4>Order Fail!</h4>
                </div>
                <div className="mess">
                    <button onClick={this.handleContinue}>Continue shopping</button>
                </div>

            </div>
        )
    }
}

export default withRouter(FailNotify)