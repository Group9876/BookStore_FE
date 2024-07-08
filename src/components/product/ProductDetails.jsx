import axios from "axios";
import React from "react";
import withRouter from "./WithRouter";
import "./Product.css";
import req, {be_url, fe_url, userId} from "../share/Share";
import NotFound from "../share/notfound/NotFound";

class ProductDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentImageIndex: 0,
            outputCart: {},
            count: 1,
            statusCode: 0,
            errorMessage: ""
        };
    }

    componentDidMount() {
        const id = this.props.params.id;
        this.fetchProduct(id);
    }

    handleIncrement = () => {
        this.setState({count: this.state.count + 1});
    };

    handleDecrement = () => {
        if (this.state.count > 0) {
            this.setState({count: this.state.count - 1});
        }
    };

    handleClick = async () => {
        const data = {};
        data.productId = this.state.productId;
        data.quantity = this.state.count;
        await this.postProductToCart(data, () => {
            window.location = "/cart";
        });
    };

    async postProductToCart(data, callback) {
        await req.post(be_url + "cart/" + userId(), JSON.stringify(data))
            .then((res) => {
                console.log("Product added to cart.")
            })
            .catch((error) => {
                this.setState({
                    statusCode: error.response.status,
                    errorMessage: error.message,
                });
            });
        callback();
    }

    fetchProduct(id) {
        axios.get(be_url + "product/" + id)
            .then((res) => {
                console.log("Fetch product #" + id)
                this.setState({
                    productId: res.data.data.id,
                    name: res.data.data.name,
                    price: res.data.data.price,
                    description: res.data.data.description,
                    inStock: res.data.data.inStock,
                    images: res.data.data.images,
                    statusCode: 200,
                    discount: res.data.data.discount
                });
            })
            .catch((error) => {
                this.setState({
                    statusCode: error.response.status,
                    errorMessage: error.message,
                });
            });
    }

    handleBuyNow = () => {
        const data = {};
        data.productId = this.state.productId;
        data.images = this.state.images;
        data.price = this.state.price;
        data.name = this.state.name;
        data.quantity = this.state.count;
        const itemList = [data];
        localStorage.setItem("total", this.state.count * this.state.price);
        localStorage.setItem("items", JSON.stringify(itemList));
        window.location.href = `${fe_url}order`;
    };

    render() {
        if (this.state.productId) {
            return (
                <div className="containerProductDetailsWithCondition">
                    {this.state.statusCode === 200 ? (
                        <div className="containerProductDetails">
                            <div className="pictures">
                                <div className="smallContainer">
                                    <div className="big">
                                        <img
                                            src={this.state.images[this.state.currentImageIndex]}
                                            alt="img"
                                        ></img>

                                    </div>
                                    {this.state.images.map((element, key) => (
                                        <div
                                            key={key}
                                            onClick={() =>
                                                this.setState({currentImageIndex: key})
                                            }
                                        >
                                            <div className="small">
                                                <img src={element} alt="img"></img>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="productDetails">
                                <h1>{this.state.name}</h1>
                                <p>{this.state.description}</p>
                                {/* <div className="big">
                    <img
                      src={this.state.images[this.state.currentImageIndex]}
                      alt="img"
                    ></img>
                  </div> */}
                                <div
                                    className="price">Price: {(this.state.price - this.state.price * this.state.discount / 100).toFixed(2)} $
                                </div>
                                <div className="price">Available: {this.state.inStock}</div>
                                <div className="numberBar">
                                    <button className="nBtn" onClick={this.handleDecrement}>
                                        -
                                    </button>
                                    <span className="number px-3">{this.state.count}</span>
                                    <button className="nBtn" onClick={this.handleIncrement}>
                                        +
                                    </button>
                                </div>
                                <div className="addCartOrBuy">
                                    <button className="addToCart" onClick={this.handleClick}>
                                        <i className="bi bi-cart-plus"></i>Add to cart
                                    </button>
                                    <button className="buyNow" onClick={this.handleBuyNow}>
                                        Buy now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <section className="container">
                            <div className="text-center empty">
                                <h2>(╥﹏╥) {this.state.statusCode} error!</h2>
                                <h5>Perhaps you should try viewing other books!</h5>
                            </div>
                        </section>
                    )}
                </div>
            );
        } else {
            return (
                <NotFound title="(˚ ˃̣̣̥⌓˂̣̣̥ ) Book not existed!" details="Perhaps you should try viewing other books!"
                />
            );
        }
    }
}

export default withRouter(ProductDetails);
