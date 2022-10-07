import axios from 'axios';

const axiosConfig = {
    baseURL: process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : `http://${window.location.hostname}:3000`,
    timeout: 20000,
    withCredentials: true,
}

const request = axios.create(axiosConfig);

const redirectLogin = () => {
    localStorage.removeItem("authorization");
    localStorage.removeItem("refreshToken");
    if (window.location.href.split("/")[3] !== "login")
        window.location.href = "/login";
}

request.interceptors.request.use(config => {
    config.headers.authorization = localStorage.getItem("authorization");
    return config;
});

request.interceptors.response.use(null, error => {
    let originalConfig = error.config;
    switch (error.response.data.name) {
        case "JsonWebTokenError":
            redirectLogin();
            break;
        case "TokenExpiredError":
            return new Promise((resolve, reject) => {
                request.post("/auth/generateAccessToken", {refreshToken: localStorage.getItem("refreshToken")}).then(res => {
                    localStorage.removeItem("authorization");
                    localStorage.setItem("authorization", `Bearer ${res.data.accessToken}`);
                    localStorage.removeItem("refreshToken");
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    return resolve(request(originalConfig));
                }).catch(err => {
                    localStorage.removeItem("refreshToken");
                    redirectLogin();
                });
            });
            break;
        default:
            return Promise.reject(error);
    }
});

export default request;