import {Box, Grid, Paper, Tab, Tabs, Typography} from "@mui/material";
import {useState} from "react";
import Role from "./Role";
import Department from "./Department";

function Index() {
    const [optionType, setOptionType] = useState("info");

    return (
        <>
            <Grid container sx={{flexGrow: 1, height: "100%", overflowY: "auto"}}>
                <Grid item xs={12} sm={3} md={3} lg={2} xl={2} sx={{display: "flex"}}>
                    <Paper sx={{mr: 1, flexGrow: 1}}>
                        <Tabs variant="scrollable" orientation="vertical" value={optionType}
                              sx={{width: "100%", borderRight: 1, borderColor: 'divider'}}
                              onChange={(e, v) => {
                                  setOptionType(v);
                              }}>
                            <Tab value="info" label="Thông tin"/>
                            <Tab value="department" label="Quản lý các phòng ban"/>
                            <Tab value="role" label="Phân quyền người dùng"/>
                            <Tab value="salary" label="Cấu trúc lương"/>
                        </Tabs>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={7} xl={10} sx={{flexGrow: 1, height: "100%", overflowY: "auto"}}>
                    <Box sx={{"& > :not(style)": {mb: 1}}}>
                        {optionType === "info" ?
                            <Paper sx={{p: 2}}>
                                <Typography variant="h4">Thông tin phần mềm</Typography>
                                <Typography>Tên phần mềm: Website quản lý lương Cán bộ - Giảng viên tại Phân hiệu
                                    ĐHĐN Kon Tum</Typography>
                                <Typography>Phiên bản: dev_v1.0</Typography>
                                <Typography>Nhóm phát triển: Jenny Đỗ, Nguyễn Trúc Giang và Trần Ngọc
                                    Bôn.</Typography>
                            </Paper>
                            : optionType === "department" ?
                                <Department />
                                : optionType === "role" ?
                                    <Role/>
                                    : <></>
                        }
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}

export default Index;