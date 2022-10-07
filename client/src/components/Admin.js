import {Route, Routes} from "react-router-dom";
import {
    Accessibility,
    AccountCircle,
    AdminPanelSettings,
    Article, Construction,
    ExpandLess,
    ExpandMore, Group, Info as InfoIcon,
    InsertChart,
    Keyboard,
    Paid,
    Payments,
    Person, Settings,
    UploadFile,
} from "@mui/icons-material";
import {
    Collapse,
    Divider,
    Drawer, Grid,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText, Paper,
} from "@mui/material";
import {Box} from "@mui/system";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "./Header";
import Import from "./salaries/Import";
import AdminIndex from "./users/Index";
import SalaryIndex from "./salaries/Index";
import SalaryView from "./salaries/View";
import PostIndex from "./posts/Index";
import SettingIndex from "./settings/Index";
import context from "../utils/context";
import Department from "./settings/Department";
import Role from "./settings/Role";
import Info from "./settings/Info";
import SalaryStruct from "./settings/SalaryStruct";
import Dashboard from "./Dashboard";

const pages = [
    {
        label: "Thống kê",
        path: "/",
        icon: <InsertChart/>,
    },
    {
        label: "Quản lý tài khoản",
        icon: <AccountCircle/>,
        children: [
            {
                label: "Admin",
                path: "/users/admin",
                icon: <AdminPanelSettings/>,
            },
            {
                label: "Người nhập liệu",
                path: "/users/input",
                icon: <Keyboard/>,
            },
            {
                label: "Cán bộ - Giảng viên",
                path: "/users/teacher",
                icon: <Person/>,
            },
        ],
    },
    {
        label: "Quản lý lương",
        icon: <Payments/>,
        children: [
            {
                label: "Xem lương",
                path: "/salaries",
                icon: <Paid/>,
            },
            {
                label: "Nhập lương",
                path: "/salaries/import",
                icon: <UploadFile/>,
            },
        ],
    },
    {
        label: "Quản lý bài đăng",
        path: "/posts",
        icon: <Article/>,
    },
    {
        label: "Cài đặt hệ thống",
        path: "/settings",
        icon: <Settings/>,
        children: [
            {
                label: "Thông tin",
                path: "/settings/info",
                icon: <InfoIcon/>,
            },
            {
                label: "Quản lý phòng ban",
                path: "/settings/departments",
                icon: <Group/>,
            },
            {
                label: "Quản lý phân quyền",
                path: "/settings/roles",
                icon: <Accessibility/>,
            },
            {
                label: "Tùy chỉnh cấu trúc lương",
                path: "/settings/salaries",
                icon: <Construction/>,
            },
        ],
    },
];
function Admin() {

    const navigate = useNavigate();
    const {isLoading} = useContext(context);
    const [open, setOpen] = useState(-1);
    const [openMenu, setOpenMenu] = useState(false);

    const handleToggleListItem = (index) => {
        if (open === index) setOpen(-1);
        else setOpen(index);
    };

    const handleOpenListItem = (path) => {
        navigate(path);
        setOpenMenu(false);
    };

    const handleToggleMenu = () => {
        setOpenMenu((state) => !state);
    }

    const Page = () => (
        <Box>
            <Divider/>
            <List>
                {pages.map((page, index) => (
                    <>
                        <ListItemButton
                            key={index}
                            selected={window.location.pathname === page.path}
                            onClick={() =>
                                page.children
                                    ? handleToggleListItem(index)
                                    : handleOpenListItem(page.path)
                            }
                        >
                            <ListItemIcon>{page.icon}</ListItemIcon>
                            <ListItemText primary={page.label}/>
                            {page.children ? (
                                open === index ? (
                                    <ExpandLess/>
                                ) : (
                                    <ExpandMore/>
                                )
                            ) : (
                                <></>
                            )}
                        </ListItemButton>
                        {page.children ? (
                            <Collapse in={open === index}>
                                <List>
                                    {page.children.map((child, index) => (
                                        <ListItemButton
                                            key={index}
                                            selected={window.location.pathname === child.path}
                                            sx={{pl: 4}}
                                            onClick={() =>
                                                handleOpenListItem(child.path)
                                            }
                                        >
                                            <ListItemIcon>
                                                {child.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={child.label}
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        ) : (
                            <></>
                        )}
                    </>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <Drawer
                open={openMenu}
                onClose={handleToggleMenu}
                variant="temporary"
            >
                <Page/>
            </Drawer>
            <Grid container>
                <Grid
                    item
                    sx={12}
                    sm={5}
                    md={4}
                    lg={2}
                    xl={2}
                    sx={(theme) => ({
                            [theme.breakpoints.down("md")]: {
                                display: "none",
                        }}
                    )}
                >
                    <Paper sx={{height: "99vh"}}>
                        <Page />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={7} md={8} lg={10} xl={10}>
                    <Box component="main" sx={(theme) => ({
                        [theme.breakpoints.up("md")]: {
                            marginLeft: 0,
                        },
                        px: 1,
                        height: "99vh",
                        display: "flex",
                        flexDirection: "column",
                    })}>
                        <Box sx={{pb: 1}}>
                            <Header onClickMenu={handleToggleMenu}/>
                        </Box>
                        <Routes>
                            <Route path="/" element={<Dashboard/>}/>
                            <Route path="/users/:type" element={<AdminIndex/>}/>
                            <Route path="/salaries" element={<SalaryIndex/>}/>
                            <Route path="/salaries/:id" element={<SalaryView/>}/>
                            <Route path="/salaries/import" element={<Import/>}/>
                            <Route path="/posts" element={<PostIndex/>}/>
                            <Route path="/settings/info" element={<Info/>}/>
                            <Route path="/settings/departments" element={<Department/>}/>
                            <Route path="/settings/roles" element={<Role/>}/>
                            <Route path="/settings/salaries" element={<SalaryStruct/>}/>
                        </Routes>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default Admin;
