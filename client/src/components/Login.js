import {
    Box,
    Button,
    Grid, Paper,
    TextField,
    Typography,
} from "@mui/material";
import {useContext, useState} from "react";
import context from "../utils/context";
import {AccountCircle, Lock} from "@mui/icons-material";

function Login() {
    const {login} = useContext(context);
    const [errors, setErrors] = useState({});

    const handleLogin = (e) => {
        e.preventDefault();
        login({
            username: e.target.username.value,
            password: e.target.password.value,
        }).catch(err => {
            setErrors(err);
        });
    }

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{height: "100vh"}}>
            <Grid item xs={12} sm={6} md={4} lg={3} component={Paper} sx={{p: 2, textAlign: "center"}}>
                <Typography variant="h2">UDCK</Typography>
                <Typography variant="body2">Hệ thống quản lý lương Cán bộ - Giảng viên Phân hiệu ĐHĐN tại Kon Tum</Typography>
                <Box component="form" sx={{"& > :not(style)": {my: 1}}} onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        required
                        error={Boolean(errors?.username)}
                        helperText={errors?.username?.message}
                        InputProps={{startAdornment: <AccountCircle />}}
                        name="username"
                        label="Tên tài khoản"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        required
                        error={Boolean(errors?.password)}
                        helperText={errors?.password?.message}
                            InputProps={{startAdornment: <Lock />}}
                        name="password"
                        label="Mật khẩu"
                        variant="outlined"
                        type="password"
                    />
                    <Button fullWidth type="submit" variant="contained">Đăng nhập</Button>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Login;
