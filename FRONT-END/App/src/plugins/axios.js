import axios from "axios";
import {useAuthStore} from "../store/auth.store";

const $axios = axios.create({
    baseURL: 'https://access-api-38cea021d5b8.herokuapp.com/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

$axios.interceptors.request.use(config => {
    const token = useAuthStore.getState().jwtToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default $axios;
