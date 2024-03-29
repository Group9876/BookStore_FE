import React from "react";
import withRouter from "../product/WithRouter";
import "./Bill.css"
import {fe_url} from "../others/Share";
import Header from "../header/Header";
import Footer from "../footer/Footer";

class FailNotify extends React.Component {

    handleContinue = () => {
        window.location.href = fe_url
    }

    render() {
        return (
            <>
                <Header/>
                <div className="boxinnotif mt-5 mb-5">
                    <div className="mess pt-3">
                        <h4>Order failed! Please try again later!</h4>
                    </div>
                    <div className="text-center pb-3">
                        <button className="btn-outline-dark" onClick={this.handleContinue}>Continue shopping >></button>
                    </div>
                </div>
                <Footer/>
            </>
        )
    }
}

export default withRouter(FailNotify)