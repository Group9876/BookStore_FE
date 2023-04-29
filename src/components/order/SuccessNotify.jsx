import React from "react";
import withRouter from "../products/WithRouter";
import "./Bill.css"
import {fe_url, role} from "../others/Share";
import Header from "../header/Header";
import NotFound from "../others/NotFound";
import Footer from "../footer/Footer";

class SuccessNotify extends React.Component {

    handleContinue = () => {
        window.location.href = fe_url
    }

    handleViewOrder = () => {
        window.location.href = fe_url + "order"
    }

    render() {
        if (role === "ROLE_CUSTOMER") {
            return ( <>
            <Header/>
                <div className="boxinnotif">
                    <div className="mess">
                        <h4>Order succesfully!</h4>
                    </div>
                   
                    <div className="mess">
                        <button onClick={this.handleContinue}>Continue shopping</button>
                    </div>
                </div>

             
                <Footer/>
                </>
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

export default withRouter(SuccessNotify)