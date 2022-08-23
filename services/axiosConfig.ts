import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AUTH_TOKEN, BASE_URL } from "../config/appConfig";

const service = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const jwtToken = localStorage.getItem(AUTH_TOKEN);

    if (jwtToken) {
      if (!config.headers) config.headers = {};
      config.headers["authorization"] = `Bearer ${jwtToken}`;
    }

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    let notificationParam = { message: "", description: "" };
    if (error.response.status === 401 || error.response.status === 403) {
      notificationParam.message = "Authentication Fail";
      notificationParam.description = "Please login again";
      localStorage.removeItem(AUTH_TOKEN);
      localStorage.removeItem("user");

      window.location.reload();
    }

    if (error.response.status === 404) {
      notificationParam.message = "Not Found";
    }

    if (error.response.status === 500) {
      notificationParam.message = "Internal Server Error";
    }

    if (error.response.status === 508) {
      notificationParam.message = "Time Out";
    }

    console.log(notificationParam);

    return Promise.reject(error);
  }
);

export default service;
