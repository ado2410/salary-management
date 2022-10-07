import {
    columns as initColumns,
    getReviewData,
    selectColumns,
    updateData,
} from "../../utils/datagrid";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import request from "../../utils/request";
import context from "../../utils/context";
import { DataGrid } from "@mui/x-data-grid";
import {
    AppBar,
    Avatar,
    Box,
    Button,
    ButtonBase,
    ButtonGroup,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Select,
    Tab,
    TableContainer,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import {
    Delete,
    DoDisturb,
    Edit,
    MoreVert,
    Save,
    Send,
    Storage,
} from "@mui/icons-material";
import { Alert, LoadingButton } from "@mui/lab";
import {
    Tooltip,
    Chart,
    PieSeries,
} from "@devexpress/dx-react-chart-material-ui";
import { timeSince } from "../../utils/date";
import Feedback from "./Feedback";
import Tool from "./Tool";
import Dashboard from "./Dashboard";

function View() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { isLoading, startLoading, stopLoading, error, success } =
        useContext(context);
    const [dialogType, setDialogType] = useState(null);
    const [originalSalary, setOriginalSalary] = useState({});
    const [salary, setSalary] = useState(null);
    const [currentSalary, setCurrentSalary] = useState([]);
    const [columns, setColumns] = useState(initColumns.main);
    const [reviewData, setReviewData] = useState([]);
    const [users, setUsers] = useState([]);
    const [salaryType, setSalaryType] = useState("statistic");
    const [salaryIndex, setSalaryIndex] = useState(0);
    const [changes, setChanges] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [actionType, setActionType] = useState("");

    // Get salary from server and select init columns
    useEffect(() => {
        getSalary().then((data) => setSalary(data));
        selectCurrentColumns(salaryType);
    }, []);

    useEffect(() => {
        setSalaryType(searchParams.get("type") || "statistic");
        setSalaryIndex(searchParams.get("index") || 0);
    }, [searchParams]);

    // Update current salary and review data after changes {salary, salaryType and salaryIndex}
    useEffect(() => {
        let tempSalary = getCurrentSalary();
        const reviewData = tempSalary?.data
            ? getReviewData(tempSalary.data)
            : [];
        setCurrentSalary(tempSalary);
        setReviewData(reviewData);
    }, [salary, salaryType, salaryIndex, columns]);

    useEffect(() => {
        setOriginalSalary(JSON.parse(JSON.stringify(salary)));
    }, [salary]);

    // Get salary from server
    const getSalary = () => {
        startLoading();
        return new Promise((resolve, reject) => {
            request
                .get(`/salaries/${id}`)
                .then((res) => {
                    stopLoading();
                    resolve(res.data);
                })
                .catch((err) => {
                    error("Có lỗi xảy ra");
                    reject(err);
                });
        });
    };

    // Get current salary based on salary type
    const getCurrentSalary = () => {
        let tempSalary = null;
        let thisSalaryType = salaryType;
        if (["add", "fee"].includes(salaryType)) thisSalaryType = "main";
        switch (thisSalaryType) {
            case "main":
                tempSalary = salary?.salaries?.main
                    ? salary?.salaries?.main
                    : null;
                break;
            case "teach":
                tempSalary = salary?.salaries?.teach
                    ? salary?.salaries?.teach
                    : null;
                break;
            case "guide":
                tempSalary = salary?.salaries?.guide
                    ? salary?.salaries?.guide
                    : null;
                break;
            case "welfare":
                tempSalary = salary?.salaries?.welfare
                    ? salary?.salaries?.welfare.length > salaryIndex
                        ? salary?.salaries?.welfare[salaryIndex]
                        : null
                    : null;
                break;
            case "other":
                tempSalary = salary?.salaries?.other
                    ? salary?.salaries?.other.length > salaryIndex
                        ? salary?.salaries?.other[salaryIndex]
                        : null
                    : null;
                break;
            default:
                tempSalary = null;
                break;
        }

        // Add id to data
        if (tempSalary) {
            tempSalary.data = tempSalary?.data?.map((row, index) => {
                if (!row.id) row.id = index;
                return row;
            });
        }

        return tempSalary;
    };

    // Select current columns
    const selectCurrentColumns = (type) => {
        selectColumns(type, ["username", "name"]).then((data) => {
            setColumns(data.columns);
            setUsers(data.users);
        });
    };

    //Handle change salary type
    const handleChangeSalaryType = (value) => {
        navigate(`/salaries/${id}?type=${value}&index=0`);
        selectCurrentColumns(value);
    };

    // handle change cell of the dataset
    const handleCellEditCommit = (params) => {
        const oldRow = currentSalary.data.filter(
            (row) => row.id === params.id
        )[0];
        const oldValue = { ...oldRow[params.field] };

        const updatedData = updateData(currentSalary.data, params);
        setSalary((state) => {
            switch (salaryType) {
                case "main":
                    state.salaries.main.data = updatedData;
                    break;
                case "add":
                    state.salaries.main.data = updatedData;
                    break;
                case "fee":
                    state.salaries.main.data = updatedData;
                    break;
                case "teach":
                    state.salaries.teach.data = updatedData;
                    break;
                case "guide":
                    state.salaries.guide.data = updatedData;
                    break;
                case "welfare":
                    state.salaries.welfare[salaryIndex].data = updatedData;
                    break;
                case "other":
                    state.salaries.other[salaryIndex].data = updatedData;
                    break;
            }
            return state;
        });
        let newRow = updatedData.filter((row) => row.id === params.id)[0];

        if (
            oldValue.value?.toString() ===
            newRow[params.field].value?.toString()
        )
            return;

        setChanges((state) => {
            let index = null;
            state.forEach((change, i) =>
                change.type === salaryType &&
                change.column === params.field &&
                change.ref === newRow._id
                    ? (index = i)
                    : null
            );

            if (index !== null) {
                if (
                    state[index].oldValue.value.toString() ===
                    newRow[params.field].value.toString()
                )
                    state.splice(index, 1);
                else state[index].newValue = newRow[params.field];
            } else {
                state.push({
                    type: salaryType,
                    rowRef: newRow._id,
                    salaryRef: currentSalary._id,
                    column: params.field,
                    oldValue: oldValue,
                    newValue: newRow[params.field],
                });
            }
            console.log(state);
            return [...state];
        });
    };

    const handleSaveSalary = () => {
        const data = {
            salaries: salary.salaries,
            changes: changes,
        };

        startLoading();
        request
            .put(`/salaries/${id}`, data)
            .then((res) => {
                stopLoading();
                success("Cập nhật lương thành công");
                setChanges([]);
                salary.histories = res.data.reverse();
                setSalary({ ...salary });
                handleCloseDialog();
            })
            .catch((err) => {
                stopLoading();
                error("Có lỗi xảy ra");
                handleCloseDialog();
            });
    };

    const handleCancelSalary = () => {
        setChanges([]);
        salary.salaries = originalSalary.salaries;
        setSalary({ ...salary });
        handleCloseDialog();
    };

    const handleDeleteSalary = () => {
        startLoading();
        request
            .delete(`/salaries/${id}?type=${salaryType}&index=${salaryIndex}`)
            .then((res) => {
                success("Xóa thành công");
                setSalaryIndex(0);
                getSalary().then((data) => setSalary(data));
                handleCloseDialog();
                stopLoading();
            })
            .catch((err) => {
                error("Có lỗi xảy ra");
                handleCloseDialog();
                stopLoading();
            });
    };

    const handleOpenDialog = (action) => {
        setDialogType(action);
    };

    const handleCloseDialog = () => {
        setDialogType(null);
    };

    //handle send email
    const handleSendMail = () => {
        request.get(`/salaries/${id}/sendMail?type=${salaryType}`);
        handleCloseDialog();
        success("Đã gửi email");
    }

    if (salary)
        return (
            <>
                <Paper sx={{ p: 1, mb: 1 }}>
                    <Box
                        sx={{
                            "& > :not(style)": { mb: 1, mr: 1 },
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            size="small"
                            disabled={changes.length === 0}
                            variant="contained"
                            endIcon={<Save />}
                            onClick={() => handleOpenDialog("salary-save")}
                        >
                            Lưu
                        </Button>
                        <Button
                            size="small"
                            disabled={changes.length === 0}
                            variant="contained"
                            endIcon={<DoDisturb />}
                            color="secondary"
                            onClick={() => handleOpenDialog("salary-cancel")}
                        >
                            Hủy
                        </Button>
                    </Box>

                    <AppBar position="static" sx={{ mb: 1 }}>
                        <Tabs
                            centered
                            value={salaryType}
                            onChange={(e, v) => handleChangeSalaryType(v)}
                            indicatorColor="secondary"
                            textColor="inherit"
                        >
                            {[
                                { label: "Tổng quan", value: "statistic" },
                                { label: "Lương chính", value: "main" },
                                { label: "Lương tăng thêm", value: "add" },
                                { label: "Quản lý phí", value: "fee" },
                                { label: "Lương giảng dạy", value: "teach" },
                                { label: "Đồ án", value: "guide" },
                                { label: "Phúc lợi", value: "welfare" },
                                { label: "Các khoản khác", value: "other" },
                            ].map((item, index) => (
                                <Tab
                                    key={index}
                                    label={item.label}
                                    value={item.value}
                                />
                            ))}
                        </Tabs>
                    </AppBar>

                    {salaryType === "statistic" ? (
                        <Typography variant="h4"></Typography>
                    ) : salaryType === "main" ? (
                        <Typography variant="h4"></Typography>
                    ) : salaryType === "teach" ? (
                        <Typography variant="h5" align="center">
                            {salary.salaries?.teach?.name}
                        </Typography>
                    ) : salaryType === "guide" ? (
                        <Typography variant="h5" align="center">
                            {salary.salaries?.guide?.name}
                        </Typography>
                    ) : salaryType === "welfare" ? (
                        <Typography variant="h5" align="center">
                            {salary?.salaries?.welfare &&
                                salary?.salaries?.welfare[salaryIndex]?.name}
                        </Typography>
                    ) : salaryType === "other" ? (
                        <Typography variant="h5" align="center">
                            {salary?.salaries?.other &&
                                salary?.salaries?.other[salaryIndex]?.name}
                        </Typography>
                    ) : (
                        <></>
                    )}

                    {["welfare", "other"].includes(salaryType) &&
                    salary?.salaries[salaryType]?.length > 0 &&
                    !isLoading ? (
                        <Box
                            sx={{
                                mt: 1,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Select
                                size="small"
                                label="Chọn"
                                value={salaryIndex}
                                onChange={(e) => setSalaryIndex(e.target.value)}
                            >
                                {salary.salaries[salaryType]?.map(
                                    (item, index) => (
                                        <MenuItem key={index} value={index}>
                                            {item.name}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </Box>
                    ) : (
                        <></>
                    )}

                    {salaryType !== "statistic" && reviewData.length > 0 ? (
                        <Box
                            sx={{
                                "& > :not(style)": { mt: 1, mr: 1 },
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Button
                                size="small"
                                variant="contained"
                                endIcon={<Delete />}
                                onClick={() => handleOpenDialog("data-send-mail")}
                            >
                                Gửi email lương
                            </Button>
                            <Button
                                size="small"
                                disabled={true}
                                variant="contained"
                                endIcon={<Delete />}
                                onClick={() => handleOpenDialog("data-delete")}
                            >
                                Xóa dữ liệu
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                color="error"
                                endIcon={<Delete />}
                                onClick={() =>
                                    handleOpenDialog("salary-delete")
                                }
                            >
                                Xóa lương
                            </Button>
                        </Box>
                    ) : (
                        <></>
                    )}
                </Paper>

                {salaryType === "statistic" ? (
                    <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                        <Dashboard salary={salary} />
                    </Box>
                ) : reviewData.length > 0 ? (
                    <TableContainer sx={{ flexGrow: 1, display: "flex" }}>
                        <Grid container style={{ flexGrow: 1 }} spacing={1}>
                            <Grid
                                item
                                xs={12}
                                sm={7}
                                md={7}
                                lg={8}
                                xl={9}
                                sx={{ flexGrow: 1 }}
                            >
                                <Paper
                                    style={{ width: "100%", height: "100%" }}
                                >
                                    <DataGrid
                                        hideFooter
                                        rows={reviewData}
                                        columns={columns}
                                        checkboxSelection
                                        disableSelectionOnClick
                                        onCellEditCommit={handleCellEditCommit}
                                    />
                                </Paper>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={5}
                                md={5}
                                lg={4}
                                xl={3}
                                sx={(theme) => ({
                                    flexGrow: 1,
                                    display: "flex",
                                    [theme.breakpoints.down("md")]: {
                                        display: "none",
                                    },
                                })}
                            >
                                <Tool
                                    salary={salary}
                                    currentSalary={getCurrentSalary()}
                                    salaryType={salaryType}
                                />
                            </Grid>
                        </Grid>
                    </TableContainer>
                ) : (
                    <Paper
                        sx={{
                            p: 2,
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Storage sx={{ fontSize: 150 }} color="disabled" />
                        <Typography textAlign="center" variant="h6">
                            Chưa có dữ liệu
                        </Typography>
                    </Paper>
                )}

                <Menu
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem
                        onClick={() => {
                            handleOpenDialog(`${actionType}-edit`);
                            setAnchorEl(null);
                        }}
                    >
                        <ListItemIcon>
                            <Edit />
                        </ListItemIcon>
                        <ListItemText>Chỉnh sửa</ListItemText>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            handleOpenDialog(`${actionType}-delete`);
                            setAnchorEl(null);
                        }}
                    >
                        <ListItemIcon>
                            <Delete />
                        </ListItemIcon>
                        <ListItemText>Xóa</ListItemText>
                    </MenuItem>
                </Menu>

                <Dialog
                    open={dialogType === "salary-delete"}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle sx={{ textAlign: "center" }}>
                        Xác nhận xóa lương
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Alert severity="warning">
                                Toàn bộ dữ liệu sẽ bị mất và không thể khôi
                                phục!
                            </Alert>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center" }}>
                        <Button variant="outlined" onClick={handleCloseDialog}>
                            Hủy
                        </Button>
                        <LoadingButton
                            variant="contained"
                            color="error"
                            loading={isLoading}
                            onClick={handleDeleteSalary}
                        >
                            Xóa
                        </LoadingButton>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={dialogType === "data-delete"}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogActions>
                        <Button variant="contained" onClick={handleCloseDialog}>
                            Hủy
                        </Button>
                        <LoadingButton
                            variant="contained"
                            color="error"
                            loading={isLoading}
                            onClick={handleDeleteSalary}
                        >
                            Xóa
                        </LoadingButton>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={dialogType === "data-send-mail"}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>Xác nhận gửi email</DialogTitle>
                    <DialogActions>
                        <Button variant="contained" onClick={handleCloseDialog}>
                            Hủy
                        </Button>
                        <LoadingButton
                            variant="contained"
                            color="success"
                            loading={isLoading}
                            onClick={handleSendMail}
                        >
                            Gửi
                        </LoadingButton>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={dialogType === "salary-cancel"}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>Xác nhận hủy thay đổi</DialogTitle>
                    <DialogActions>
                        <Button variant="contained" onClick={handleCloseDialog}>
                            Không
                        </Button>
                        <LoadingButton
                            variant="contained"
                            color="error"
                            loading={isLoading}
                            onClick={handleCancelSalary}
                        >
                            Có
                        </LoadingButton>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={dialogType === "salary-save"}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>Xác nhận lưu</DialogTitle>
                    <DialogActions>
                        <Button variant="contained" onClick={handleCloseDialog}>
                            Hủy
                        </Button>
                        <LoadingButton
                            variant="contained"
                            color="success"
                            loading={isLoading}
                            onClick={handleSaveSalary}
                        >
                            Lưu
                        </LoadingButton>
                    </DialogActions>
                </Dialog>
            </>
        );
    else
        return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Chip sx={{ my: 2 }} label="Đang tải dữ liệu..." />
            </Box>
        );
}

export default View;
