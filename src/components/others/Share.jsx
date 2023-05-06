import axios from 'axios';

const req = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});

export default req;

export const fe_url = "http://localhost:3000/"
export const be_url = "http://localhost:8080/"
export const accessToken = localStorage.getItem("access_token")
export const role = localStorage.getItem("role")
export const userId = localStorage.getItem("userId")
export const checkout_url = be_url + "customer/paypal/pay/"
