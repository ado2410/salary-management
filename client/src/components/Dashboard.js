import {Box, Grid, Paper} from "@mui/material";
import PostIndex from "./posts/Index";
import SalaryDashboard from "./salaries/Dashboard";
import SalaryIndex from "./salaries/Index";
import {useContext, useEffect, useState} from "react";
import request from "../utils/request";
import context from "../utils/context";

function Dashboard() {
    const {isLoading, startLoading, stopLoading, error, success} = useContext(context);
    const [salary, setSalary] = useState({});

    useEffect(() => {
        getSalary().then(data => setSalary(data));
    }, []);

    const getSalary = () => {
        startLoading();
        return new Promise((resolve, reject) => {
            request.get(`/salaries/newest`).then(res => {
                stopLoading();
                resolve(res.data);
            }).catch(err => {
                error("Có lỗi xảy ra");
                reject(err);
            });
        });
    }

    return (
        <Grid container spacing={1} sx={{flexGrow: 1, height: "100%", overflowY: "auto"}}>
            <Grid item xs={12} sm={12} md={6} lg={8} sx={{display: "flex", height: "100%", overflowY: "auto", flexGrow: 1}}>
                <Box sx={{mr: 1, flexGrow: 1}}>
                    <SalaryDashboard salary={salary} />
                    <Box sx={{mt: 2}}></Box>
                    <SalaryIndex />
                </Box>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} sx={{display: "flex", flexDirection: "column", height: "100%", overflowY: "auto", flexGrow: 1}}>
                    <PostIndex />
            </Grid>
        </Grid>
    );
}

export default Dashboard;