import {AppBar, Badge, Box, IconButton, Menu, Tooltip} from "@mui/material";
import {
    AccountCircle, Home,
    Logout,
    Menu as MenuIcon,
    Notifications,
} from "@mui/icons-material";
import {useContext, useState} from "react";
import context from "../utils/context";
import Notification from "./Notification";
import {useNavigate} from "react-router-dom";

function Header(props) {
    const navigate = useNavigate();
    const {logout} = useContext(context);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);

    const handleClickMenu = () => {
        props.onClickMenu();
    };

    const handleLogout = () => {
        logout();
    }

    return (
        <AppBar position="static">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ m: 1 }}
            >
                <Box
                    sx={(theme) => ({
                        [theme.breakpoints.up("sm")]: {
                            "& > *": { display: "none" },
                        },
                    })}
                >
                    <IconButton
                        variant="h4"
                        align="center"
                        onClick={handleClickMenu}
                        sx={(theme) => ({
                            [theme.breakpoints.up("md")]: {
                                display: "none",
                            },
                        })}
                    >
                        <MenuIcon />
                    </IconButton>

                    <IconButton onClick={() => navigate("/")}>
                        <Home/>
                    </IconButton>

                </Box>

                <Box sx={{"& :not(style)": {mx: 1, color: "white"}}}>

                </Box>

                <Box>
                    <Tooltip title="Thông báo">
                        <IconButton sx={{color: "white"}} onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <Badge badgeContent={notificationCount} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Tài khoản">
                        <IconButton sx={{color: "white"}}>
                            <AccountCircle />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Đăng xuất">
                        <IconButton sx={{color: "white"}} onClick={handleLogout}>
                            <Logout />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} sx={{overflowY: "hidden"}}>
                <Notification onItemsChange={(items) => setNotificationCount(items.length)} onClose={() => setAnchorEl(null)} />
            </Menu>
        </AppBar>
    );
}

export default Header;
