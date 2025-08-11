import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://unmute-eqf5.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});