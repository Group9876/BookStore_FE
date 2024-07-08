import axios from 'axios';

const req = axios.create({
    baseURL: 'http://localhost:8080/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken()
    }
});

export default req;
export const fe_url = "http://localhost:3000/"
export const be_url = "http://localhost:8080/"

export function accessToken() {
    return localStorage.getItem("access_token")
}

export function role() {
    return localStorage.getItem("role")
}

export function userId() {
    return localStorage.getItem("userId")
}

export const checkout_url = be_url + "order/paypal/transfer/"
