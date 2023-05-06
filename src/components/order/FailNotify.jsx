import React from "react";
import withRouter from "../products/WithRouter";
import "./Bill.css"
<<<<<<< HEAD
import {fe_url} from "../others/Share";
=======
import req, { be_url, fe_url, userId } from "../others/Share";
>>>>>>> b3f11afd791c08e36f1ebad076f940b9f4fb26a2

class FailNotify extends React.Component {

    handleContinue = () => {
<<<<<<< HEAD
        window.location.href = fe_url
    }

=======
        window.location.href = fe_url       
    }
    
>>>>>>> b3f11afd791c08e36f1ebad076f940b9f4fb26a2
    render() {
        return (
            <div className="boxinnotif">
                <div className="mess">
<<<<<<< HEAD
                    <h4>Order Fail!</h4>
                </div>
                <div className="mess">
                    <button onClick={this.handleContinue}>Continue shopping</button>
                </div>

=======
                <h4>Order Fail!</h4>
                </div>
                <div className="mess">
                <button onClick={this.handleContinue}>Continue shopping</button>
                </div>
                    
>>>>>>> b3f11afd791c08e36f1ebad076f940b9f4fb26a2
            </div>
        )
    }
}
<<<<<<< HEAD

=======
        
>>>>>>> b3f11afd791c08e36f1ebad076f940b9f4fb26a2
export default withRouter(FailNotify)