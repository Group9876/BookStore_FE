import React, {Component} from 'react'
import axios from "axios";
import "./Homepage.css";
import {useLocation} from 'react-router-dom';
import {be_url} from '../others/Share';
import NotFound from "../others/NotFound";
import Footer from "../footer/Footer";
import Header from "../header/Header";

class HomepageWithLocation extends Component {
    state = {
        products: [],
        pages: 0,
        current: 0,
        search: ''
    }

    componentDidMount() {
        if (!this.props.location.state)
            this.fetchProductList();
    }

    fetchSearch = () => {
        axios.get(`${be_url}search`, {params: {name: this.props.location.state.name}}).then((res) => {
            const products = res.data.content;
            const pages = res.data.totalPages;
            const current = res.data.number;
            this.setState({
                products,
                pages,
                current,
                search: this.props.location.state.name
            });
        })
    }

    fetchSort = (direction, criteria) => {
        this.props.location.state = null;
        let config = {};
        if (criteria === 'price') {
            config = {params: {price: true, direction: direction}}
        }
        if (criteria === 'name') {
            config = {params: {name: true, direction: direction}}
        }
        if (criteria === 'inStock') {
            config = {params: {inStock: true, direction: direction}}
        }
        if (criteria === 'category') {
            config = {params: {category: true, direction: direction}}
        }
        axios.get(be_url, config).then((res) => {
            const products = res.data.content;
            const pages = res.data.totalPages;
            const current = res.data.number;
            this.setState({
                products,
                pages,
                current
            });
        })
    }

    fetchProductList = () => {
        axios.get(be_url).then((res) => {
            const products = res.data.content;
            const pages = res.data.totalPages;
            const current = res.data.number;
            this.setState({
                products,
                pages,
                current
            });
        })
    }

    handleSwitch = (i) => {
        axios.get(`${be_url}${i}`).then((res) => {
            const products = res.data.content;
            console.log(res.data)
            this.setState({
                products,
                current: i
            });
        })
    }

    handleSearchSwitch = (i) => {
        axios.get(`${be_url}search/${i}`).then((res) => {
            const products = res.data.content;
            console.log(res.data)
            this.setState({
                products,
                current: i
            });
        })
    }

    render() {
        const arr = [];
        if (this.props.location.state !== null && this.props.location.state.name !== this.state.search) {
            this.fetchSearch();
            console.log(this.props.location.state.name)
            for (let i = this.state.pages - 1; i >= 0; i--) {
                if (this.state.current === i) {
                    arr.push(<button className="page page-clicked" key={"page_" + i} onClick={() => {
                        this.handleSearchSwitch(i)
                    }}>{i + 1}</button>)
                } else {
                    arr.push(<button className="page page-click" key={"page_" + i} onClick={() => {
                        this.handleSearchSwitch(i)
                    }}>{i + 1}</button>)
                }
            }
        } else {
            for (let i = this.state.pages - 1; i >= 0; i--) {
                if (this.state.current === i) {
                    arr.push(<button className="page page-clicked" key={"page_" + i} onClick={() => {
                        this.handleSwitch(i)
                    }}>{i + 1}</button>)
                } else {
                    arr.push(<button className="page page-click" key={"page_" + i} onClick={() => {
                        this.handleSwitch(i)
                    }}>{i + 1}</button>)
                }
            }
        }
        if (this.state.products.length !== 0) {
            return (
                <>
                    <Header/>
                    <section className="container">
                        <div className='carousel'>
                            <img src="/images/book3.webp" alt='book3'/>
                        </div>
                        <hr></hr>
                        <div className="wrapper">
                            <div className="text-center">
                                <button className="bi-sort-numeric-up-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("asc", "price")
                                        }}> Price
                                </button>
                                <button className="bi-sort-numeric-down-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("desc", "price")
                                        }}> Price
                                </button>
                                <button className="bi-sort-alpha-up-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("asc", "name")
                                        }}> Name
                                </button>
                                <button className="bi-sort-alpha-down-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("desc", "name")
                                        }}> Name
                                </button>
                                <button className="bi-sort-up btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("asc", "category")
                                        }}> Category
                                </button>
                                <button className="bi-sort-down btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("desc", "category")
                                        }}> Category
                                </button>
                                <button className="bi-sort-numeric-up-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("asc", "inStock")
                                        }}> In Stock
                                </button>
                                <button className="bi-sort-numeric-down-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("desc", "inStock")
                                        }}> In Stock
                                </button>
                            </div>
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
                                                                className="current-price">{(product.price - product.price * product.discount / 100).toFixed(2)}$</span>
                                                                {/*<span*/}
                                                                {/*    className="current-price">{product.price.toFixed(2)}$</span>*/}
                                                                <span
                                                                    className="original-price"><s>{(product.price).toFixed(2)}$</s></span>
                                                            </div>
                                                        </a>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div>
                                            {arr}
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
                        <div className="wrapper">
                            <div className="text-center">
                                <button className="bi-sort-numeric-up-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("asc", "price")
                                        }}> Price
                                </button>
                                <button className="bi-sort-numeric-down-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("desc", "price")
                                        }}> Price
                                </button>
                                <button className="bi-sort-alpha-up-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("asc", "name")
                                        }}> Name
                                </button>
                                <button className="bi-sort-alpha-down-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("desc", "name")
                                        }}> Name
                                </button>
                                <button className="bi-sort-up btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("asc", "category")
                                        }}> Category
                                </button>
                                <button className="bi-sort-down btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("desc", "category")
                                        }}> Category
                                </button>
                                <button className="bi-sort-numeric-up-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("asc", "inStock")
                                        }}> In Stock
                                </button>
                                <button className="bi-sort-numeric-down-alt btn btn-outline-secondary m-2"
                                        onClick={() => {
                                            this.fetchSort("desc", "inStock")
                                        }}> In Stock
                                </button>
                            </div>
                            <NotFound title='(╥﹏╥) No books was found!'
                                      details='Perhaps you should try searching another keyword!'/>
                        </div>
                    </section>
                    <Footer/></>
            )
        }
    }
}

function Homepage(props) {
    let location = useLocation();
    return <HomepageWithLocation {...props} location={location}/>
}

export default Homepage;