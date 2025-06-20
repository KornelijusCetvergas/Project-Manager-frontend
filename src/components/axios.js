import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbGljZSIsImlhdCI6MTc1MDMyNjE3MywiZXhwIjoxNzUwNDEyNTczfQ.HAJ73zmDtcrHYTTZ7m06Owq3WeeuiEVJRf36URoqp7s"
   if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;