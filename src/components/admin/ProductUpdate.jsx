import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import req, {be_url, role} from "../others/Share";
import NotFound from "../others/NotFound";
import Header from "../header/Header";
import Footer from "../footer/Footer";

//form update 
export default function ProductUpdate(props) {
    const {id} = useParams();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        inStock: "",
        images: "",
        category: "",
        discount: ""
    })

    useEffect(() => {
        fetchProductList();
        console.log("list Product");
    }, [])

    const {name, description, price, inStock, images, category, discount} = product;

    const handleChange = (event) => {
        setProduct({...product, [event.target.id]: event.target.value})
        console.log(product);
    }
    const submitForm = async (e) => {
        e.preventDefault();
        await req.put(`${be_url}admin/product/${id}`, product)
            .then((result) => {
                window.location = "/admin/products";
            })
    }

    let fetchProductList = async () => {
        await req.get(be_url + 'product/' + id).then((res) => {
            const products = res.data;
            setProduct(products);
        })
    };


    if (role === "ROLE_ADMIN") {
        return (
            <div className="container text-center mt-3 mb-5">
                <h3 className=" text-primary- p-2 ">
                    UPDATE A BOOK
                </h3>
                <form className="form add card p-3 " onSubmit={(e) => {
                    submitForm(e)
                }}>
                    <label className=" h6 guide">Name</label>
                    <input type="text" className="form-control enter" id="name" value={name} required
                           onChange={(e) => handleChange(e)}/>

                    <label className=" h6 guide">Description</label>
                    <input type="text" className="form-control enter" id="description" value={description} required
                           onChange={(e) => handleChange(e)}/>

                    <label className="h6 guide">Price</label>
                    <input type="number" className="form-control enter" id="price" value={price} required
                           onChange={(e) => handleChange(e)}/>


                    <label className="h6 guide">Quantity</label>
                    <input type="number" className="form-control enter" id="inStock" value={inStock} required
                           onChange={(e) => handleChange(e)}/>


                    <label className="h6 guide">Images</label>
                    <input type="text" className="form-control enter" id="images" value={images} required
                           onChange={(e) => handleChange(e)}/>


                    <label className=" h6 guide ">Category</label>
                    <select className="form-control enter" id="category" value={category} required
                            onChange={(e) => handleChange(e)}>
                        <option>Select Category</option>
                        <option value="Comic">Comic</option>
                        <option value="Detective">Detective</option>
                        <option value="Literature">Literature</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Classics">Classics</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Horror">Horror</option>
                    </select>

                    <label className="h6 guide">Discount</label>
                    <input type="text" className="form-control enter" id="images" value={discount} required
                           onChange={(e) => handleChange(e)}/>

                    <div className="btnSubmit">
                        <button type="submit" className="btn btn-primary  bg-success">Update Book</button>

                    </div>
                </form>
            </div>
        )
    } else {
        return (
            <>
                <Header/>
                <NotFound title='(╥﹏╥) Access denied!' details='You have no permission to access this page!'/>
                <Footer/>
            </>)
    }
}