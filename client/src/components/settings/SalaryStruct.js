import {
    AppBar,
    Box, Button,
    Grid,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import request from "../../utils/request";
import context from "../../utils/context";

export const defaultStructs = {
    main: {
        sheetIndex: 0,
        salary: "L9",
        name: "B",
        code: "C",
        newLevel: "D",
        coefficientMain: "E",
        coefficientArea: "F",
        coefficientPosition: "G",
        coefficientOverYear: "H",
        coefficientJob: "I",
        coefficientTeach: "J",
        coefficientSum: "K",
        sum: "M",
        teachReward: "O",
        insuranceHealth: "P",
        insuranceSocial: "Q",
        insuranceUnemployment: "R",
        insuranceSum: "S",
        remain: "T",
    },
    add: {
        sheetIndex: 1,
        name: ["B", "C"],
        coefficientMain: "D",
        coefficientOverYear: "E",
        coefficientArea: "F",
        coefficientPosition: "G",
        coefficientSum: "H",
        sum: "I",
        sum80: "J",
        sum40: "K",
        remain20: "L",
        subDayOff: "M",
        remain: "N",
    },
    fee: {
        sheetIndex: 2,
        name: ["B", "C"],
        coefficientGovernment: "G",
        coefficientParty: "I",
        coefficientSum: "J",
        sum: "K",
        specialJob: "L",
        addSum: "M",
        subDayOff: "N",
        remain: "O",
    },
    teach: {
        tableName: "A3",
        name: "B",
        lessons: "C",
        exchangedLessons: "D",
        superviseExam: "E",
        subTeach: "H",
        subResearch: "I",
        subSum: "J",
        lessonSum: "K",
        sum: "L",
    },
    guide: {
        tableName: "A5",
        name: "B",
        mission: "C",
        studentCount: "D",
        lessonCount: "E",
        price: "F",
        sum: "G",
    },
    welfare: {
        tableName: "A5",
        name: ["B", "C"],
        sum: "E",
    },
    other: {
        tableName: "A5",
        name: ["B", "C"],
        sum: "E",
    }
};

function SalaryStruct() {
    const {isLoading, startLoading, stopLoading, success, error} = useContext(context);
    const [structs, setStructs] = useState(null);
    const [salaryType, setSalaryType] = useState("main");

    useEffect(() => {
        getSalaryStructs().then(data => setStructs(data)).catch(err => setStructs(defaultStructs));
    }, []);

    const getSalaryStructs = () => {
        return new Promise(((resolve, reject) => {
            startLoading();
            request.get("/salaries/getStructs").then(res => {
                stopLoading();
                resolve(res.data);
            }).catch(err => {
                stopLoading();
                error("Tải cấu trúc lương lỗi");
                reject(err);
            })
        }));
    }

    const handleChangeSalaryType = (type) => {
        setSalaryType(type);
    }

    const handleSaveSalaryStruct = (e) => {
        e.preventDefault();

        const newStructs = {
            main: {
                sheetIndex: e.target.mainSheetIndex.value,
                salary: e.target.mainSalary.value,
                name: e.target.mainName.value.split(","),
                code: e.target.code.value,
                newLevel: e.target.newLevel.value,
                coefficientMain: e.target.mainCoefficientMain.value,
                coefficientArea: e.target.mainCoefficientArea.value,
                coefficientPosition: e.target.mainCoefficientPosition.value,
                coefficientOverYear: e.target.mainCoefficientOverYear.value,
                coefficientJob: e.target.coefficientJob.value,
                coefficientTeach: e.target.coefficientTeach.value,
                coefficientSum: e.target.mainCoefficientSum.value,
                sum: e.target.mainSum.value,
                teachReward: e.target.teachReward.value,
                insuranceHealth: e.target.insuranceHealth.value,
                insuranceSocial: e.target.insuranceSocial.value,
                insuranceUnemployment: e.target.insuranceUnemployment.value,
                insuranceSum: e.target.insuranceSum.value,
                remain: e.target.mainRemain.value,
            },
            add: {
                sheetIndex: e.target.addSheetIndex.value,
                name: e.target.addName.value.split(","),
                coefficientMain: e.target.addCoefficientMain.value,
                coefficientOverYear: e.target.addCoefficientOverYear.value,
                coefficientArea: e.target.addCoefficientArea.value,
                coefficientPosition: e.target.addCoefficientPosition.value,
                coefficientSum: e.target.addCoefficientSum.value,
                sum: e.target.addSum.value,
                sum80: e.target.addSum80.value,
                sum40: e.target.addSum40.value,
                remain20: e.target.addRemain20.value,
                subDayOff: e.target.addSubDayOff.value,
                remain: e.target.addRemain.value,
            },
            fee: {
                sheetIndex: e.target.feeSheetIndex.value,
                name: e.target.feeName.value.split(","),
                coefficientGovernment: e.target.coefficientGovernment.value,
                coefficientParty: e.target.coefficientParty.value,
                coefficientSum: e.target.feeCoefficientSum.value,
                sum: e.target.feeSum.value,
                specialJob: e.target.specialJob.value,
                addSum: e.target.feeAddSum.value,
                subDayOff: e.target.feeSubDayOff.value,
                remain: e.target.feeRemain.value,
            },
            teach: {
                tableName: e.target.teachTableName.value,
                name: e.target.teachName.value.split(","),
                lessons: e.target.lessons.value,
                exchangedLessons: e.target.exchangedLessons.value,
                superviseExam: e.target.superviseExam.value,
                subTeach: e.target.subTeach.value,
                subResearch: e.target.subResearch.value,
                subSum: e.target.subSum.value,
                lessonSum: e.target.lessonSum.value,
                sum: e.target.teachSum.value,
            },
            guide: {
                tableName: e.target.guideTableName.value,
                name: e.target.guideName.value,
                mission: e.target.mission.value,
                studentCount: e.target.studentCount.value,
                lessonCount: e.target.lessonCount.value,
                price: e.target.price.value,
                sum: e.target.guideSum.value,
            },
            welfare: {
                tableName: e.target.welfareTableName.value,
                name: e.target.welfareName.value.split(","),
                sum: e.target.welfareSum.value,
            },
            other: {
                tableName: e.target.otherTableName.value,
                name: e.target.otherName.value.split(","),
                sum: e.target.otherSum.value,
            }
        }

        startLoading();
        request.post("/salaries/updateStructs", newStructs).then(data => {
            stopLoading();
            success("Cập nhật thành công");
        }).catch(err => {
            stopLoading();
            error("Cập nhật lỗi");
        })
    }

    return (
        <Paper
            sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                flexGrow: 1,
                overflowY: "auto",
            }}
            component="form"
            onSubmit={handleSaveSalaryStruct}
        >
            <AppBar position="static" sx={{mb: 2}}>
                <Tabs
                    value={salaryType}
                    onChange={(e, v) => handleChangeSalaryType(v)}
                    indicatorColor="secondary"
                    textColor="inherit"
                    centered
                >
                    {[
                        {label: "Lương chính", value: "main"},
                        {label: "Lương tăng thêm", value: "add"},
                        {label: "Quản lý phí", value: "fee"},
                        {label: "Lương giảng dạy", value: "teach"},
                        {label: "Đồ án", value: "guide"},
                        {label: "Phúc lợi", value: "welfare"},
                        {label: "Các khoản khác", value: "other"},
                    ].map((item, index) =>
                        <Tab key={index} label={item.label} value={item.value}/>
                    )}
                </Tabs>
            </AppBar>
            {structs ?
                <Grid container spacing={2} justifyContent="center" sx={{
                    flexGrow: 1,
                    height: 0,
                    overflowY: "auto",
                    border: 1,
                    borderRadius: 1,
                    borderColor: "grey.300",
                }}>
                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: salaryType === "main" ? "block" : "none", flexDirection: "column", "& > :not(style)": {my: 1}}}>
                        <Typography variant="h4" textAlign="center"><b>Lương chính</b></Typography>
                        <TextField size="small" fullWidth name="mainSheetIndex" label="Thứ tự sheet"
                                   defaultValue={structs.main.sheetIndex}/>
                        <TextField size="small" fullWidth name="mainSalary" label="Lương cơ bản"
                                   defaultValue={structs.main.salary}/>

                        <Typography textAlign="center"><b>Các cột</b></Typography>
                        <TextField size="small" fullWidth name="mainName" label="Tên"
                                   defaultValue={structs.main.name}/>
                        <TextField size="small" fullWidth name="code" label="Mã số ngạch lương"
                                   defaultValue={structs.main.code}/>
                        <TextField size="small" fullWidth name="newLevel" label="Bậc mới"
                                   defaultValue={structs.main.newLevel}/>
                        <TextField size="small" fullWidth name="mainCoefficientMain" label="Hệ số lương"
                                   defaultValue={structs.main.coefficientMain}/>
                        <TextField size="small" fullWidth name="mainCoefficientArea" label="Phụ cấp khu vực"
                                   defaultValue={structs.main.coefficientArea}/>
                        <TextField size="small" fullWidth name="mainCoefficientPosition" label="Phụ cấp chức vụ"
                                   defaultValue={structs.main.coefficientPosition}/>
                        <TextField size="small" fullWidth name="mainCoefficientOverYear"
                                   label="Phụ cấp thâm niên VK"
                                   defaultValue={structs.main.coefficientOverYear}/>
                        <TextField size="small" fullWidth name="coefficientJob" label="Phụ cấp TN theo cv"
                                   defaultValue={structs.main.coefficientJob}/>
                        <TextField size="small" fullWidth name="coefficientTeach"
                                   label="PC thâm niên nhà giáo"
                                   defaultValue={structs.main.coefficientTeach}/>
                        <TextField size="small" fullWidth name="mainCoefficientSum" label="Cộng hệ số"
                                   defaultValue={structs.main.coefficientSum}/>
                        <TextField size="small" fullWidth name="mainSum"
                                   label="Tổng cộng tiền lương được hưởng"
                                   defaultValue={structs.main.sum}/>
                        <TextField size="small" fullWidth name="teachReward" label="Ưu đãi đứng lớp"
                                   defaultValue={structs.main.teachReward}/>
                        <TextField size="small" fullWidth name="insuranceHealth" label="BHYT"
                                   defaultValue={structs.main.insuranceHealth}/>
                        <TextField size="small" fullWidth name="insuranceSocial" label="BHXH"
                                   defaultValue={structs.main.insuranceSocial}/>
                        <TextField size="small" fullWidth name="insuranceUnemployment" label="BHTN"
                                   defaultValue={structs.main.insuranceUnemployment}/>
                        <TextField size="small" fullWidth name="insuranceSum" label="Tổng trừ"
                                   defaultValue={structs.main.insuranceSum}/>
                        <TextField size="small" fullWidth name="mainRemain" label="Còn nhận"
                                   defaultValue={structs.main.remain}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: salaryType === "add" ? "initial" : "none", "& > :not(style)": {my: 1}}}>
                        <Typography variant="h4" textAlign="center"><b>Lương tăng thêm</b></Typography>
                        <TextField size="small" fullWidth name="addSheetIndex" label="Thứ tự sheet"
                                   defaultValue={structs.add.sheetIndex}/>
                        <TextField size="small" fullWidth name="addSalary" label="Mức chi trả/1 hệ số"
                                   defaultValue={structs.add.salary}/>

                        <Typography textAlign="center"><b>Các cột</b></Typography>
                        <TextField size="small" fullWidth name="addName" label="Tên"
                                   defaultValue={structs.add.name.toString()}/>
                        <TextField size="small" fullWidth name="addCoefficientMain" label="Hệ số lương"
                                   defaultValue={structs.add.coefficientMain}/>
                        <TextField size="small" fullWidth name="addCoefficientOverYear"
                                   label="Phụ cấp thâm niên VK"
                                   defaultValue={structs.add.coefficientOverYear}/>
                        <TextField size="small" fullWidth name="addCoefficientArea" label="Phụ cấp khu vực"
                                   defaultValue={structs.add.coefficientArea}/>
                        <TextField size="small" fullWidth name="addCoefficientPosition" label="Phụ cấp chức vụ"
                                   defaultValue={structs.add.coefficientPosition}/>
                        <TextField size="small" fullWidth name="addCoefficientSum" label="Cộng hệ số"
                                   defaultValue={structs.add.coefficientSum}/>
                        <TextField size="small" fullWidth name="addSum" label="Thành tiền"
                                   defaultValue={structs.add.sum}/>
                        <TextField size="small" fullWidth name="addSum80" label="80% tiền lương được nhận"
                                   defaultValue={structs.add.sum80}/>
                        <TextField size="small" fullWidth name="addSum40" label="40% tiền lương được nhận"
                                   defaultValue={structs.add.sum40}/>
                        <TextField size="small" fullWidth name="addRemain20" label="20% còn lại"
                                   defaultValue={structs.add.remain20}/>
                        <TextField size="small" fullWidth name="addSubDayOff" label="Trừ ngày nghỉ"
                                   defaultValue={structs.add.subDayOff}/>
                        <TextField size="small" fullWidth name="addRemain" label="Thực nhận"
                                   defaultValue={structs.add.remain}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: salaryType === "fee" ? "initial" : "none", "& > :not(style)": {my: 1}}}>
                        <Typography variant="h4" textAlign="center"><b>Quản lý phí</b></Typography>
                        <TextField size="small" fullWidth name="feeSheetIndex" label="Thứ tự sheet"
                                   defaultValue={structs.fee.sheetIndex}/>
                        <TextField size="small" fullWidth name="feeSalary" label="Mức chi trả/1 hệ số"
                                   defaultValue={structs.fee.salary}/>

                        <Typography textAlign="center"><b>Các cột</b></Typography>
                        <TextField size="small" fullWidth name="feeName" label="Tên"
                                   defaultValue={structs.fee.name.toString()}/>
                        <TextField size="small" fullWidth name="coefficientGovernment"
                                   label="Hệ số Chức vụ chính quyền"
                                   defaultValue={structs.fee.coefficientGovernment}/>
                        <TextField size="small" fullWidth name="coefficientParty"
                                   label="Hệ số Chức vụ Đảng/ Đoàn thể"
                                   defaultValue={structs.fee.coefficientParty}/>
                        <TextField size="small" fullWidth name="feeCoefficientSum"
                                   label="Cộng hệ số được hưởng"
                                   defaultValue={structs.fee.coefficientSum}/>
                        <TextField size="small" fullWidth name="feeSum" label="Thành tiền"
                                   defaultValue={structs.fee.sum}/>
                        <TextField size="small" fullWidth name="specialJob"
                                   label="Phụ cấp công việc đặc thù"
                                   defaultValue={structs.fee.specialJob}/>
                        <TextField size="small" fullWidth name="feeAddSum" label="Cộng tiền"
                                   defaultValue={structs.fee.addSum}/>
                        <TextField size="small" fullWidth name="feeSubDayOff" label="Trừ ngày nghỉ"
                                   defaultValue={structs.fee.subDayOff}/>
                        <TextField size="small" fullWidth name="feeRemain" label="Thực nhận"
                                   defaultValue={structs.fee.remain}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: salaryType === "guide" ? "initial" : "none", "& > :not(style)": {my: 1}}}>
                        <Typography variant="h4" textAlign="center"><b>Đồ án</b></Typography>
                        <TextField size="small" fullWidth name="guideTableName" label="Tên lương"
                                   defaultValue={structs.guide.tableName}/>

                        <Typography textAlign="center"><b>Các cột</b></Typography>
                        <TextField size="small" fullWidth name="guideName" label="Tên"
                                   defaultValue={structs.guide.name.toString()}/>
                        <TextField size="small" fullWidth name="mission" label="Nhiệm vụ"
                                   defaultValue={structs.guide.mission}/>
                        <TextField size="small" fullWidth name="studentCount"
                                   label="Số sinh viên"
                                   defaultValue={structs.guide.studentCount}/>
                        <TextField size="small" fullWidth name="lessonCount" label="Số tiết/sv"
                                   defaultValue={structs.guide.lessonCount}/>
                        <TextField size="small" fullWidth name="price" label="Đơn giá"
                                   defaultValue={structs.guide.price}/>
                        <TextField size="small" fullWidth name="guideSum" label="Thành tiền"
                                   defaultValue={structs.guide.sum}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: salaryType === "teach" ? "initial" : "none", "& > :not(style)": {my: 1}}}>
                        <Typography variant="h4" textAlign="center"><b>Tiền lương giảng dạy</b></Typography>
                        <TextField size="small" fullWidth name="teachTableName" label="Tên lương giảng dạy"
                                   defaultValue={structs.teach.tableName}/>

                        <Typography textAlign="center"><b>Các cột</b></Typography>
                        <TextField size="small" fullWidth name="teachName" label="Tên"
                                   defaultValue={structs.teach.name.toString()}/>
                        <TextField size="small" fullWidth name="lessons" label="Số tiết đăng ký giảng dạy"
                                   defaultValue={structs.teach.lessons}/>
                        <TextField size="small" fullWidth name="exchangedLessons"
                                   label="Tổng số giờ quy đổi"
                                   defaultValue={structs.teach.exchangedLessons}/>
                        <TextField size="small" fullWidth name="superviseExam" label="Giờ coi thi"
                                   defaultValue={structs.teach.superviseExam}/>
                        <TextField size="small" fullWidth name="subTeach" label="Trừ tiết chuẩn giảng dạy"
                                   defaultValue={structs.teach.subTeach}/>
                        <TextField size="small" fullWidth name="subResearch" label="Trừ tiết chuẩn NCKH"
                                   defaultValue={structs.teach.subResearch}/>
                        <TextField size="small" fullWidth name="subSum" label="Tổng tiết chuẩn"
                                   defaultValue={structs.teach.subSum}/>
                        <TextField size="small" fullWidth name="lessonSum"
                                   label="Tổng số tiết sau khi trừ giờ chuẩn"
                                   defaultValue={structs.teach.lessonSum}/>
                        <TextField size="small" fullWidth name="teachSum" label="Thành tiền"
                                   defaultValue={structs.teach.sum}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: salaryType === "welfare" ? "initial" : "none", "& > :not(style)": {my: 1}}}>
                        <Typography variant="h4" textAlign="center"><b>Phúc lợi</b></Typography>

                        <TextField size="small" fullWidth name="welfareTableName" label="Tên phúc lợi"
                                   defaultValue={structs.welfare.tableName}/>

                        <Typography textAlign="center"><b>Các cột</b></Typography>
                        <TextField size="small" fullWidth name="welfareName" label="Tên"
                                   defaultValue={structs.welfare.name.toString()}/>
                        <TextField size="small" fullWidth name="welfareSum" label="Số tiền"
                                   defaultValue={structs.welfare.sum}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{display: salaryType === "other" ? "initial" : "none", "& > :not(style)": {my: 1}}}>
                        <Typography variant="h4" textAlign="center"><b>Khoản khác</b></Typography>

                        <TextField size="small" fullWidth name="otherTableName" label="Tên khoản lương"
                                   defaultValue={structs.other.tableName}/>

                        <Typography>Các cột</Typography>
                        <TextField size="small" fullWidth name="otherName" label="Tên"
                                   defaultValue={structs.other.name.toString()}/>
                        <TextField size="small" fullWidth name="otherSum" label="Số tiền"
                                   defaultValue={structs.other.sum}/>
                    </Grid>
                </Grid>
                    : <></>
                }
            <Box sx={{display: "flex", justifyContent: "center", my: 1}}>
                <Button type="submit" variant="contained">Cập nhật thay đổi</Button>
            </Box>
        </Paper>
    );
}

export default SalaryStruct;