import React, {useEffect, useState} from "react";
import req, {accessToken, be_url, role, userId} from "../share/Share";
import ImageUploading from "react-images-uploading";
import {Button} from "react-bootstrap";

export default function CustomerUpdate() {
    const [customer, setCustomer] = useState({
        username: "",
        email: "",
        password: "",
        address: "",
        phone: "",
        age: ""
    });
    const [avatar, setAvatar] = useState([''])
    useEffect(() => {
        fetchCustomer()
    }, []);
    const {username, email, password, address, phone, age} = customer;

    const handleChange = (event) => {
        setCustomer({...customer, [event.target.id]: event.target.value});
    };

    const handleImageUpload = (file) => {
        setAvatar([file[0]])
    };


    let submitForm = async (e) => {
        e.preventDefault()
        let url
        if (role() === "ROLE_CUSTOMER") {
            url = `${be_url}customer/${userId()}`
        } else {
            url = `${be_url}admin/user/${userId()}`
        }
        const formData = new FormData()
        formData.set('file', avatar[0].file)
        formData.set('info', JSON.stringify(customer));
        await req.put(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + accessToken()
            }
        }).then((res) => {
            alert('Profile saved!')
            window.location = '/home'
        }).catch((error) => {
            console.log(error)
            if (error.response.data.errors) {
                alert(error.response.data.errors[0].defaultMessage);
            } else {
                alert(error.response.data.message);
            }
        });
    };

    let fetchCustomer = async () => {
        let url
        if (role() === "ROLE_CUSTOMER") {
            url = `${be_url}customer/${userId()}`
        } else {
            url = `${be_url}admin/user/${userId()}`
        }
        await req.get(url).then((res) => {
            const customer = {
                username: res.data.data.username,
                email: res.data.data.email,
                password: '',
                address: res.data.data.address,
                phone: res.data.data.phone,
                age: res.data.data.age
            }
            console.log("Fetch user info.")
            setAvatar([res.data.data.avatar])
            setCustomer(customer)
        });
    };

    return (
        <div className="auth-wrapper">
            <div className="wider">
                <form>
                    <h3>MY PROFILE</h3>
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
                            placeholder="Input your email here"
                            value={email}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>New Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Leave empty if don't want to change password"
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
                            placeholder="Input your address here"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Phone</label>
                        <input
                            type="tel"
                            id="phone"
                            required
                            className="form-control"
                            value={phone}
                            placeholder="Input your phone number here"
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                    <div className="mb-3">
                        <label>Age</label>
                        <input
                            type="number"
                            id="age"
                            required
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
                            multiple={false}
                        >
                            {({onImageUpload, isDragging, dragProps, errors}) => (
                                <div {...dragProps}>
                                    {avatar[0] === '/account.jpg' ? (
                                        <img src={"images/" + avatar[0]} alt="avatar"/>
                                    ) : <img src={avatar[0].dataURL || avatar[0]} alt="avatar"/>}
                                    <div>
                                        {isDragging ? (
                                            <p>Drop image here...</p>
                                        ) : (
                                            <p>Drag & drop an image, or click to select a file.</p>
                                        )}
                                        <button type="button" onClick={onImageUpload}>Upload Image</button>
                                    </div>
                                    {errors && <div>Error: {errors}</div>}
                                </div>
                            )}
                        </ImageUploading>
                    </div>
                    <Button type="submit" className="btn" variant="outline-dark" onClick={(e) => {
                        submitForm(e)
                    }}>
                        Update Profile
                    </Button>
                </form>
            </div>
        </div>
    );
}