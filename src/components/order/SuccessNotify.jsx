import React from "react";
import withRouter from "../product/WithRouter";
import "./Bill.css"
import {fe_url, role} from "../others/Share";
import Header from "../header/Header";
import NotFound from "../others/NotFound";
import Footer from "../footer/Footer";

class SuccessNotify extends React.Component {

    handleContinue = () => {
        window.location.href = fe_url
    }

    render() {
        if (role === "ROLE_CUSTOMER") {
            return (
                <>
                    <Header/>
                    <div className="boxinnotif mt-5 mb-5">
                        <div className="mess pt-3">
                            <h4>Order succesfully!</h4>
                        </div>
                        <div className="text-center pb-3">
                            <button className="btn-outline-dark" onClick={this.handleContinue}>Continue shopping >>
                            </button>
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