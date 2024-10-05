import axios from 'axios'
const BASE_URL = 'http://localhost:8080';
// https://valo-deal-backend.vercel.app

export const customAxios = axios.create({
  baseURL: BASE_URL, withCredentials: true
  // headers: { "Content-Type": "application/json" },
});

export const axiosPrivate = axios.create({ //when api call needs accesstoken
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true
})
axiosPrivate.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
