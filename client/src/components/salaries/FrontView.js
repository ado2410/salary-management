import {
    Box,
    Button,
    Chip,
    Grid,
    Paper,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tooltip,
    Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import request from "../../utils/request";
import { useParams, useSearchParams } from "react-router-dom";
import Tool from "./Tool";
import { Help } from "@mui/icons-material";
import Dashboard from "./Dashboard";
import context from "../../utils/context";

function FrontView() {
    const { id } = useParams();
    const { isLoading, startLoading, stopLoading, error } = useContext(context);
    const [searchParams, setSearchParams] = useSearchParams();
    const [salary, setSalary] = useState({});
    const [salaryType, setSalaryType] = useState("statistic");
    const [salaryIndex, setSalaryIndex] = useState(0);
    const [currentSalary, setCurrentSalary] = useState({});

    useEffect(() => {
        getSalary().then((data) => setSalary(data));
    }, []);

    useEffect(() => {
        setSalaryType(searchParams.get("type") || "statistic");
        setSalaryIndex(searchParams.get("index") || 0);
    }, [searchParams]);

    useEffect(() => {
        setCurrentSalary(getCurrentSalary());
    }, [salary, salaryType, salaryIndex]);

    const getSalary = () => {
        return new Promise((resolve, reject) => {
            startLoading();
            request
                .get(`/salaries/${id}`)
                .then((res) => {
                    stopLoading();
                    resolve(res.data);
                })
                .catch((err) => {
                    stopLoading();
                    error("Tải dữ liệu lương bị lỗi");
                    reject(err);
                });
        });
    };

    const getCurrentSalary = () => {
        let tempSalary = null;
        let thisSalaryType = salaryType;
        if (["add", "fee"].includes(salaryType)) thisSalaryType = "main";
        switch (thisSalaryType) {
            case "main":
                tempSalary = salary?.salaries?.main.data
                    ? salary?.salaries?.main
                    : null;

                if (tempSalary) {
                    [
                        "mainSum",
                        "teachReward",
                        "insuranceHealth",
                        "insuranceSocial",
                        "insuranceUnemployment",
                        "insuranceSum",
                        "mainRemain",
                        "addSum",
                        "addSum80",
                        "addSum40",
                        "addRemain20",
                        "addRemain",
                        "addSubDayOff",
                        "feeSum",
                        "feeAddSum",
                        "specialJob",
                        "feeSubDayOff",
                        "feeRemain",
                    ].map((column) => {
                        let formattedValue = tempSalary.data[column]?.value;
                        tempSalary.data[column].formattedValue = formattedValue
                            ? `${formattedValue.toLocaleString()}đ`
                            : "Không có";
                    });
                }
                break;
            case "teach":
                tempSalary = salary?.salaries?.teach.data
                    ? salary?.salaries?.teach
                    : null;
                if (tempSalary) {
                    ["sum"].map((column) => {
                        let formattedValue = tempSalary.data[column]?.value;
                        tempSalary.data[column].formattedValue = formattedValue
                            ? `${formattedValue.toLocaleString()}đ`
                            : "Không có";
                    });
                }
                break;
            case "guide":
                tempSalary = salary?.salaries?.guide.data
                    ? salary?.salaries?.guide
                    : null;
                if (tempSalary) {
                    ["price", "sum"].map((column) => {
                        tempSalary.data.forEach(data => {
                            let formattedValue = data[column]?.value;
                            data[column].formattedValue = formattedValue
                                ? `${formattedValue.toLocaleString()}đ`
                                : "Không có";
                        });
                    });
                }
                break;
            case "welfare":
                tempSalary = salary?.salaries?.welfare
                    ? salary?.salaries?.welfare.length > salaryIndex
                        ? salary?.salaries?.welfare[salaryIndex]
                        : null
                    : null;
                if (tempSalary) {
                    ["sum"].map((column) => {
                        let formattedValue = tempSalary.data[column]?.value;
                        tempSalary.data[column].formattedValue = formattedValue
                            ? `${formattedValue.toLocaleString()}đ`
                            : "Không có";
                    });
                }
                break;
            case "other":
                tempSalary = salary?.salaries?.other
                    ? salary?.salaries?.other.length > salaryIndex
                        ? salary?.salaries?.other[salaryIndex]
                        : null
                    : null;
                if (tempSalary) {
                    ["sum"].map((column) => {
                        let formattedValue = tempSalary.data[column]?.value;
                        tempSalary.data[column].formattedValue = formattedValue
                            ? `${formattedValue.toLocaleString()}đ`
                            : "Không có";
                    });
                }
                break;
            default:
                tempSalary = null;
                break;
        }
        return tempSalary;
    };

    const renderSalary = (struct) => {
        return (
            <>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={struct.columns.length}>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: "bold" }}
                                        align="center"
                                    >
                                        {struct.title}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableHead>
                            <TableRow>
                                {struct.columns.map((column, index) => (
                                    <TableCell key={index}>
                                        <Typography
                                            sx={{ textAlign: "center" }}
                                        >
                                            {column}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {struct.values.map(values => (
                                <TableRow>
                                    {values.map((value, index) => (
                                        <TableCell key={index}>
                                            {value?.comments?.length > 0 ? (
                                                <Tooltip
                                                    key={index}
                                                    title={value?.comments?.map(
                                                        (comment) => (
                                                            <Typography>
                                                                {comment}
                                                            </Typography>
                                                        )
                                                    )}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontWeight: "bold",
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {value?.formattedValue
                                                            ? value.formattedValue
                                                            : value?.value}
                                                        <Help fontSize="10px" />
                                                    </Typography>
                                                </Tooltip>
                                            ) : (
                                                <Typography
                                                    sx={{
                                                        fontWeight: "bold",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {value?.formattedValue
                                                        ? value.formattedValue
                                                        : value?.value}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    };

    return (
        <>
            <Grid
                container
                sx={{ flexGrow: 1, height: "100%", overflowY: "auto" }}
            >
                <Grid
                    item
                    xs={12}
                    sm={3}
                    md={3}
                    lg={2}
                    xl={1}
                    sx={{ display: "flex", pl: 1 }}
                >
                    <Paper sx={{ mr: 1, flexGrow: 1 }}>
                        <Tabs
                            variant="scrollable"
                            orientation="vertical"
                            value={salaryType}
                            sx={{
                                width: "100%",
                                borderRight: 1,
                                borderColor: "divider",
                            }}
                            onChange={(e, v) => {
                                setSalaryType(v);
                                setSalaryIndex(0);
                            }}
                        >
                            <Tab value="statistic" label="Tổng quan" />
                            <Tab value="main" label="Lương chính" />
                            <Tab value="add" label="Lương tăng thêm" />
                            <Tab value="fee" label="Quản lý phí" />
                            <Tab value="teach" label="Giảng dạy" />
                            <Tab value="guide" label="Đồ án" />
                            <Tab value="welfare" label="Phúc lợi" />
                            <Tab value="other" label="Khác" />
                        </Tabs>
                    </Paper>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={7}
                    xl={9}
                    sx={{
                        flexGrow: 1,
                        height: "100%",
                        overflowY: "auto",
                        pr: 1,
                    }}
                >
                    <Box sx={{ "& > :not(style)": { mb: 1 } }}>
                        {salaryType === "statistic" ? (
                            <Dashboard salary={salary} />
                        ) : salaryType === "main" ? (
                            [
                                renderSalary({
                                    title: "Lương hệ số",
                                    columns: [
                                        "Hệ số lương",
                                        "Phụ cấp khu vực",
                                        "Phụ cấp chức vụ",
                                        "Phụ cấp thâm niên vượt khung",
                                        "Phụ cấp thâm thâm niên theo công việc",
                                        "Phụ cấp thâm thâm niên nhà giáo",
                                        "Cộng hệ số",
                                    ],
                                    values: [[
                                        currentSalary?.data?.coefficientMain,
                                        currentSalary?.data?.coefficientArea,
                                        currentSalary?.data
                                            ?.coefficientPosition,
                                        currentSalary?.data
                                            ?.coefficientOverYear,
                                        currentSalary?.data?.coefficientJob,
                                        currentSalary?.data?.coefficientTeach,
                                        currentSalary?.data?.mainCoefficientSum,
                                    ]],
                                }),
                                renderSalary({
                                    title: "Tổng cộng",
                                    columns: [
                                        "Tổng cộng tiền lương được hưởng",
                                        "Ưu đãi đứng lớp",
                                        "Tổng cộng",
                                    ],
                                    values: [[
                                        salary?.salaries?.main?.data?.mainSum,
                                        salary?.salaries?.main?.data
                                            ?.teachReward,
                                        {
                                            formattedValue: `${(
                                                parseInt(
                                                    salary?.salaries?.main?.data
                                                        ?.mainSum?.value
                                                ) +
                                                parseInt(
                                                    salary?.salaries?.main?.data
                                                        ?.teachReward?.value
                                                )
                                            ).toLocaleString()}đ`,
                                        },
                                    ]],
                                }),
                                renderSalary({
                                    title: "Trừ các khoản",
                                    columns: [
                                        "Bảo hiểm y tế",
                                        "Bảo hiểm xã hội",
                                        "Bảo hiểm thất nghiệp",
                                        "Tổng trừ",
                                    ],
                                    values: [[
                                        salary?.salaries?.main?.data
                                            ?.insuranceHealth,
                                        salary?.salaries?.main?.data
                                            ?.insuranceSocial,
                                        salary?.salaries?.main?.data
                                            ?.insuranceUnemployment,
                                        salary?.salaries?.main?.data
                                            ?.insuranceSum,
                                    ]],
                                }),
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center">
                                        Thực nhận
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        sx={{ fontWeight: "bold" }}
                                        align="center"
                                    >
                                        {
                                            salary.salaries?.main?.data
                                                ?.mainRemain?.formattedValue
                                        }
                                    </Typography>
                                </Paper>,
                            ]
                        ) : salaryType === "add" ? (
                            [
                                renderSalary({
                                    title: "Lương hệ số",
                                    columns: [
                                        "Hệ số lương",
                                        "Phụ cấp thâm niên vượt khung",
                                        "Phụ cấp khu vực",
                                        "Phụ cấp chức vụ",
                                        "Cộng hệ số",
                                    ],
                                    values: [[
                                        salary?.salaries?.main?.data
                                            ?.coefficientMain,
                                        salary?.salaries?.main?.data
                                            ?.coefficientOverYear,
                                        salary?.salaries?.main?.data
                                            ?.coefficientArea,
                                        salary?.salaries?.main?.data
                                            ?.coefficientPosition,
                                        salary?.salaries?.main?.data
                                            ?.addCoefficientSum,
                                    ]],
                                }),
                                renderSalary({
                                    title: "Thành tiền",
                                    columns: [
                                        "Thành tiền",
                                        "80% tiền lương được nhận",
                                        "40% tiền lương được nhận",
                                        "20% còn lại",
                                        "Trừ ngày nghỉ",
                                    ],
                                    values: [[
                                        salary?.salaries?.main?.data?.addSum,
                                        salary?.salaries?.main?.data?.addSum80,
                                        salary?.salaries?.main?.data?.addSum40,
                                        salary?.salaries?.main?.data
                                            ?.addRemain20,
                                        salary?.salaries?.main?.data
                                            ?.addSubDayOff,
                                    ]],
                                }),
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center">
                                        Thực nhận
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        {
                                            salary.salaries.main?.data
                                                ?.addRemain?.formattedValue
                                        }
                                    </Typography>
                                </Paper>,
                            ]
                        ) : salaryType === "fee" ? (
                            [
                                renderSalary({
                                    title: "Hệ số",
                                    columns: [
                                        "Hệ số Chức vụ chính quyền",
                                        "Hệ số Chức vụ Đảng/ Đoàn thể",
                                        "Cộng hệ số được hưởng",
                                    ],
                                    values: [[
                                        salary?.salaries?.main?.data
                                            ?.coefficientGovernment,
                                        salary?.salaries?.main?.data
                                            ?.coefficientParty,
                                        salary?.salaries?.main?.data
                                            ?.feeCoefficientSum,
                                    ]],
                                }),
                                renderSalary({
                                    title: "Thành tiền",
                                    columns: [
                                        "Thành tiền",
                                        "Phụ cấp công việc đặc thù",
                                        "Cộng tiền",
                                        "Trừ ngày nghỉ",
                                    ],
                                    values: [[
                                        salary?.salaries?.main?.data?.feeSum,
                                        salary?.salaries?.main?.data
                                            ?.specialJob,
                                        salary?.salaries?.main?.data?.feeAddSum,
                                        salary?.salaries?.main?.data
                                            ?.feeSubDayOff,
                                    ]],
                                }),
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" align="center">
                                        Thực nhận
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        {
                                            salary.salaries.main?.data
                                                ?.feeRemain?.formattedValue
                                        }
                                    </Typography>
                                </Paper>,
                            ]
                        ) : salaryType === "teach" ? (
                            salary?.salaries?.teach?.data ? (
                                [
                                    renderSalary({
                                        title: "Giảng dạy",
                                        columns: [
                                            "Số tiết đăng ký giảng dạy",
                                            "Tổng số tiết quy đổi",
                                            "Giờ coi thi",
                                            "Trừ tiết chuẩn giảng dạy",
                                            "Trừ tiết chuẩn NCKH",
                                            "Tổng tiết chuẩn",
                                            "Tổng số tiết sau khi trừ giờ chuẩn",
                                        ],
                                        values: [[
                                            salary?.salaries?.teach?.data
                                                ?.lessons,
                                            salary?.salaries?.teach?.data
                                                ?.exchangedLessons,
                                            salary?.salaries?.teach?.data
                                                ?.superviseExam,
                                            salary?.salaries?.teach?.data
                                                ?.subTeach,
                                            salary?.salaries?.teach?.data
                                                ?.subResearch,
                                            salary?.salaries?.teach?.data
                                                ?.subSum,
                                            salary?.salaries?.teach?.data
                                                ?.lessonSum,
                                        ]],
                                    }),
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h6" align="center">
                                            Thành tiền
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            align="center"
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            {
                                                salary?.salaries?.teach?.data
                                                    ?.sum?.formattedValue
                                            }
                                        </Typography>
                                    </Paper>,
                                ]
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Chip
                                        sx={{ my: 2 }}
                                        label="Chưa có dữ liệu"
                                    />
                                </Box>
                            )
                        ) : salaryType === "guide" ? (
                            salary?.salaries?.guide?.data ? (
                                [
                                    renderSalary({
                                        title: "Hướng dẫn đồ án, phản biện, hội đồng chấm đồ án",
                                        type: "multiple",
                                        columns: [
                                            "Nhiệm vụ",
                                            "Số sinh viên",
                                            "Số tiết/SV",
                                            "Đơn giá/tiết",
                                            "Thành tiền",
                                        ],
                                        values: salary?.salaries?.guide.data.map(guide => ([
                                            guide.mission,
                                            guide.studentCount,
                                            guide.lessonCount,
                                            guide.price,
                                            guide.sum,
                                        ])),
                                    }),
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h6" align="center">
                                            Thành tiền
                                        </Typography>
                                        <Typography
                                            variant="h4"
                                            align="center"
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            {salary?.salaries?.guide?.data.reduce((prev, data) => prev + data['sum'].value, 0).toLocaleString() + 'đ'}
                                        </Typography>
                                    </Paper>,
                                ]
                            ) : (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Chip
                                        sx={{ my: 2 }}
                                        label="Chưa có dữ liệu"
                                    />
                                </Box>
                            )
                        ) : salaryType === "welfare" ? (
                            [
                                salary?.salaries?.welfare?.map(
                                    (welfare, index) => (
                                        <Paper
                                            onClick={() =>
                                                setSalaryIndex(index)
                                            }
                                        >
                                            <Button
                                                sx={{
                                                    p: 2,
                                                    display: "block",
                                                    width: "100%",
                                                    textAlign: "left",
                                                    textTransform: "none",
                                                    color: "black",
                                                }}
                                                variant={
                                                    salaryIndex === index
                                                        ? "outlined"
                                                        : "text"
                                                }
                                            >
                                                <Typography
                                                    variant="h6"
                                                    align="center"
                                                >
                                                    {welfare.name}
                                                </Typography>
                                                <Typography
                                                    align="center"
                                                    sx={{ fontWeight: "bold" }}
                                                    variant="h4"
                                                >{`${welfare?.data?.sum?.value.toLocaleString()}đ`}</Typography>
                                            </Button>
                                        </Paper>
                                    )
                                ),
                                !salary?.salaries?.welfare ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Chip
                                            sx={{ my: 2 }}
                                            label="Chưa có dữ liệu"
                                        />
                                    </Box>
                                ) : (
                                    <></>
                                ),
                            ]
                        ) : salaryType === "other" ? (
                            [
                                salary?.salaries?.other?.map((other, index) => (
                                    <Paper
                                        onClick={() => setSalaryIndex(index)}
                                    >
                                        <Button
                                            sx={{
                                                p: 2,
                                                display: "block",
                                                width: "100%",
                                                textAlign: "left",
                                                textTransform: "none",
                                                color: "black",
                                            }}
                                            variant={
                                                salaryIndex === index
                                                    ? "outlined"
                                                    : "text"
                                            }
                                        >
                                            <Typography
                                                variant="h6"
                                                align="center"
                                            >
                                                {other.name}
                                            </Typography>
                                            <Typography
                                                align="center"
                                                sx={{ fontWeight: "bold" }}
                                                variant="h4"
                                            >{`${other?.data?.sum?.value.toLocaleString()}đ`}</Typography>
                                        </Button>
                                    </Paper>
                                )),
                                !salary?.salaries?.other ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Chip
                                            sx={{ my: 2 }}
                                            label="Chưa có dữ liệu"
                                        />
                                    </Box>
                                ) : (
                                    <></>
                                ),
                            ]
                        ) : (
                            <></>
                        )}
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={3}
                    md={3}
                    lg={3}
                    xl={2}
                    sx={{ display: "flex", flexGrow: 1, pr: 1 }}
                >
                    <Tool
                        salary={salary}
                        currentSalary={getCurrentSalary()}
                        salaryType={salaryType}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default FrontView;
