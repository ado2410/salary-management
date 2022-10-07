import {Paper, Typography} from "@mui/material";

function Info() {
    return (
        <Paper sx={{p: 2}}>
            <Typography variant="h4" align="center" sx={{fontWeight: "bold"}}>Thông tin phần mềm</Typography>
            <Typography>Tên phần mềm: Website quản lý lương Cán bộ - Giảng viên tại Phân hiệu
                ĐHĐN Kon Tum</Typography>
            <Typography>Phiên bản: dev_v1.0</Typography>
            <Typography>Nhóm phát triển: Jenny Đỗ, Nguyễn Trúc Giang và Trần Ngọc
                Bôn.</Typography>
        </Paper>
    );
}

export default Info;