import axios from 'axios';
import React from 'react';
import withRouter from './WithRouter';
import "./Product.css";
import req, {be_url, fe_url, userId} from '../others/Share';
import NotFound from "../others/NotFound";

class ProductDetails extends React.Component {
    state = {
        outputCart: {},
        count: 1,
        statusCode: 0,
        errorMessage: ''
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
            window.location.href = fe_url + "cart";
        })
    };

    async postProductToCart(data, callback) {
        await req.post(be_url + "cart/" + userId, JSON.stringify(data))
            .then((res) => {

            })
            .catch(error => {
                this.setState({
                    statusCode: error.response.status,
                    errorMessage: error.message,
                })
            })
        callback()
    }

    fetchProduct(id) {
        axios.get(be_url + "product/" + id)
            .then((res) => {
                const pProductId = res.data.id;
                const pName = res.data.name
                const pPrice = res.data.price
                const pDescription = res.data.description
                const pInStock = res.data.inStock
                const pImages = res.data.images
                this.setState({
                    productId: pProductId,
                    name: pName,
                    price: pPrice,
                    description: pDescription,
                    inStock: pInStock,
                    images: pImages,
                    statusCode: 200
                })
            }).catch(error => {
            this.setState({
                statusCode: error.response.status,
                errorMessage: error.message,
            })
        });
    }

    handleBuyNow = () => {
        const data = {}
        data.productId =  this.state.productId
        data.images = this.state.images
        data.price = this.state.price
        data.name = this.state.name
        data.quantity =  this.state.count
        console.log(this.state.count)
        const itemList = [data]
        localStorage.setItem("total", this.state.count * this.state.price)
        localStorage.setItem("items", JSON.stringify(itemList));
        window.location.href = `${fe_url}order/${userId}`;
    }

    render() {
        if (this.state.productId) {
            return (<div className='containerProductDetailsWithCondition'>
                    {this.state.statusCode === 200 ? (<div className='containerProductDetails'>
                        <div className='pictures'>
                            <div className='big'><img src={this.state.images[0]} alt='img'></img></div>
                            <div className='smallContainer'>
                                {this.state.images.slice(1).map((element, key) => (
                                    <div className='small' key={key}>
                                        <img src={element} alt='img'></img>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='productDetails'>
                            <h3>{this.state.name}</h3>
                            <p>{this.state.description}</p>
                            <div className='price'>Price: {this.state.price} $</div>
                            <div className='price'>Available: {this.state.inStock}</div>
                            <div className='numberBar'>
                                <div className='titleNumber'>Number</div>
                                <button className='nBtn' onClick={this.handleDecrement}>-</button>
                                <span className='number'>{this.state.count}</span>
                                <button className='nBtn' onClick={this.handleIncrement}>+</button>
                            </div>
                            <div className='addCartOrBuy'>
                                <button className='addToCart' onClick={this.handleClick}>
                                    <i className="bi bi-cart"></i>
                                    Add to cart
                                </button>
                                <button className='buyNow' onClick={this.handleBuyNow}>
                                    Buy now
                                </button>
                            </div>
                        </div>
                    </div>) : (
                        <section className="container">
                            <div className="text-center empty">
                                <h2>(╥﹏╥) {this.state.statusCode} error!</h2>
                                <h5>Perhaps you should try viewing other books!</h5>
                            </div>
                        </section>)}
                </div>
            )
        } else {
            return (
                <NotFound title='(╥﹏╥) Book not existed!' details='Perhaps you should try viewing other books!'/>
            )
        }
    }
}

export default withRouter(ProductDetails)

