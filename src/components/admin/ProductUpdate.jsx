import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import req, { fe_url, be_url, role } from "../others/Share";
import NotFound from "../others/NotFound";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import axios from 'axios';
import ImageUploading from "react-images-uploading";

export default function ProductUpdate() {


    const { id } = useParams();
    const [product, setProduct] = useState({
      name: "",
      description: "",
      price: "",
      inStock: "",
      images: [],
      category: "",
      discount: "",
    });
  
    const logout = async () => {
        await axios.post(`${be_url}logout`).then((res) => {
            if (res.status === 200) {
                localStorage.clear()
                this.setState({
                    accessToken: null
                })
                window.location = "/"
            }
        })
    }

    const formData = new FormData();
  
    useEffect(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fetchProductList();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const { name, description, price, inStock, images, category, discount } =
      product;
  
    const handleChange = (event) => {
      setProduct({ ...product, [event.target.id]: event.target.value });
    };
  
    const handleImageUpload = (imageList) => {
      for (let i = 0; i < imageList.length; i++) {
        formData.append("image", imageList[i].file);
        console.log("Image uploaded!");
        // console.log(imageList[i].file.type);/
      }
      setProduct({ ...product, images: imageList });
      console.log("Product images uploaded!");
    };
    
    const submitForm = async (e) => {
      e.preventDefault();
      await req.put(`${be_url}admin/product/${id}`, product).then((result) => {
        window.location = "/admin/products";
      });
    };
  
    const submitProductImages = async (e) => {
      e.preventDefault();
  
      // formData.append("productImages", images.file);
  
      for (let i = 0; i < images.length; i++) {
        formData.append("image", images[i].file);
        console.log("Image uploaded!");
        console.log(images[i].file.type);
      }
      console.log("Submit product images!");
  
      await req
        .post(`${be_url}admin/product-image-upload/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(
          (result) => {
            window.location = "/admin/products";
          },
          (error) => {
            console.log(error);
          }
        );
      };

  //   const response = await fetch(`${be_url}admin/product-image-upload/${id}`, {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'multipart/form-data'
  //     },
  //     body: formData,
  //   });
  //   const contentType = response.headers.get("content-type");
  //   console.log(contentType);
  // }

  let fetchProductList = async () => {
    await req.get(be_url + "product/" + id).then((res) => {
      const products = res.data;
      setProduct(products);
    });
  };




    if (role === "ROLE_ADMIN") {
        return (
            <div className="container">
                {/*aside*/}
                <div className="row">
                    <div className="col-3">
                        <aside className="admin-aside">
                            <div className="web-name">
                                <a href={fe_url}><img className="admin-logo" src="/images/icon.jpg" alt="logo"/><span>PRO BOOKSTORE</span></a>

                            </div>
                            <a className="admin-navigation" href={fe_url + "admin/products"}>Manage
                                books</a>
                                <div className="dropdown">
                                        <a className="admin-navigation" href={fe_url + "admin/orders"}>Manage
                                            orders <i className="bi bi-chevron-down dropdown_icon"></i></a>
                                        <div className="dropdown-content">
                                            <a href={fe_url + "admin/orders?status=customer_confirmed"}>Checked out</a>
                                            <a href={fe_url + "admin/orders?status=admin_preparing"}>Preparing</a>
                                            <a href={fe_url + "admin/orders?status=shipping"}>Shipping</a>
                                            <a href={fe_url + "admin/orders?status=customer_request_cancel"}>Cancel request</a>
                                            <a href={fe_url + "admin/orders?status=success"}>Success</a>
                                        </div>
                                    </div>
                            <a className="admin-navigation current-pos" href={fe_url + "admin/vouchers"}>Manage
                                vouchers</a>
                        </aside>
                    </div>
                    {/*header*/}
                    <div className="col-9">
                        <article className="admin-header">
                            <span className="welcome">Welcome ADMIN!</span>&nbsp;&nbsp;
                            <span onClick={logout} className="bi bi-box-arrow-right"/>
                        </article>
                        {/*admin*/}
                        <article className="admin-body">
                            <div className="container text-center mt-3 mb-5">
                                <h3 className=" text-primary- p-2 ">
                                    UPDATE BOOK
                                </h3>
                                <form className="form add card " onSubmit={(e) => {
                                    submitForm(e);
                                    submitProductImages(e);
                                }}>
                                    <label className=" h6 guide">Name</label>
                                    <input type="text" className="form-control enter" id="name" value={name} required
                                           onChange={(e) => handleChange(e)}/>

                                    <label className=" h6 guide">Description</label>
                                    <input type="text" className="form-control enter" id="description"
                                           value={description} required
                                           onChange={(e) => handleChange(e)}/>

                                    <label className="h6 guide">Price</label>
                                    <input type="number" min="0" className="form-control enter" id="price" value={price}
                                           required
                                           onChange={(e) => handleChange(e)}/>


                                    <label className="h6 guide">Quantity</label>
                                    <input type="number" min="0" className="form-control enter" id="inStock"
                                           value={inStock} required
                                           onChange={(e) => handleChange(e)}/>


                                    <label className="h6 guide">Images</label>
                                    <div>
              <ImageUploading
                multiple
                value={images}
                onChange={handleImageUpload}
                maxNumber={10}
                dataURLKey="data_url"
              >
                {({ onImageUpload, onImageRemoveAll, onImageRemove }) => (
                  <div className="upload__image-wrapper">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={onImageUpload}
                    >
                      Upload Images
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={onImageRemoveAll}
                    >
                      Remove All
                    </button>
                    {images != null && images.map((image, index) => (
                      <div key={index} className="image-item">
                        <img
                          src={image["data_url"]}
                          alt=""
                          width="100"
                          height="100"
                        />
                        <div className="image-item__btn-wrapper">
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => onImageRemove(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ImageUploading>
            </div>


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
                                        <option value="Horror">Horro</option>
                                    </select>

                                    <label className="h6 guide">Discount</label>
                                    <input type="text" min="0" className="form-control enter" id="images"
                                           value={discount} required
                                           onChange={(e) => handleChange(e)}/>

                                    <div className="btnSubmit">
                                        <button type="submit" className="btn btn-primary  bg-success">Update Book
                                        </button>

                                    </div>
                                </form>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
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