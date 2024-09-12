import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const $axios = axios.create({
    baseURL: 'https://access-api-38cea021d5b8.herokuapp.com/',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
});

$axios.interceptors.request.use(async config => {
    try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du jeton:', error);
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default $axios;
