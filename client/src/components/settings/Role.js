import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Paper,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import request from "../../utils/request";
import context from "../../utils/context";

function Role() {
    const {isLoading, startLoading, stopLoading, error, success} = useContext(context);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getRoles().then(data => setRoles(data));
    }, []);

    const getRoles = () => {
        return new Promise(((resolve, reject) => {
            startLoading();
            request.get("/roles").then(res => {
                stopLoading();
                resolve(res.data)
            }).catch(err => {
                reject(err);
                error("Có lỗi xảy ra");
            });
        }));
    }

    const handleChangePermission = (role, permisison, checked) => {
        const data = {
            roleCode: role,
            permissionCode: permisison,
            checked: checked,
        };
        startLoading();
        request.put("/roles", data).then(res => {
            stopLoading();
            success("Đã lưu");
        }).catch(err => {
            stopLoading();
            error("Có lỗi xảy ra");
        });
    }

    const Role = (props) => (
        <Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Xem danh sách</TableCell>
                            <TableCell>Xem chi tiết</TableCell>
                            <TableCell>Thêm/nhập</TableCell>
                            <TableCell>Chỉnh sửa</TableCell>
                            <TableCell>Xóa</TableCell>
                            <TableCell>Khác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[
                            {label: "Tài khoản", name: "user"},
                            {label: "Lương", name: "salary"},
                            {label: "Bài đăng", name: "post"},
                            {label: "Bình luận", name: "comment"},
                            {label: "Phản hồi", name: "feedback"},
                            {label: "Vai trò", name: "role", except: ["create", "delete"]},
                            {label: "Phân quyền", name: "permission", except: ["create", "update", "delete"]},
                        ].map((item, index) =>
                            <Permission label={item.label} role={props.name} name={item.name} exept={item.except || []} permissions={props.permissions?.filter(permission => permission.code?.split("-")[0] === item.name) || []} />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );

    const Permission = (props) => (
        <TableRow>
            <TableCell>{props.label}</TableCell>
            {["list", "view", "create", "update", "delete"].map((item, index) =>
                <TableCell>
                    {!props.exept?.includes(item) &&
                        <Switch
                            defaultChecked={props.permissions?.filter(permission => permission.code?.split("-")[1] === item).length > 0}
                            name={`${props.name}-${item}`}
                            onChange={(e) => {
                                handleChangePermission(props.role, `${props.name}-${item}`, e.target.checked);
                            }}
                        />
                    }
                </TableCell>
            )}
            <TableCell></TableCell>
        </TableRow>
    );

    return (
        <Box sx={{"& > :not(style)": {mb: 1}, flexGrow: 1, overflowY: "auto"}}>
            <Paper sx={{p: 1}}>
                <Typography variant="h4" align="center"><b>Quản lý phân quyền người dùng</b></Typography>
            </Paper>
            <Accordion>
                <AccordionSummary>Người quản trị</AccordionSummary>
                <AccordionDetails>
                    <Role label="Người quản trị" name="admin" permissions={roles?.filter(role => role.code === "admin")[0]?.permissions || []} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>Người nhập liệu</AccordionSummary>
                <AccordionDetails>
                    <Role label="Người nhập liệu" name="input" permissions={roles?.filter(role => role.code === "input")[0]?.permissions || []} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary>Giảng viên (Chỉ tương tác được với dữ liệu của họ)</AccordionSummary>
                <AccordionDetails>
                    <Role label="Giảng viên (Chỉ tương tác được với dữ liệu của họ)" name="teacher" permissions={roles?.filter(role => role.code === "teacher")[0]?.permissions || []} />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

export default Role;