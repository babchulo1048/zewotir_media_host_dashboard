import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:9090/api/v1",
  //   baseURL: "https://remitapi.aboltech.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Add token from localStorage to every request if available
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
