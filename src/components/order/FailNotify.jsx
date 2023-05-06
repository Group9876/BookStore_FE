import React from "react";
import withRouter from "../products/WithRouter";
import "./Bill.css"
import req, { be_url, fe_url, userId } from "../others/Share";

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