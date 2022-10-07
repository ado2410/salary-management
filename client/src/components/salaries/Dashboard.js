import {
    Button, Divider,
    Grid, List, ListItem, ListItemButton, ListItemText,
    Paper,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import context from "../../utils/context";

function Dashboard(props) {
    const {startLoading, stopLoading, isLoading, error, role} = useContext(context);
    const {salary} = props;
    const navigate = useNavigate();

    const redirect = (salaryType, salaryIndex = 0) => {
        navigate(`/salaries/${salary._id}?type=${salaryType}&index=${salaryIndex}`);
    }

    return (
        <>
            <Paper sx={{p: 2}}>
                <Typography variant="h4" textAlign="center"><b>Lương tháng {salary?.period?.month}/{salary?.period?.year}</b></Typography>
            </Paper>

            <Grid container>
                {[
                    {
                        label: "Lương chính",
                        value: role.name === "teacher" ? salary?.salaries?.main?.data?.mainRemain?.value?.toLocaleString() : salary?.mainRemain?.toLocaleString(),
                        type: "main",
                        mainSalaryType: 1,
                        color: "#EB4B23",
                    },
                    {
                        label: "Lương tăng thêm",
                        value: role.name === "teacher" ? salary?.salaries?.main?.data?.addRemain?.value?.toLocaleString() : salary?.addRemain?.toLocaleString(),
                        type: "add",
                        mainSalaryType: 2,
                        color: "#C40CEB",
                    },
                    {
                        label: "Quản lý phí",
                        value: role.name === "teacher" ? salary?.salaries?.main?.data?.feeRemain?.value?.toLocaleString() : salary?.feeRemain?.toLocaleString(),
                        type: "fee",
                        mainSalaryType: 3,
                        color: "#1765eb",
                    },
                    {
                        label: "Lương giảng dạy",
                        value: role.name === "teacher" ? salary?.salaries?.teach?.data?.sum?.value?.toLocaleString() : salary?.teachSum?.toLocaleString(),
                        type: "teach",
                        color: "#00EB9D",
                    },
                ].map((item, index, array) => (
                    <Grid
                        item
                        key={index}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        sx={{
                            pr: index < (array.length - 1) ? 2 : 0,
                        }}
                    >
                        <Paper
                            sx={{
                                p: 2,
                                my: 1,
                                width: "100%",
                                display: "block",
                                textAlign: "center",
                                textTransform: "none",
                            }}
                            component={Button}
                            onClick={() => {
                                redirect(item.type);
                            }}>
                            <Typography>{item.label}</Typography>
                            <Typography sx={{color: item.color || "initial"}} variant="h6"><b>{item.value ? `${item.value}đ` : 'Chưa có dữ liệu'}</b></Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Paper sx={{p: 2}}>
                <Typography variant="h5" textAlign="center"><b>Phúc lợi</b></Typography>
                <List>
                    <Divider/>
                    {salary?.salaries?.welfare?.map((welfare, index) =>
                        <ListItem key={index} disablePadding divider sx={{display: "flex", justifyContent: "center"}}>
                            <ListItemButton
                                onClick={() => {
                                    redirect("welfare", index);
                                }}
                            >
                                <ListItemText primary={welfare.name}
                                              secondary={<b>{role.name === "teacher" ? welfare.data.sum.value.toLocaleString() : salary.welfareSum[index].toLocaleString()}đ</b>}/>
                            </ListItemButton>
                        </ListItem>
                    )}
                    {!salary?.salaries?.welfare || salary?.salaries?.welfare.length === 0 ?
                        <Typography align="center" sx={{mt: 1}}>Chưa có dữ liệu</Typography>
                        : <></>
                    }
                </List>
            </Paper>

            <Paper sx={{my: 1, p: 2}}>
                <Typography variant="h5" textAlign="center"><b>Các khoản khác</b></Typography>
                <List>
                    <Divider/>
                    {salary?.salaries?.other?.map((other, index) =>
                        <ListItem key={index} disablePadding divider>
                            <ListItemButton
                                onClick={() => {
                                    redirect("other", index);
                                }}
                            >
                                <ListItemText primary={other.name}
                                              secondary={<b>{role.name === "teacher" ? other.data.sum.value.toLocaleString() : salary.otherSum[index].toLocaleString()}đ</b>}/>
                            </ListItemButton>
                        </ListItem>
                    )}
                    {!salary?.salaries?.other || salary?.salaries?.other.length === 0 ?
                        <Typography align="center" sx={{mt: 1}}>Chưa có dữ liệu</Typography>
                        : <></>
                    }
                </List>
            </Paper>
        </>
    );
}

export default Dashboard;