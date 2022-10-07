import {Box, Paper, Tab, Tabs, Typography} from "@mui/material";
import Feedback from "./Feedback";
import History from "./History";
import {useEffect, useState} from "react";

function Tool(props) {
    const {salary, currentSalary, salaryType} = props;
    const [tabType, setTabType] = useState("feedback");

    useEffect(() => {
        if (salaryType === "statistic") setTabType("info");
        else setTabType("feedback");
    }, [salaryType]);

    return (
        <Paper
            sx={{width: "100%", flexGrow: 1, display: "flex", flexDirection: "column"}}>
            <Tabs value={tabType} onChange={(e, v) => setTabType(v)} variant="scrollable" scrollButtons="auto">
                <Tab sx={{display: salaryType === "statistic" ? "none" : "initial"}} label="Phản hồi" value="feedback"/>
                <Tab sx={{display: salaryType === "statistic" ? "none" : "initial"}} label="Lịch sử chỉnh sửa" value="history"/>
                <Tab label="Thông tin" value="info"/>
            </Tabs>
            <Box sx={{flexGrow: 1, display: "flex", p: 2}}>
                <Feedback show={tabType === "feedback"} salaryId={salary._id} dataId={currentSalary?._id} salaryType={salaryType} />
                <History show={tabType === "history"} salaryId={salary._id} currentSalary={currentSalary} salaryType={salaryType} />
                <Box sx={{display: tabType === "info" ? "block" : "none"}}>
                    <Typography variant="h5" sx={{fontWeight: "bold"}}>Thông tin</Typography>
                    <Typography variant="h6" sx={{fontWeight: "bold"}}>Chính</Typography>
                    <Typography>Tháng: {salary?.period?.month}/{salary?.period?.year}</Typography>
                    <Typography>Hệ số lương: {salary?.salaries?.main?.data?.coefficientMain?.value}</Typography>
                    <Typography>Lương cơ bản: {salary?.salaries?.main?.mainSalary?.toLocaleString()}đ</Typography>
                    <Typography>Lương thăng thêm / hệ số: {salary?.salaries?.main?.addSalary?.toLocaleString()}đ</Typography>
                    <Typography>Quản lý phí / hệ số: {salary?.salaries?.main?.feeSalary?.toLocaleString()}đ</Typography>
                </Box>
            </Box>
        </Paper>
    );
}

export default Tool;