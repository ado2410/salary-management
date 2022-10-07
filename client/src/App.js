import {Alert, Box, CircularProgress, LinearProgress, Snackbar} from "@mui/material";
import {useEffect, useState} from "react";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import Admin from "./components/Admin";
import context from "./utils/context";
import {LocalizationProvider} from "@mui/lab";
import moment from "@mui/lab/AdapterMoment";
import Login from "./components/Login";
import request from "./utils/request";
import Home from "./components/Home";
import {socket} from "./utils/socket";

const roles = {
    "6234485b4eb16d52de1be481": {
        name: "admin",
        label: "Quản trị viên",
    },
    "6234485b4eb16d52de1be482": {
        name: "input",
        label: "Người nhập liệu",
    },
    "6234485b4eb16d52de1be483": {
        name: "teacher",
        label: "CB - GV",
    }
}

function App() {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [auth, setAuth] = useState(null);
    const [role, setRole] = useState({name: "", label: ""});

    useEffect(() => {
        request.get("/auth/check").then(res => {
            if (window.location.href.split("/")[3] === "login")
                navigate("/");
            setAuth(res.data.auth);
        }).catch(err => {
            navigate("/login");
        });
    }, []);

    useEffect(() => {
        let role = roles[auth?.role._id];
        if (role) setRole(role);
    }, [auth]);

    const startLoading = () => {
        setLoading(true);
    }

    const stopLoading = () => {
        setTimeout(() => setLoading(false), 500);
    }

    const success = (message) => {
        setNotification({severity: "success", message: message});
    }

    const error = (message) => {
        setNotification({severity: "error", message: message});
    }

    const warning = (message) => {
        setNotification({severity: "warning", message: message});
    }

    const info = (message) => {
        setNotification({severity: "info", message: message});
    }

    const handleCloseSnackbar = () => {
        setNotification(null);
    };

    const login = (params) => {
        return new Promise((resolve, reject) => {
            request.post('/auth/login', params).then((res) => {
                setAuth(res.data.auth);
                localStorage.setItem("authorization", `Bearer ${res.data.accessToken}`);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                navigate("/");
                resolve(res.data);
            }).catch(err => {
                navigate("/login");
                error("Khổng thể đăng nhập");
                reject(err.response.data);
            });
        })
    }

    const logout = () => {
        localStorage.removeItem("authorization");
        setAuth(null);
        navigate("/login");
    }

    const refreshToken = (data) => {
        localStorage.setItem("authorization", data.accessToken);
        setAuth(data.auth);
    }

    return (
        <Box sx={{backgroundColor: "hsl(0deg 0% 97%)", minHeight: "100vh"}}>
            {/*<LinearProgress color="secondary"
                            sx={{position: "relative", top: 0, left: 0, visibility: isLoading ? 'visible' : 'hidden'}}/>*/}
            <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "right"}} open={isLoading} onClose={handleCloseSnackbar}>
                <Alert severity="info" sx={{display: "flex", alignItems: "center"}}>
                    <CircularProgress size={10} />
                    <span> Đang tải...</span>
                </Alert>
            </Snackbar>
            <LocalizationProvider dateAdapter={moment}>
                <context.Provider value={{isLoading, startLoading, stopLoading, success, error, warning, info, auth, login, isLoggedIn: Boolean(auth), logout, refreshToken, role, roles, socket}}>
                    <Routes>
                        <Route path="*" element={role.name === "admin" ? <Admin /> : <Home />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </context.Provider>
            </LocalizationProvider>
            <Snackbar anchorOrigin={{vertical: "top", horizontal: "center"}} open={notification !== null}
                      autoHideDuration={4000} onClose={handleCloseSnackbar}>
                <Alert severity={notification?.severity}>{notification?.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default App;
