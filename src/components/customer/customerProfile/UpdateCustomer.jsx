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
        avatar: null,
    });
    useEffect(() => {
        fetchCustomer();
        console.log("Fetch customer.");
    }, []);

    const formData = new FormData();
    console.log(formData);
    const {username, email, password, address, phone, age, avatar} = customer;

    const handleChange = (event) => {
        setCustomer({...customer, [event.target.id]: event.target.value});
        console.log("Change");
    };

    const handleImageUpload = (imageList) => {
        formData.append("file", imageList[0].file);
        setCustomer({...customer, avatar: imageList[0]});
        console.log("Image uploaded!");
    };

    const submitForm = async (e) => {
        e.preventDefault();
        console.log("Submit form!");
        const cust = customer;
        cust.avatar = ""
        setCustomer(cust)
        await req
            .put(`${be_url}customer/${userId}`, customer)
            .then((res) => {
                console.log("Submit!");
                submitAvatar(e)    
            })
            .catch((error) => {
                if (error.response.data.errors) {
                    alert(error.response.data.errors[0].defaultMessage);
                } else {
                    alert(error.response.data.message);
                }
            });
    };

    const submitAvatar = async (e) => {
        e.preventDefault();
        if (avatar.file) {
            console.log("Submit avatar!");
            formData.append("file", avatar.file);
            await req.post(`${be_url}customer/update-avatar/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
                .then((res) => {
                    console.log("Submit image!");
                    alert("Profile saved!")
                })
                .catch((error) => {
                    if (error.response.data.errors) {
                        alert(error.response.data.errors[0].defaultMessage);
                    } else {
                        alert(error.response.data.message);
                    }
                });
        }
        // console.log(avatar.file.type);
    };

    let fetchCustomer = async () => {
        await req.get(be_url + "customer/" + userId).then((res) => {
            const customer = res.data;
            customer.password = ""
            if (customer.avatar && customer.avatar.indexOf("ems-intern-bucket") === -1) {
                customer.avatar = null
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
                                readOnly={true}
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