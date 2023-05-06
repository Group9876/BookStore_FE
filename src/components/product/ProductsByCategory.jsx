import React, {Component} from 'react'
import withRouter from './WithRouter';
import {be_url} from '../others/Share';
import axios from "axios";
import NotFound from "../others/NotFound";
import Footer from "../footer/Footer";
import Header from "../header/Header";

class ProductsByCategory extends Component {
    state = {
        products: [],
    }

    componentDidMount() {
        const category = this.props.params.category;
        const page = this.props.params.page;
        this.fetchProducts(category, page);
    }

    fetchProducts(category, page) {
        axios.get(be_url + "product/" + category + "/" + page)
            .then((res) => {
                this.setState({products: res.data.content})
            })
            .catch((error) => {

            })
    }

    render() {
        if (this.state.products.length !== 0) {
            return (<><Header/>
                    <section className="container">
                        <div className='carousel'>
                            <img src="/images/book3.webp" alt='book3'/>
                        </div>
                        <hr></hr>
                        <div className="wrapper">
                            <div className="inner">
                                <div className="grid mg-left-10">
                                    <div className="products">
                                        <div className="box">
                                            {
                                                this.state.products.map(product => (
                                                    <div className="product text-center" key={product.id}>
                                                        <a href={"/product/" + product.id} className="product-item">
                                                            <div className="product-img">
                                                                <img className="lazy-load"
                                                                     src={product.images[0]}
                                                                     data-src={product.images}
                                                                     alt={product.name}/>
                                                                {product.discount !== 0 && <div
                                                                    className="sale-off">-{product.discount}%</div>}
                                                            </div>
                                                            <div className="product-title">{product.name}</div>
                                                            <div className="product-price">
                                                            <span
                                                                className="current-price">{((product.price - product.price * product.discount / 100)).toFixed(2)}$</span>
                                                                <span
                                                                    className="original-price"><s>{(product.price).toFixed(2)}$</s></span>
                                                            </div>
                                                        </a>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <Footer/></>
            )
        } else {
            return (<><Header/>
                    <section className="container">
                        <div className='carousel'>
                            <img src="/images/book3.webp" alt='book3'/>
                        </div>
                        <hr></hr>
                        <NotFound title='(╥﹏╥) Nothing was found!'
                                  details='Perhaps you should try viewing another category!'/>
                    </section>
                    <Footer/></>
            )
        }
    }
}

export default withRouter(ProductsByCategory);