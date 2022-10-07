import {Box, Button, Typography} from "@mui/material";
import {AttachFile, Download} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import {useContext, useEffect, useRef, useState} from "react";
import {read} from "xlsx";
import request from "../../utils/request";
import {detectRows} from "../../utils/datagrid";
import {excelDateToJSDate} from "../../utils/date";
import context from "../../utils/context";
import download from 'js-file-download';

const initColumns = [
    {field: 'id', headerName: 'ID', width: 50, hide: true},
    {
        field: 'username',
        headerName: 'Tên tài khoản',
        width: 100,
        editable: true,
    },
    {
        field: 'password',
        headerName: 'Mật khẩu',
        width: 100,
        editable: true,
    },
    {
        field: 'firstName',
        headerName: 'Họ',
        width: 100,
        editable: true,
    },
    {
        field: 'lastName',
        headerName: 'Tên',
        width: 100,
        editable: true,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 200,
        editable: true,
    },
    {
        field: 'gender',
        headerName: 'Giới tính',
        type: 'singleSelect',
        width: 70,
        valueOptions: [
            {value: "Nam", label: "Nam"},
            {value: "Nữ", label: "Nữ"},
        ],
        editable: true,
    },
    {
        field: 'dob',
        headerName: 'Ngày sinh',
        type: "date",
        width: 100,
        editable: true,
    },
    {
        field: 'address',
        headerName: 'Địa chỉ',
        width: 200,
        editable: true,
    },
    {
        field: 'department',
        headerName: 'Phòng ban',
        type: 'singleSelect',
        valueOptions: [],
        width: 150,
        editable: true,
    },
    {
        field: 'startedDate',
        headerName: 'Ngày bắt đầu làm việc',
        type: "date",
        width: 100,
        editable: true,
    },
    {
        field: 'coefficientSalary',
        headerName: 'Hệ số lương',
        type: "number",
        width: 100,
        editable: true,
    },
];

function Import(props) {
    const {isLoading, startLoading, stopLoading, error} = useContext(context);
    const importFileRef = useRef(null);
    const [step, setStep] = useState(0);
    const [workbook, setWorkbook] = useState(null);
    const [fileName, setFileName] = useState("");
    const [importedUsers, setImportedUsers] = useState([]);
    const [columns, setColumns] = useState(initColumns);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        getDepartments().then(data => {
            setDepartments(data);
            const valueOptions = data.map(department => ({label: department.name, value: department._id}));
            columns.forEach(column => column.field === "department" ? column.valueOptions = valueOptions : null);
            setColumns(columns);
        });
    }, []);

    const getDepartments = () => {
        return new Promise(((resolve, reject) => {
            request.get("/departments?all=1").then(res => {
                resolve(res.data);
            }).catch(err => reject());
        }));
    }

    const handleOpenFileDialog = () => {
        importFileRef.current.click();
    }

    const handleDownloadTemplate = () => {
        request.get("/users/downloadTemplate", {responseType: 'blob'}).then(res => download(res.data, "Mau-file-nhap-tai-khoan.xlsx"));
    }

    const handleImportFile = (e) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const loadedWorkbook = read(e.target.result, {type: "binary"});
            setWorkbook(loadedWorkbook);
        }
        setFileName(e.target.value.split("\\")[2]);

        reader.readAsBinaryString(e.target.files[0]);
    }

    const handleCellEditCommit = (params, e) => {
        let row = importedUsers.filter(row => row.id === params.id)[0];
        row[params.field] = params.value;
        setImportedUsers(importedUsers);
    }

    const handleReview = () => {
        if (workbook === null) {
            error("Chưa nhập file");
            return;
        }

        const rows = [];
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const detectedRows = detectRows(worksheet);

        for (let i = detectedRows.startRow; i <= detectedRows.endRow; i++) {
            if (detectedRows.dropRows.includes(i)) continue;

            rows.push({
                id: i - detectedRows.startRow,
                username: worksheet[`B${i}`]?.v,
                password: worksheet[`C${i}`]?.v,
                firstName: worksheet[`D${i}`]?.v,
                lastName: worksheet[`E${i}`]?.v,
                email: worksheet[`F${i}`]?.v,
                gender: worksheet[`G${i}`]?.v,
                dob: excelDateToJSDate(worksheet[`H${i}`]?.v),
                address: worksheet[`I${i}`]?.v,
                department: departments.filter(department => department.name === worksheet[`J${i}`]?.v)[0]?._id,
                startedDate: excelDateToJSDate(worksheet[`K${i}`]?.v),
                coefficientSalary: worksheet[`L${i}`]?.v,
            });
        }

        setImportedUsers(rows);
        setStep(1);
    }

    const handleImport = () => {
        const rows = importedUsers.map(user => {
            user = {...user};
            user.name = {};
            user.name.first = user.firstName;
            user.name.last = user.lastName;
            delete user.firstName;
            delete user.lastName;
            return user;
        });

        startLoading();
        request.post("/users/import", rows).then(res => {
            props.onImportUser(res.data);
            stopLoading();
        }).catch(err => {
            error("Có lỗi xảy ra");
            stopLoading();
        });
    }

    return (
        <>
            {step === 0 ?
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexGrow: 1, "& > :not(style)": {mb: 1}}}>
                    <Button variant="contained" color="secondary" startIcon={<Download/>} onClick={handleDownloadTemplate}>
                        Tải mẫu file
                    </Button>
                    <Button variant="contained" startIcon={<AttachFile/>} onClick={handleOpenFileDialog}>
                        Chọn file cần nhập
                    </Button>
                    <input ref={importFileRef} type="file" style={{display: "none"}} onChange={handleImportFile}
                           accept=".xls,.xlsx"/>
                    <Typography>{fileName}</Typography>
                </Box>
                : step === 1 ?
                    <Box sx={{flexGrow: 1}}>
                        <Box sx={{height: "100%", width: "100%"}}>
                            <DataGrid columns={columns} rows={importedUsers}
                                      onCellEditCommit={handleCellEditCommit}/>
                        </Box>
                    </Box>
                    : <></>
            }
            <Box sx={{display: "flex", justifyContent: "center", "& > :not(style)": {mb: 1, mx: 1}, mt: 1}}>
                <Button variant="outlined" onClick={() => setStep(Math.max(0, step - 1))}>
                    Trước
                </Button>
                {step === 0 ?
                    <Button
                        disabled={!fileName}
                        variant="contained"
                        color="error"
                        onClick={handleReview}
                    >
                        Xem trước
                    </Button>
                    : step === 1 ?
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleImport}
                        >
                            Nhập
                        </Button>
                        : <></>
                }
            </Box>
        </>
    );
}

export default Import;