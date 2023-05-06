import React, {useEffect, useState} from "react";
import req, {be_url, userId} from "../../others/Share";
import Header from "../../header/Header";
import Footer from "../../footer/Footer";
import ImageUploading from "react-images-uploading";
import {Button} from "react-bootstrap";

export default function CustomerUpdate() {
    const [customer, setCustomer] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        age: "",
        avatar: "",
    });
    useEffect(() => {
        fetchCustomer();
    }, []);

    const formData = new FormData();
    const {username, email, password, address, phone, age, avatar} = customer;

    const handleChange = (event) => {
        setCustomer({...customer, [event.target.id]: event.target.value});
    };

    const handleImageUpload = (imageList) => {
        formData.append("file", imageList[0].file);
        setCustomer({...customer, avatar: imageList[0]});
    };

    const submitForm = async (e) => {
        e.preventDefault();
        if (avatar.file) {
            const cust = customer;
            cust.avatar = ""
            setCustomer(cust)
        }
        await req
            .put(`${be_url}customer/${userId}`, customer)
            .then((res) => {
                submitAvatar()
            })
            .catch((error) => {
                if (error.response.data.errors) {
                    alert(error.response.data.errors[0].defaultMessage);
                } else {
                    alert(error.response.data.message);
                }
            });
    };

    const submitAvatar = async () => {
        if (avatar.file) {
            formData.append("file", avatar.file);
            await req.post(`${be_url}customer/update-avatar/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    alert("Profile saved!")
                    window.location = "/"
                })
                .catch((error) => {
                    if (error.response.data.errors) {
                        alert(error.response.data.errors[0].defaultMessage);
                    } else {
                        alert(error.response.data.message);
                    }
                });
        } else {
            alert("Profile saved!")
        }
        window.location = "/"
    };

    let fetchCustomer = async () => {
        await req.get(be_url + "customer/" + userId).then((res) => {
            const customer = res.data;
            customer.password = ""
            if (customer.avatar && customer.avatar.indexOf("ems-intern-bucket") === -1) {
                customer.avatar = ""
            }

            setCustomer(customer);
        });
    };

    return (
        <>
            <Header/>
            <div className="auth-wrapper">
                <div className="auth-inner">
                    <form onSubmit={(e) => {
                        submitForm(e);
                    }}
                    >
                        <h3>UPDATE PROFILE</h3>
                        <div className="mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                id="username"
                                required
                                className="form-control"
                                value={username}
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="form-control"
                                placeholder={email}
                                value={email}
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
                                placeholder={password}
                                value={password}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Address</label>
                            <input
                                type="text"
                                id="address"
                                required
                                className="form-control"
                                value={address}
                                placeholder={address}
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
                                placeholder={phone}
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
                                placeholder={age}
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
                                {({onImageUpload, isDragging, dragProps, errors}) => (
                                    <div {...dragProps}>
                                        {!avatar && <div>
                                            {isDragging ? (
                                                <p>Drop the image here ...</p>
                                            ) : (
                                                <p>
                                                    Drag and drop an image or click to select a file
                                                </p>
                                            )}
                                            <button onClick={onImageUpload}>Upload Image</button>
                                        </div>
                                        }
                                        {errors && <div>Error: {errors}</div>}
                                    </div>
                                )}
                            </ImageUploading>
                            {avatar ? (
                                <>
                                    {avatar.data_url ? (<img src={avatar.data_url} alt="avatar"/>) : (
                                        <img src={avatar} alt="avatar"/>)}
                                </>
                            ) : (<></>)}
                        </div>
                        <Button type="submit" className="btn" variant="outline-dark">
                            Update
                        </Button>
                    </form>
                </div>
            </div>
            <Footer/>
        </>
    );
}