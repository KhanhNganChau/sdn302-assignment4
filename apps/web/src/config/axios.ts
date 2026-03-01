import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

//request interceptor
//log chi tiet request truoc khi gui di
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(
      `[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    //attach token automatically
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

//response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API RESPONSE] ${response.status} ${response.config.url}`);
    return response.data;
  },
  (error: AxiosError<any>) => {
    if (error.response) {
      console.error(
        `[API ERROR] ${error.response.status} ${error.response.config.url}`,
        error.response.data,
      );
    } else {
      console.error("[API ERROR] No response from server");
    }

    const message = error.response?.data?.message ?? "Server error";

    return Promise.reject(new Error(message));
  },
);

export default api;
