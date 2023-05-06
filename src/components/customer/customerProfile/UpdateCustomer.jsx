import React, { useEffect, useState } from "react";

import { Button } from "react-bootstrap";
import req, { be_url, userId } from "../../others/Share";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import ImageUploading from "react-images-uploading";
// import Header from "../../header/Header";
// import Footer from "../../footer/Footer";
// import NotFound from "../../others/NotFound";

export default function CustomerUpdate() {
    const [customer, setCustomer] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        age: "",
        avatar: null,
    });
    useEffect(() => {
        fetchCustomer();
        console.log("Fetch customer.");
    }, []);

    const formData = new FormData();
    console.log(formData);
    const { username, email, password, address, phone, age, avatar } = customer;

    const handleChange = (event) => {
        setCustomer({ ...customer, [event.target.id]: event.target.value });
        console.log("Change");
    };

    const handleImageUpload = (imageList) => {
        formData.append("file", imageList[0].file);
        setCustomer({ ...customer, avatar: imageList[0] });
        console.log("Image uploaded!");
    };

    const submitForm = async (e) => {
        e.preventDefault();
        console.log("Submit form!");
        await req
            .put(`${be_url}customer/${userId}`, customer)
            .then((res) => {
                console.log("Submit!");
                window.location = "/";
            })
            .catch((error) => {
                alert(error.response.data.errors[0].defaultMessage);
            });
    };

    const submitAvatar = async (e) => {
        e.preventDefault();
        console.log("Submit avatar!");

        formData.append("file", avatar.file);

        await req
            .post(`${be_url}customer/update-avatar/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log("Submit!");
                window.location = "/";
            })
            .catch((error) => {
                alert(error.response.data.errors[0].defaultMessage);
            });
        console.log(avatar.file.type);
    };

    let fetchCustomer = async () => {
        await req.get(be_url + "customer/" + userId).then((res) => {
            const customer = res.data;
            setCustomer(customer);
        });
    };

    return (
        <>
            <Header />
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form
                        onSubmit={(e) => {
                            submitForm(e);
                            submitAvatar(e);
                        }}
                    >
                        <h3>UPDATE CUSTOMER'S PROFILE</h3>
                        <div className="mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                id="username"
                                required
                                className="form-control"
                                value={username}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="form-control"
                                value={email}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                id="password"
                                required
                                className="form-control"
                                placeholder="Enter old password"
                                value={password}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                id="password"
                                required
                                className="form-control"
                                value={password}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Address</label>
                            <input
                                type="text"
                                id="address"
                                className="form-control"
                                value={address}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                className="form-control"
                                value={phone}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Age</label>
                            <input
                                type="number"
                                id="age"
                                className="form-control"
                                value={age}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Avatar</label>
                            <ImageUploading
                                value={avatar}
                                onChange={handleImageUpload}
                                dataURLKey="data_url"
                            >
                                {({ onImageUpload, isDragging, dragProps, errors }) => (
                                    <div {...dragProps}>
                                        {avatar ? (
                                            <img src={avatar.data_url} alt="avatar" />
                                        ) : (
                                            <div>
                                                {isDragging ? (
                                                    <p>Drop the image here ...</p>
                                                ) : (
                                                    <p>
                                                        Drag and drop an image or click to select a file
                                                    </p>
                                                )}
                                                <button onClick={onImageUpload}>Upload Image</button>
                                            </div>
                                        )}
                                        {errors && <div>Error: {errors}</div>}
                                    </div>
                                )}
                            </ImageUploading>
                        </div>
                        <Button type="submit" className="btn" variant="outline-dark">
                            Update the profile
                        </Button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}