import axios from 'axios';

const request = axios.create({
    baseURL: 'https://whats-the-fox.onrender.com/api/v1',
});

export default request;
