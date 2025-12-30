import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ErrorToast, SuccessToast } from "../views/common";

const useAxios = () => {
  const navigate = useNavigate();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_ENDPOINT,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request Interceptor
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Convert GET request data to query parameters
        if (
          config.method === "get" &&
          config.data &&
          typeof config.data === "object"
        ) {
          config.params = { ...config.params, ...config.data };
          delete config.data;
        }

        return config;
      },
      (error) => {
        console.error("Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response Interceptor
    instance.interceptors.response.use(
      (response) => {
        const message = response.data?.message;
        if (message) {
          showSuccessToast(message);
        }
        return response.data;
      },
      (error) => {
        console.log("Axios Error:", error);

        if (!error.config._toastShown) {
          error.config._toastShown = true;

          if (error.response) {
            const { status, data } = error.response;
            const message = data?.message || "An error occurred!";
            const error_type = data?.type || "error";

            if (error_type === "unauthorized") {
              localStorage.clear();
              navigate("/login");
              showErrorToast(message, status);
            } else {
              showErrorToast(message, status);
            }
          } else if (error.request) {
            showErrorToast(
              "No response from the server. Please try again.",
              500
            );
          } else {
            showErrorToast("An unexpected error occurred.", 500);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [navigate]);

  return axiosInstance;
};

export default useAxios;

const showSuccessToast = (message: string) => {
  toast.custom((t) => <SuccessToast t={t} message={message} />);
};

const showErrorToast = (message: string, status: number) => {
  toast.custom((t) => <ErrorToast t={t} message={message} status={status} />);
};
