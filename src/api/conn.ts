import axios, { AxiosInstance } from 'axios';
import { getEnvVariables } from '../helper';

const { VITE_API_URL } = getEnvVariables();

const conn: AxiosInstance = axios.create({
    baseURL: VITE_API_URL
});


// configurar interceptores
conn.interceptors.request.use(
  config => {
    return config;
  });


export default conn;