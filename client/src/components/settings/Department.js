import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel,
    IconButton,
    List,
    ListItem, ListItemIcon,
    ListItemSecondaryAction,
    ListItemText, Menu, MenuItem,
    Paper, Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow, TextField, Typography
} from "@mui/material";
import {Add, CheckBox, Delete, Edit, MoreVert, Visibility} from "@mui/icons-material";
import {useContext, useEffect, useState} from "react";
import request from "../../utils/request";
import context from "../../utils/context";
import {LoadingButton} from "@mui/lab";
import {Box} from "@mui/system";

function Department() {
    const {isLoading, startLoading, stopLoading, error, success} = useContext(context);
    const [departments, setDepartments] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogType, setDialogType] = useState(null);
    const [actionType, setActionType] = useState("");
    const [currentDepartmentIndex, setCurrentDepartmentIndex] = useState(null);

    useEffect(() => {
        getDepartments().then(data => setDepartments(data));
    }, []);

    const getDepartments = () => {
        return new Promise(((resolve, reject) => {
            startLoading();
            request.get("/departments").then(res => {
                stopLoading();
                resolve(res.data);
            }).catch(err => {
                reject(err);
                error("Có lỗi xảy ra");
            });
        }));
    }

    const handleCloseDialog = () => {
        setDialogType(null);
    }

    const handleOpenDialog = (type) => {
        setDialogType(type);
    }

    const handleCreateDepartment = (e) => {
        e.preventDefault();
        const data = {
            name: e.currentTarget.name.value,
        }

        startLoading();
        request.post("/departments", data).then(res => {
            getDepartments().then(data => setDepartments(data));
            stopLoading();
            success("Thêm phòng ban mới thành công");
            handleCloseDialog();
        }).catch(err => {
            error("Có lỗi xảy ra");
            stopLoading();
        });
    }

    const handleEditDepartment = (e, departmentIndex) => {
        e.preventDefault();
        const data = {
            name: e.currentTarget.name.value,
        }
        startLoading();
        request.put(`/departments/${departments.data[departmentIndex]._id}`, data).then(res => {
            departments.data[departmentIndex].name = res.data.name;
            setDepartments(departments);
            stopLoading();
            success("Chỉnh sửa phòng ban thành công");
            setCurrentDepartmentIndex(null);
            handleCloseDialog();
        }).catch(err => {
            error("Có lỗi xảy ra");
            stopLoading();
        });
    }

    const handleDeleteDepartment = (departmentIndex) => {
        startLoading();
        request.delete(`/departments/${departments.data[departmentIndex]._id}`).then(res => {
            departments.data.splice(departmentIndex, 1);
            setDepartments(departments);
            stopLoading();
            success("Xóa phòng ban thành công");
            setCurrentDepartmentIndex(null);
            handleCloseDialog();
        }).catch(err => {
            error("Có lỗi xảy ra");
            stopLoading();
        });
    }

    return (
        <Paper sx={{display: "flex", flexDirection: "column", flexGrow: 1, p: 1}}>
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography variant="h4" align="center" sx={{fontWeight: "bold"}}>Phòng ban</Typography>
                <Button size="small" startIcon={<Add />} variant="contained" onClick={() => handleOpenDialog("department-create")}>Thêm phòng ban</Button>
            </Box>
            <TableContainer sx={{flexGrow: 1, height: 0, overflowY: "auto"}}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">STT</TableCell>
                            <TableCell align="center">Tên phòng ban</TableCell>
                            <TableCell align="center">Số lượng CB-GV</TableCell>
                            <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {departments?.data?.map((department, index) =>
                            <TableRow>
                                <TableCell align="center">{index+1}</TableCell>
                                <TableCell align="center">{department.name}</TableCell>
                                <TableCell align="center">{department.userCount}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={(e) => {
                                        setAnchorEl(e.currentTarget);
                                        setActionType("department");
                                        setCurrentDepartmentIndex(index);
                                    }}>
                                        <MoreVert fontSize="small"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => {
                    handleOpenDialog(`${actionType}-edit`);
                    setAnchorEl(null);
                }}>
                    <ListItemIcon><Edit/></ListItemIcon>
                    <ListItemText>Chỉnh sửa</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                    handleOpenDialog(`${actionType}-delete`);
                    setAnchorEl(null);
                }}>
                    <ListItemIcon><Delete/></ListItemIcon>
                    <ListItemText>Xóa</ListItemText>
                </MenuItem>
            </Menu>

            <Dialog open={dialogType === "department-create"} onClose={handleCloseDialog}>
                <form onSubmit={handleCreateDepartment}>
                    <DialogTitle sx={{textAlign: "center"}}>Thêm phòng ban mới</DialogTitle>
                    <DialogContent sx={{"& > :not(style)": {my: 1}}}>
                        <TextField size="small" fullWidth name="name" label="Tên phòng ban"/>
                    </DialogContent>
                    <DialogActions sx={{justifyContent: "center"}}>
                        <Button variant="outlined" onClick={handleCloseDialog}>Hủy</Button>
                        <LoadingButton loading={isLoading} type="submit" variant="contained">Thêm</LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={dialogType === "department-edit"} onClose={() => {
                handleCloseDialog();
                setCurrentDepartmentIndex(null);
            }}>
                <form onSubmit={(e) => handleEditDepartment(e, currentDepartmentIndex)}>
                    <DialogTitle sx={{textAlign: "center"}}>Chỉnh sửa phòng ban</DialogTitle>
                    <DialogContent sx={{"& > :not(style)": {my: 1}}}>
                        {currentDepartmentIndex !== null ?
                            <>
                                <TextField size="small" fullWidth name="name" label="Tên phòng ban"
                                           defaultValue={departments.data[currentDepartmentIndex]?.name}/>
                            </>
                            : <></>}
                    </DialogContent>
                    <DialogActions sx={{justifyContent: "center"}}>
                        <Button variant="outlined" onClick={handleCloseDialog}>Hủy</Button>
                        <LoadingButton loading={isLoading} type="submit" variant="contained">Chỉnh sửa</LoadingButton>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={dialogType === "department-delete"} onClose={() => {
                handleCloseDialog();
                setCurrentDepartmentIndex(null);
            }}>
                <DialogTitle sx={{textAlign: "center"}}>Xóa phòng ban</DialogTitle>
                <DialogActions sx={{justifyContent: "center"}}>
                    <Button variant="outlined" onClick={handleCloseDialog}>Hủy</Button>
                    <LoadingButton loading={isLoading} type="submit" variant="contained" color="error"
                                   onClick={() => handleDeleteDepartment(currentDepartmentIndex)}>Xóa</LoadingButton>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}

export default Department