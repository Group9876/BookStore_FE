import React from "react";
import withRouter from "../product/WithRouter";
import "./Bill.css"

class FailNotify extends React.Component {


    handleContinue = () => {
        window.location = "/home"
    }

    render() {
        return (
            <div className="boxinnotif mt-5 mb-5">
                <div className="mess pt-4">
                    <h4>Order failed! Please try again later!</h4>
                </div>
                <div className="text-center p-3">
                    <button className="btn-outline-dark px-3" onClick={this.handleContinue}>Continue shopping ➤
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(FailNotify)