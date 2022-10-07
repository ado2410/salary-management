import {useContext, useEffect, useState} from "react";
import request from "../../utils/request";
import context from "../../utils/context";
import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper, Skeleton,
    Typography
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {Alert, LoadingButton} from "@mui/lab";

function Index() {
    const navigate = useNavigate();
    const {error, success, isLoading, startLoading, stopLoading, role} = useContext(context);
    const [id, setId] = useState(null);
    const [salaries, setSalaries] = useState([]);
    const [dialogType, setDialogType] = useState(null);

    useEffect(() => {
        refresh();
    }, []);

    const refresh = () => {
        getSalaries().then(data => setSalaries(data));
    }

    const getSalaries = () => {
        return new Promise((resolve, reject) => {
            startLoading();
            request.get("/salaries").then(res => {
                stopLoading();
                resolve(res.data);
            }).catch(err => {
                stopLoading();
                error("Tải danh sách lương bị lỗi");
                reject(err);
            });
        });
    }

    const handleViewSalary = (_id) => {
        navigate(`/salaries/${_id}`);
    }

    const handleOpenDialog = (action) => {
        setDialogType(action);
    }

    const handleCloseDialog = () => {
        setDialogType(null);
    }

    const handleDeleteSalary = () => {
        startLoading();
        request.delete(`/salaries/${id}`).then(res => {
            success("Xóa thành công");
            getSalaries().then(data => setSalaries(data));
            handleCloseDialog();
            stopLoading();
        }).catch(err => {
            error("Có lỗi xảy ra");
            handleCloseDialog();
            stopLoading();
        });
    }

    return (
        <>
            <Paper sx={{p: 1, mb: 1, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Typography sx={{mb: 1, fontWeight: "bold"}} variant="h4">Danh sách lương</Typography>
                <Button size="small" variant="contained" onClick={refresh} color="secondary">Làm mới</Button>
            </Paper>

            <List component={Paper} sx={{flexGrow: 1}}>
                {salaries.map((salary, index) => (
                    <ListItem disablePadding key={index} divider secondaryAction={
                        role.name !== "teacher" ?
                            <IconButton onClick={() => {
                                handleOpenDialog("delete");
                                setId(salary._id);
                            }}>
                                <Delete/>
                            </IconButton>
                            : <></>
                    }>
                        <ListItemButton onClick={() => handleViewSalary(salary._id)}>
                            <ListItemText primary={`Tháng ${salary.period.month}/${salary.period.year}`}
                                          secondary={`${salary.sum.toLocaleString()}đ`}/>
                        </ListItemButton>
                    </ListItem>
                ))}
                {isLoading ?
                    <ListItem secondaryAction={<Skeleton variant="circular"/>}>
                        <ListItemText primary={<Skeleton width={180} variant="text"/>} secondary={<Skeleton width={200} variant="text"/>} />
                    </ListItem>
                    : <></>
                }
            </List>

            <Dialog open={dialogType === "delete"} onClose={handleCloseDialog}>
                <DialogTitle sx={{textAlign: "center"}}>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Alert severity="warning">Toàn bộ dữ liệu sẽ bị mất và không thể khôi phục!</Alert>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{display: "flex", justifyContent: "center"}}>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <LoadingButton variant="contained" color="error" loading={isLoading}
                                   onClick={handleDeleteSalary}>Xóa</LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Index;