import {
    ArrowBackIos,
    AttachFile,
    CheckCircle,
    Done,
    FileCopy,
    Preview,
    Send,
    SettingsSuggest
} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem, Paper,
    Select,
    Step,
    StepLabel,
    Stepper, Tab, Tabs,
    TextField,
    Typography
} from "@mui/material";
import {useContext, useEffect, useRef, useState} from "react";
import {read} from "xlsx";
import context from "../../utils/context";
import request from "../../utils/request";
import {LoadingButton} from "@mui/lab";
import {
    columns as initColumns, detectRows,
    getReviewData,
    selectColumns,
    updateData
} from "../../utils/datagrid";
import salaryStruct, {defaultStructs} from "../settings/SalaryStruct";

const months = [
    {name: 1, label: "Tháng 1"},
    {name: 2, label: "Tháng 2"},
    {name: 3, label: "Tháng 3"},
    {name: 4, label: "Tháng 4"},
    {name: 5, label: "Tháng 5"},
    {name: 6, label: "Tháng 6"},
    {name: 7, label: "Tháng 7"},
    {name: 8, label: "Tháng 8"},
    {name: 9, label: "Tháng 9"},
    {name: 10, label: "Tháng 10"},
    {name: 11, label: "Tháng 11"},
    {name: 12, label: "Tháng 12"},
];

const years = [];
for (let i = 2000; i <= 2050; i++) years.push(i);
let salaries = {main: 0, add: 0, fee: 0};

function Import() {
    const {error, success, isLoading, startLoading, stopLoading} = useContext(context);
    const importFileRef = useRef(null);
    const [step, setStep] = useState(0);
    const [salaryStructs, setSalaryStructs] = useState(null);

    //Step 0: Import file
    const [salaryType, setSalaryType] = useState('main');
    const [period, setPeriod] = useState({month: new Date().getMonth() + 1, year: new Date().getFullYear()});

    //Step 1: Config structs
    const [fileName, setFileName] = useState("");
    const [workbook, setWorkbook] = useState(null);
    const [show, setShow] = useState(true);
    const [users, setUsers] = useState([]);

    //Step 2: Review salaries
    const [columns, setColumns] = useState([]);
    const [datasetIndex, setDatasetIndex] = useState(0);
    const [dataset, setDataset] = useState([]);
    const [reviewData, setReviewData] = useState([]);
    const [initStructs, setInitStructs] = useState({
        main: null,
        add: null,
        fee: null,
        teach: null,
        guide: null,
        welfare: null,
        other: null
    });
    const [modifiedStructs, setModifiedStructs] = useState({
        main: null,
        add: null,
        fee: null,
        teach: null,
        guide: null,
        welfare: null,
        other: null
    });
    const [savedSalary, setSavedSalary] = useState({});
    const [sent, setSent] = useState(false);
    const [dialogType, setDialogType] = useState(null);

    // Select init columns
    useEffect(() => {
        selectCurrentColumns(salaryType);
        getSalaryStructs().then(data => setSalaryStructs(data)).catch(err => setSalaryStructs(defaultStructs));
    }, []);

    // Update new review data when dataset or datasetIndex changed
    useEffect(() => {
        setReviewData(getReviewData(dataset[datasetIndex]));
    }, [dataset, datasetIndex]);

    // Set show equal true after changed init structs
    useEffect(() => {
        setShow(true);
    }, [initStructs])

    // Handle previous step
    const handlePrevious = () => {
        setStep(state => Math.max(0, state - 1));
    }

    //Handle open file dialog
    const handleOpenFileDialog = () => {
        importFileRef.current.click();
    }

    // Select current columns
    const selectCurrentColumns = (type) => {
        selectColumns(type, ["storedUsername", "storedName"]).then(data => {
            setColumns(data.columns);
            setUsers(data.users);
        });
    }

    // Handle change salary type
    const handleChangeSalaryType = (v) => {
        setSalaryType(v);
        selectCurrentColumns(v);
    }

    // Handle import file
    const handleImportFile = (e) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const loadedWorkbook = read(e.target.result, {type: "binary"});
            setWorkbook(loadedWorkbook);
        }
        setFileName(e.target.value.split("\\")[2]);

        reader.readAsBinaryString(e.target.files[0]);
    }

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

    // Analyse structs
    const analyseStructs = (workbook) => {
        startLoading();
        let structs = {};

        switch (salaryType) {
            case "main":
                const mainWorksheet = workbook.Sheets[workbook.SheetNames[0]];
                const addWorksheet = workbook.Sheets[workbook.SheetNames[1]];
                const feeWorksheet = workbook.Sheets[workbook.SheetNames[2]];

                const detectedMainRows = detectRows(mainWorksheet);
                const detectedAddRows = detectRows(addWorksheet);
                const detectedFeeRows = detectRows(feeWorksheet);

                structs = {
                    main: {
                        ...salaryStructs.main,
                        startRow: detectedMainRows.startRow,
                        endRow: detectedMainRows.endRow,
                        dropRows: detectedMainRows.dropRows,
                    },
                    add: {
                        ...salaryStructs.add,
                        startRow: detectedAddRows.startRow,
                        endRow: detectedAddRows.endRow,
                        dropRows: detectedAddRows.dropRows,
                        salary: `C${detectedAddRows.endRow + 4}`,
                    },
                    fee: {
                        ...salaryStructs.fee,
                        startRow: detectedFeeRows.startRow,
                        endRow: detectedFeeRows.endRow,
                        dropRows: detectedFeeRows.dropRows,
                        salary: `F${detectedFeeRows.endRow + 4}`,
                    }
                }
                break;
            case "teach":
                const teachWorksheet = workbook.Sheets[workbook.SheetNames[0]];
                const detectedTeachRows = detectRows(teachWorksheet);

                structs = {
                    teach: {
                        ...salaryStructs.teach,
                        tableName: teachWorksheet[salaryStructs.teach.tableName]?.v,
                        startRow: detectedTeachRows.startRow,
                        endRow: detectedTeachRows.endRow,
                        dropRows: detectedTeachRows.dropRows,
                    }
                }
                break;
            case "guide":
                    const guideWorksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const detectedGuideRows = detectRows(guideWorksheet);
    
                    structs = {
                        guide: {
                            ...salaryStructs.guide,
                            tableName: guideWorksheet[salaryStructs.guide.tableName]?.v,
                            startRow: detectedGuideRows.startRow,
                            endRow: detectedGuideRows.endRow,
                            dropRows: detectedGuideRows.dropRows,
                        }
                    }
                    break;
            case "welfare":
                structs = {
                    welfare: [],
                }
                workbook.SheetNames.map(SheetName => {
                    const welfareWorksheet = workbook.Sheets[SheetName];
                    const detectedWelfareRows = detectRows(welfareWorksheet);

                    structs.welfare.push({
                        ...salaryStructs.welfare,
                        sheetName: SheetName,
                        tableName: welfareWorksheet[salaryStructs.welfare.tableName]?.v,
                        startRow: detectedWelfareRows.startRow,
                        endRow: detectedWelfareRows.endRow,
                        dropRows: detectedWelfareRows.dropRows,
                    });
                });
                break;
            case "other":
                structs = {
                    other: [],
                }
                workbook.SheetNames.map(SheetName => {
                    const otherWorksheet = workbook.Sheets[SheetName];
                    const detectedOtherRows = detectRows(otherWorksheet);

                    structs.other.push({
                        ...salaryStructs.other,
                        sheetName: SheetName,
                        tableName: otherWorksheet[salaryStructs.welfare.tableName]?.v,
                        startRow: detectedOtherRows.startRow,
                        endRow: detectedOtherRows.endRow,
                        dropRows: detectedOtherRows.dropRows,
                    });
                });
                break;
        }
        console.log(structs);
        return structs;
    }

    // Handle analyse structs
    const handleAnalyseStructs = () => {
        if (workbook === null) return error("Chưa nhập file lương");
        startLoading();
        request.get(`/salaries/canInsert?month=${period.month}&year=${period.year}&type=${salaryType}`).then(res => {
            if (res.data.status === false) error(`Lương tháng ${period.month}/${period.year} đã được nhập`);
            else {
                setStep(1);
                setInitStructs(analyseStructs(workbook));
            }
            stopLoading();
        }).catch(err => {
            error("Cõ lỗi xảy ra");
            stopLoading();
        });
    }

    // Handle change main sheet
    const handleChangeMainSheet = (e) => {
        setShow(false);
        setInitStructs(structs => {
            structs = {...structs};
            const detectedRows = detectRows(workbook.Sheets[workbook.SheetNames[e.target.value]]);
            structs.main.sheetIndex = e.target.value;
            structs.main.startRow = detectedRows.startRow;
            structs.main.endRow = detectedRows.endRow;
            structs.main.dropRows = detectedRows.dropRows;
            return structs;
        });
    }

    // Handle change add sheet
    const handleChangeAddSheet = (e) => {
        setShow(false);
        setInitStructs(structs => {
            structs = {...structs};
            const detectedRows = detectRows(workbook.Sheets[workbook.SheetNames[e.target.value]]);
            structs.add.sheetIndex = e.target.value;
            structs.add.startRow = detectedRows.startRow;
            structs.add.endRow = detectedRows.endRow;
            structs.add.dropRows = detectedRows.dropRows;
            return structs;
        });
    }

    // Handle change fee sheet
    const handleChangeFeeSheet = (e) => {
        setShow(false);
        setInitStructs(structs => {
            structs = {...structs};
            const detectedRows = detectRows(workbook.Sheets[workbook.SheetNames[e.target.value]]);
            structs.fee.sheetIndex = e.target.value;
            structs.fee.startRow = detectedRows.startRow;
            structs.fee.endRow = detectedRows.endRow;
            structs.fee.dropRows = detectedRows.dropRows;
            return structs;
        });
    }

    // Handle cell edit commit
    const handleCellEditCommit = (params, e) => {
        setDataset(state => {
            state[datasetIndex] = updateData(dataset[datasetIndex], params);
            return state;
        });
    }

    // handle review data
    const handleReview = (e) => {
        e.preventDefault();
        setStep(2);

        let modifiedStructArr = {};
        let modifiedStructs = {};
        let tempRows = [];

        switch (salaryType) {
            case "main":
                modifiedStructs = {
                    main: {
                        sheetIndex: e.target.mainSheetIndex.value,
                        startRow: e.target.mainStartRow.value,
                        endRow: e.target.mainEndRow.value,
                        dropRows: e.target.mainDropRows.value ? e.target.mainDropRows.value.split(",").map(row => parseInt(row)) : [],
                        salary: e.target.mainSalary.value,
                        name: e.target.mainName.value,
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
                        startRow: e.target.addStartRow.value,
                        endRow: e.target.addEndRow.value,
                        dropRows: e.target.addDropRows.value ? e.target.addDropRows.value.split(",").map(row => parseInt(row)) : [],
                        salary: e.target.addSalary.value,
                        name: e.target.addName.value ? e.target.addName.value.split(",") : [],
                        coefficientMain: e.target.addCoefficientMain.value,
                        coefficientArea: e.target.addCoefficientArea.value,
                        coefficientPosition: e.target.addCoefficientPosition.value,
                        coefficientOverYear: e.target.addCoefficientOverYear.value,
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
                        startRow: e.target.feeStartRow.value,
                        endRow: e.target.feeEndRow.value,
                        dropRows: e.target.feeDropRows.value ? e.target.feeDropRows.value.split(",").map(row => parseInt(row)) : [],
                        salary: e.target.feeSalary.value,
                        name: e.target.feeName.value ? e.target.feeName.value.split(",") : [],
                        coefficientGovernment: e.target.coefficientGovernment.value,
                        coefficientParty: e.target.coefficientParty.value,
                        coefficientSum: e.target.feeCoefficientSum.value,
                        sum: e.target.feeSum.value,
                        specialJob: e.target.specialJob.value,
                        addSum: e.target.feeAddSum.value,
                        subDayOff: e.target.feeSubDayOff.value,
                        remain: e.target.feeRemain.value,
                    }
                }

                const mainWorksheet = workbook.Sheets[workbook.SheetNames[modifiedStructs.main.sheetIndex]];
                const addWorksheet = workbook.Sheets[workbook.SheetNames[modifiedStructs.add.sheetIndex]];
                const feeWorksheet = workbook.Sheets[workbook.SheetNames[modifiedStructs.fee.sheetIndex]];

                salaries = {
                    main: mainWorksheet[modifiedStructs.main.salary]?.v,
                    add: addWorksheet[modifiedStructs.add.salary]?.v,
                    fee: feeWorksheet[modifiedStructs.fee.salary]?.v
                };

                for (let i = parseInt(modifiedStructs.main.startRow); i <= parseInt(modifiedStructs.main.endRow); i++) {
                    if (modifiedStructs.main.dropRows.includes(i)) continue;

                    tempRows.push({
                        id: i - modifiedStructs.main.startRow,
                        username: {
                            value: users.find(user => `${user.name.first} ${user.name.last}` === mainWorksheet[`${modifiedStructs.main.name}${i}`]?.v)?.username
                        },
                        name: {
                            value: mainWorksheet[`${modifiedStructs.main.name}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.name}${i}`]?.c?.map(c => c.t),
                        },
                        code: {
                            value: mainWorksheet[`${modifiedStructs.main.code}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.code}${i}`]?.c?.map(c => c.t),
                        },
                        newLevel: {
                            value: mainWorksheet[`${modifiedStructs.main.newLevel}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.newLevel}${i}`]?.c?.map(c => c.t),
                        },
                        coefficientMain: {
                            value: mainWorksheet[`${modifiedStructs.main.coefficientMain}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.coefficientMain}${i}`]?.c?.map(c => c.t),
                        },
                        coefficientArea: {
                            value: mainWorksheet[`${modifiedStructs.main.coefficientArea}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.coefficientArea}${i}`]?.c?.map(c => c.t),
                        },
                        coefficientPosition: {
                            value: mainWorksheet[`${modifiedStructs.main.coefficientPosition}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.coefficientPosition}${i}`]?.c?.map(c => c.t),
                        },
                        coefficientOverYear: {
                            value: mainWorksheet[`${modifiedStructs.main.coefficientOverYear}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.coefficientOverYear}${i}`]?.c?.map(c => c.t),
                        },
                        coefficientJob: {
                            value: mainWorksheet[`${modifiedStructs.main.coefficientJob}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.coefficientJob}${i}`]?.c?.map(c => c.t),
                        },
                        coefficientTeach: {
                            value: mainWorksheet[`${modifiedStructs.main.coefficientTeach}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.coefficientTeach}${i}`]?.c?.map(c => c.t),
                        },
                        mainCoefficientSum: {
                            value: mainWorksheet[`${modifiedStructs.main.coefficientSum}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.coefficientSum}${i}`]?.c?.map(c => c.t),
                        },
                        mainSum: {
                            value: mainWorksheet[`${modifiedStructs.main.sum}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.sum}${i}`]?.c?.map(c => c.t),
                        },
                        teachReward: {
                            value: mainWorksheet[`${modifiedStructs.main.teachReward}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.teachReward}${i}`]?.c?.map(c => c.t),
                        },
                        insuranceHealth: {
                            value: mainWorksheet[`${modifiedStructs.main.insuranceHealth}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.insuranceHealth}${i}`]?.c?.map(c => c.t),
                        },
                        insuranceSocial: {
                            value: mainWorksheet[`${modifiedStructs.main.insuranceSocial}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.insuranceSocial}${i}`]?.c?.map(c => c.t),
                        },
                        insuranceUnemployment: {
                            value: mainWorksheet[`${modifiedStructs.main.insuranceUnemployment}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.insuranceUnemployment}${i}`]?.c?.map(c => c.t),
                        },
                        insuranceSum: {
                            value: mainWorksheet[`${modifiedStructs.main.insuranceSum}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.insuranceSum}${i}`]?.c?.map(c => c.t),
                        },
                        mainRemain: {
                            value: mainWorksheet[`${modifiedStructs.main.remain}${i}`]?.v,
                            comments: mainWorksheet[`${modifiedStructs.main.remain}${i}`]?.c?.map(c => c.t),
                        },
                    });
                }

                for (let i = parseInt(modifiedStructs.add.startRow); i <= parseInt(modifiedStructs.add.endRow); i++) {
                    if (modifiedStructs.add.dropRows.includes(i)) continue;

                    let name = `${addWorksheet[`${modifiedStructs.add.name[0]}${i}`]?.v} ${addWorksheet[`${modifiedStructs.add.name[1]}${i}`]?.v}`;

                    let row = tempRows.find(row => row.name.value === name);
                    let isNew = false;
                    if (!row) {
                        isNew = true;
                        row = {
                            id: i - modifiedStructs.add.startRow + tempRows.length,
                            username: {
                                value: users.find(user => `${user.name.first} ${user.name.last}` === name)?.username
                            },
                            name: {
                                value: name,
                                comments: "",
                            },
                            coefficientMain: {
                                value: addWorksheet[`${modifiedStructs.add.coefficientMain}${i}`]?.v,
                                comments: addWorksheet[`${modifiedStructs.add.coefficientMain}${i}`]?.c?.map(c => c.t),
                            },
                            coefficientArea: {
                                value: addWorksheet[`${modifiedStructs.add.coefficientArea}${i}`]?.v,
                                comments: addWorksheet[`${modifiedStructs.add.coefficientArea}${i}`]?.c?.map(c => c.t),
                            },
                            coefficientPosition: {
                                value: addWorksheet[`${modifiedStructs.add.coefficientPosition}${i}`]?.v,
                                comments: addWorksheet[`${modifiedStructs.add.coefficientPosition}${i}`]?.c?.map(c => c.t),
                            },
                            coefficientOverYear: {
                                value: addWorksheet[`${modifiedStructs.add.coefficientOverYear}${i}`]?.v,
                                comments: addWorksheet[`${modifiedStructs.add.coefficientOverYear}${i}`]?.c?.map(c => c.t),
                            },
                        };
                    }

                    row.addCoefficientSum = {
                        value: addWorksheet[`${modifiedStructs.add.coefficientSum}${i}`]?.v,
                        comments: addWorksheet[`${modifiedStructs.add.coefficientSum}${i}`]?.c?.map(c => c.t),
                    };
                    row.addSum = {
                        value: addWorksheet[`${modifiedStructs.add.sum}${i}`]?.v,
                        comments: addWorksheet[`${modifiedStructs.add.sum}${i}`]?.c?.map(c => c.t),
                    };
                    row.addSum80 = {
                        value: addWorksheet[`${modifiedStructs.add.sum80}${i}`]?.v,
                        comments: addWorksheet[`${modifiedStructs.add.sum80}${i}`]?.c?.map(c => c.t),
                    };
                    row.addSum40 = {
                        value: addWorksheet[`${modifiedStructs.add.sum40}${i}`]?.v,
                        comments: addWorksheet[`${modifiedStructs.add.sum40}${i}`]?.c?.map(c => c.t),
                    };
                    row.addRemain20 = {
                        value: addWorksheet[`${modifiedStructs.add.remain20}${i}`]?.v,
                        comments: addWorksheet[`${modifiedStructs.add.remain20}${i}`]?.c?.map(c => c.t),
                    };
                    row.addSubDayOff = {
                        value: addWorksheet[`${modifiedStructs.add.subDayOff}${i}`]?.v,
                        comments: addWorksheet[`${modifiedStructs.add.subDayOff}${i}`]?.c?.map(c => c.t),
                    };
                    row.addRemain = {
                        value: addWorksheet[`${modifiedStructs.add.remain}${i}`]?.v,
                        comments: addWorksheet[`${modifiedStructs.add.remain}${i}`]?.c?.map(c => c.t),
                    };

                    if (isNew) tempRows.push(row);
                    else tempRows = tempRows.map(rowIn => rowIn.id === row.id ? row : rowIn);
                }

                for (let i = parseInt(modifiedStructs.fee.startRow); i <= parseInt(modifiedStructs.fee.endRow); i++) {
                    if (modifiedStructs.fee.dropRows.includes(i)) continue;

                    let name = `${feeWorksheet[`${modifiedStructs.fee.name[0]}${i}`]?.v} ${feeWorksheet[`${modifiedStructs.fee.name[1]}${i}`]?.v}`;

                    let row = tempRows.find(row => row.name.value === name);
                    let isNew = false;
                    if (!row) {
                        isNew = true;
                        row = {
                            id: i - modifiedStructs.add.startRow + tempRows.length,
                            username: {
                                value: users.find(user => `${user.name.first} ${user.name.last}` === name)?.username
                            },
                            name: {
                                value: name,
                                comments: "",
                            },
                        };
                    }

                    row.coefficientGovernment = {
                        value: feeWorksheet[`${modifiedStructs.fee.coefficientGovernment}${i}`]?.v,
                        comments: feeWorksheet[`${modifiedStructs.fee.coefficientGovernment}${i}`]?.c?.map(c => c.t),
                    };
                    row.coefficientParty = {
                        value: feeWorksheet[`${modifiedStructs.fee.coefficientParty}${i}`]?.v,
                        comments: feeWorksheet[`${modifiedStructs.fee.coefficientParty}${i}`]?.c?.map(c => c.t),
                    };
                    row.feeCoefficientSum = {
                        value: feeWorksheet[`${modifiedStructs.fee.coefficientSum}${i}`]?.v,
                        comments: feeWorksheet[`${modifiedStructs.fee.coefficientSum}${i}`]?.c?.map(c => c.t),
                    };
                    row.feeSum = {
                        value: feeWorksheet[`${modifiedStructs.fee.sum}${i}`]?.v,
                        comments: feeWorksheet[`${modifiedStructs.fee.sum}${i}`]?.c?.map(c => c.t),
                    };
                    row.specialJob = {
                        value: feeWorksheet[`${modifiedStructs.fee.specialJob}${i}`]?.v,
                        comments: feeWorksheet[`${modifiedStructs.fee.specialJob}${i}`]?.c?.map(c => c.t),
                    };
                    row.feeAddSum = {
                        value: feeWorksheet[`${modifiedStructs.fee.addSum}${i}`]?.v,
                        comments: feeWorksheet[`${modifiedStructs.fee.addSum}${i}`]?.c?.map(c => c.t),
                    };
                    row.feeSubDayOff = {
                        value: feeWorksheet[`${modifiedStructs.fee.subDayOff}${i}`]?.v,
                        comments: feeWorksheet[`${modifiedStructs.fee.subDayOff}${i}`]?.c?.map(c => c.t),
                    };
                    row.feeRemain = {
                        value: feeWorksheet[`${modifiedStructs.fee.remain}${i}`]?.v,
                        comments: feeWorksheet[`${modifiedStructs.fee.remain}${i}`]?.c?.map(c => c.t),
                    };

                    if (isNew) tempRows.push(row);
                    else tempRows = tempRows.map(rowIn => rowIn.id === row.id ? row : rowIn);
                }

                setModifiedStructs(modifiedStructs);
                setDataset([tempRows]);
                break;
            case "teach":
                modifiedStructs = {
                    teach: {
                        tableName: e.target.teachTableName.value,
                        startRow: e.target.teachStartRow.value,
                        endRow: e.target.teachEndRow.value,
                        dropRows: e.target.teachDropRows.value ? e.target.teachDropRows.value.split(",").map(row => parseInt(row)) : [],
                        name: e.target.teachName.value,
                        lessons: e.target.lessons.value,
                        exchangedLessons: e.target.exchangedLessons.value,
                        superviseExam: e.target.superviseExam.value,
                        subTeach: e.target.subTeach.value,
                        subResearch: e.target.subResearch.value,
                        subSum: e.target.subSum.value,
                        lessonSum: e.target.lessonSum.value,
                        sum: e.target.sum.value,
                    }
                }

                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                for (let i = parseInt(modifiedStructs.teach.startRow); i <= parseInt(modifiedStructs.teach.endRow); i++) {
                    if (modifiedStructs.teach.dropRows.includes(i)) continue;

                    tempRows.push({
                        id: i - modifiedStructs.teach.startRow,
                        username: {
                            value: users.filter(user => `${user.name.first} ${user.name.last}` === worksheet[`${modifiedStructs.teach.name}${i}`]?.v)[0]?.username
                        },
                        name: {
                            value: worksheet[`${modifiedStructs.teach.name}${i}`]?.v,
                            comments: worksheet[`${modifiedStructs.teach.name}${i}`]?.c?.map(c => c.t),
                        },
                        lessons: {
                            value: worksheet[`${modifiedStructs.teach.lessons}${i}`]?.v,
                            comments: worksheet[`${modifiedStructs.teach.lessons}${i}`]?.c?.map(c => c.t),
                        },
                        exchangedLessons: {
                            value: worksheet[`${modifiedStructs.teach.exchangedLessons}${i}`]?.v,
                            comments: worksheet[`${modifiedStructs.teach.exchangedLessons}${i}`]?.c?.map(c => c.t),
                        },
                        superviseExam: {
                            value: worksheet[`${modifiedStructs.teach.superviseExam}${i}`]?.v,
                            comments: worksheet[`${modifiedStructs.teach.superviseExam}${i}`]?.c?.map(c => c.t),
                        },
                        subTeach: {
                            value: Math.abs(worksheet[`${modifiedStructs.teach.subTeach}${i}`]?.v),
                            comments: worksheet[`${modifiedStructs.teach.subTeach}${i}`]?.c?.map(c => c.t),
                        },
                        subResearch: {
                            value: Math.abs(worksheet[`${modifiedStructs.teach.subResearch}${i}`]?.v),
                            comments: worksheet[`${modifiedStructs.teach.subResearch}${i}`]?.c?.map(c => c.t),
                        },
                        subSum: {
                            value: Math.abs(worksheet[`${modifiedStructs.teach.subSum}${i}`]?.v),
                            comments: worksheet[`${modifiedStructs.teach.subSum}${i}`]?.c?.map(c => c.t),
                        },
                        lessonSum: {
                            value: Math.abs(worksheet[`${modifiedStructs.teach.lessonSum}${i}`]?.v),
                            comments: worksheet[`${modifiedStructs.teach.lessonSum}${i}`]?.c?.map(c => c.t),
                        },
                        sum: {
                            value: Math.abs(worksheet[`${modifiedStructs.teach.sum}${i}`]?.v),
                            comments: worksheet[`${modifiedStructs.teach.sum}${i}`]?.c?.map(c => c.t),
                        },
                    });
                }

                setModifiedStructs(modifiedStructs);
                setDataset([tempRows]);
                break;
            case "guide":
                modifiedStructs = {
                    guide: {
                        tableName: e.target.guideTableName.value,
                        startRow: e.target.guideStartRow.value,
                        endRow: e.target.guideEndRow.value,
                        dropRows: e.target.guideDropRows.value ? e.target.guideDropRows.value.split(",").map(row => parseInt(row)) : [],
                        name: e.target.guideName.value,
                        mission: e.target.mission.value,
                        studentCount: e.target.studentCount.value,
                        lessonCount: e.target.lessonCount.value,
                        price: e.target.price.value,
                        sum: e.target.guideSum.value,
                    }
                }

                const guideWorksheet = workbook.Sheets[workbook.SheetNames[0]];

                for (let i = parseInt(modifiedStructs.guide.startRow); i <= parseInt(modifiedStructs.guide.endRow); i++) {
                    if (modifiedStructs.guide.dropRows.includes(i)) continue;

                    tempRows.push({
                        id: i - modifiedStructs.guide.startRow,
                        username: {
                            value: users.filter(user => `${user.name.first} ${user.name.last}` === guideWorksheet[`${modifiedStructs.guide.name}${i}`]?.v)[0]?.username
                        },
                        name: {
                            value: guideWorksheet[`${modifiedStructs.guide.name}${i}`]?.v,
                            comments: guideWorksheet[`${modifiedStructs.guide.name}${i}`]?.c?.map(c => c.t),
                        },
                        mission: {
                            value: guideWorksheet[`${modifiedStructs.guide.mission}${i}`]?.v,
                            comments: guideWorksheet[`${modifiedStructs.guide.mission}${i}`]?.c?.map(c => c.t),
                        },
                        studentCount: {
                            value: guideWorksheet[`${modifiedStructs.guide.studentCount}${i}`]?.v,
                            comments: guideWorksheet[`${modifiedStructs.guide.studentCount}${i}`]?.c?.map(c => c.t),
                        },
                        lessonCount: {
                            value: guideWorksheet[`${modifiedStructs.guide.lessonCount}${i}`]?.v,
                            comments: guideWorksheet[`${modifiedStructs.guide.lessonCount}${i}`]?.c?.map(c => c.t),
                        },
                        price: {
                            value: guideWorksheet[`${modifiedStructs.guide.price}${i}`]?.v,
                            comments: guideWorksheet[`${modifiedStructs.guide.price}${i}`]?.c?.map(c => c.t),
                        },
                        sum: {
                            value: guideWorksheet[`${modifiedStructs.guide.sum}${i}`]?.v,
                            comments: guideWorksheet[`${modifiedStructs.guide.sum}${i}`]?.c?.map(c => c.t),
                        },
                    });
                }

                setModifiedStructs(modifiedStructs);
                setDataset([tempRows]);
                break;
            case "welfare":
                modifiedStructArr = {
                    welfare: [],
                };
                workbook.SheetNames.map((SheetName, index) => {
                    modifiedStructs = {
                        welfare: {
                            tableName: e.target[`welfareTableName${index}`].value,
                            startRow: e.target[`welfareStartRow${index}`].value,
                            endRow: e.target[`welfareEndRow${index}`].value,
                            dropRows: e.target[`welfareDropRows${index}`].value ? e.target[`welfareDropRows${index}`].value.split(",").map(row => parseInt(row)) : [],
                            name: e.target[`welfareName${index}`].value ? e.target[`welfareName${index}`].value.split(",") : [],
                            sum: e.target[`sum${index}`].value,
                        }
                    }

                    const worksheet = workbook.Sheets[workbook.SheetNames[index]];

                    const rows = [];

                    for (let i = parseInt(modifiedStructs.welfare.startRow); i <= parseInt(modifiedStructs.welfare.endRow); i++) {
                        if (modifiedStructs.welfare.dropRows.includes(i)) continue;

                        let name = `${worksheet[`${modifiedStructs.welfare.name[0]}${i}`]?.v} ${worksheet[`${modifiedStructs.welfare.name[1]}${i}`]?.v}`;
                        rows.push({
                            id: i - modifiedStructs.welfare.startRow,
                            username: {
                                value: users.filter(user => `${user.name.first} ${user.name.last}` === name)[0]?.username,
                            },
                            name: {
                                value: name,
                            },
                            sum: {
                                value: worksheet[`${modifiedStructs.welfare.sum}${i}`]?.v,
                                comments: worksheet[`${modifiedStructs.welfare.sum}${i}`]?.c?.map(c => c.t),
                            },
                        });
                    }
                    tempRows.push(rows);
                    modifiedStructArr.welfare.push(modifiedStructs.welfare);
                });

                setModifiedStructs(modifiedStructArr);
                setDataset(tempRows);
                break;
            case "other":
                modifiedStructArr = {
                    other: [],
                };
                workbook.SheetNames.map((SheetName, index) => {
                    modifiedStructs = {
                        other: {
                            tableName: e.target[`otherTableName${index}`].value,
                            startRow: e.target[`otherStartRow${index}`].value,
                            endRow: e.target[`otherEndRow${index}`].value,
                            dropRows: e.target[`otherDropRows${index}`].value ? e.target[`welfareDropRows${index}`].value.split(",").map(row => parseInt(row)) : [],
                            name: e.target[`otherName${index}`].value ? e.target[`otherName${index}`].value.split(",") : [],
                            sum: e.target[`sum${index}`].value,
                        }
                    }

                    const worksheet = workbook.Sheets[workbook.SheetNames[index]];

                    const rows = [];

                    for (let i = parseInt(modifiedStructs.other.startRow); i <= parseInt(modifiedStructs.other.endRow); i++) {
                        if (modifiedStructs.other.dropRows.includes(i)) continue;

                        let name = `${worksheet[`${modifiedStructs.other.name[0]}${i}`]?.v} ${worksheet[`${modifiedStructs.other.name[1]}${i}`]?.v}`;
                        rows.push({
                            id: {
                                value: i - modifiedStructs.other.startRow,
                            },
                            username: {
                                value: users.filter(user => `${user.name.first} ${user.name.last}` === name)[0]?.username,
                            },
                            name: {
                                value: name,
                            },
                            sum: {
                                value: worksheet[`${modifiedStructs.other.sum}${i}`]?.v,
                                comments: worksheet[`${modifiedStructs.other.sum}${i}`]?.c?.map(c => c.t),
                            },
                        });
                    }
                    tempRows.push(rows);
                    modifiedStructArr.other.push(modifiedStructs.other);
                });

                setModifiedStructs(modifiedStructArr);
                setDataset(tempRows);
                break;
        }
        stopLoading();
    }

    // Handle import salary
    const handleImportSalary = () => {
        const modifiedDataset = dataset.map(data => data.map(row => {
            const user = users.filter(user => row.username.value === user.username)[0]?._id;
            row.user = user;
            return row;
        }));
        const data = {
            period: period,
            salaries: {
                main: ["main", "add", "fee"].includes(salaryType) ? {
                    mainSalary: 1150000,
                    addSalary: 500000,
                    feeSalary: 600000,
                    data: modifiedDataset[0],
                } : null,
                teach: salaryType === "teach" ? {
                    name: modifiedStructs.teach.tableName,
                    data: modifiedDataset[0],
                } : null,
                guide: salaryType === "guide" ? {
                    name: modifiedStructs.guide.tableName,
                    data: modifiedDataset[0],
                } : null,
                welfare: salaryType === "welfare" ? dataset.map((data, index) => ({
                    name: modifiedStructs.welfare[index].tableName,
                    data: modifiedDataset[index],
                })) : null,
                other: salaryType === "other" ? dataset.map((data, index) => ({
                    name: modifiedStructs.other[index].tableName,
                    data: modifiedDataset[index],
                })) : null,
            }
        }
        startLoading();
        request.post("/salaries", data).then(res => {
            setStep(3);
            success("Nhập file lương thành công");
            stopLoading();
            setSavedSalary(res.data);
        }).catch(err => {
            error("Lỗi khi nhập file lương");
            stopLoading();
        });
    }

    const handleCloseDialog = () => {
        setDialogType(null);
    };

    //handle send email
    const handleSendMail = () => {
        request.get(`/salaries/${savedSalary._id}/sendMail?type=${salaryType}`);
        setSent(true);
        handleCloseDialog();
        success("Đã gửi email");
    }

    return (
        <>
            {/*Steppers*/}
            <Paper sx={{mb: 1, p: 1}}>
                <Typography variant="h4" textAlign="center" sx={{mb: 1, fontWeight: "bold"}}>Nhập lương</Typography>
                <Stepper activeStep={step}>
                    <Step>
                        <StepLabel StepIconComponent={FileCopy}>Nhập file</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel StepIconComponent={SettingsSuggest}>Phân tích file</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel StepIconComponent={Preview}>Xem trước lương</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel StepIconComponent={Done}>Hoàn tất</StepLabel>
                    </Step>
                </Stepper>
            </Paper>

            <Paper sx={{flexGrow: 1, display: "flex", overflowY: "auto", p: 1}}>
                {/*Step 1*/}
                <Box
                    sx={{
                        display: step === 0 ? "flex" : "none",
                        flexGrow: 1,
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            "& > :not(style)": {m: 1}
                        }}
                    >
                        <Button
                            variant="contained"
                            startIcon={<AttachFile/>}
                            onClick={handleOpenFileDialog}
                        >
                            Chọn file cần nhập
                        </Button>
                        <input
                            size="small"
                            ref={importFileRef}
                            type="file"
                            style={{display: "none"}}
                            onChange={handleImportFile}
                            accept=".xls,.xlsx"
                        />
                        <Typography>{fileName}</Typography>
                        <FormControl>
                            <InputLabel>Loại lương</InputLabel>
                            <Select size="small" sx={{width: 500}} defaultValue="main" label="Loại lương"
                                    onChange={(e) => handleChangeSalaryType(e.target.value)}>
                                <MenuItem value="main">Lương chính, tăng thêm và quản lý phí</MenuItem>
                                <MenuItem value="teach">Lương giảng dạy</MenuItem>
                                <MenuItem value="guide">Hướng dẫn đồ án, phản biện, hội đồng chấm đồ án tốt nghiệp</MenuItem>
                                <MenuItem value="welfare">Phúc lợi</MenuItem>
                                <MenuItem value="other">Khoản khác</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel>Tháng</InputLabel>
                            <Select size="small" sx={{width: 500}} defaultValue={period.month} label="Tháng"
                                    onChange={(e) => setPeriod(state => ({...state, month: e.target.value}))}>
                                {months.map(month => (
                                    <MenuItem value={month.name}>{month.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel>Năm</InputLabel>
                            <Select size="small" sx={{width: 500}} defaultValue={period.year} label="Năm"
                                    onChange={(e) => setPeriod(state => ({...state, year: e.target.value}))}>
                                {years.map(year => (
                                    <MenuItem value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button size="small" variant="contained" onClick={handlePrevious} startIcon={<ArrowBackIos/>}>Trước</Button>
                        <LoadingButton
                            size="small"
                            loading={isLoading}
                            disabled={fileName === ""}
                            loadingPosition="end"
                            variant="contained"
                            onClick={handleAnalyseStructs}
                            endIcon={<Send/>}
                        >
                            Phân tích
                        </LoadingButton>
                    </Box>
                </Box>

                {/*Step 2*/}
                <Box
                    sx={{
                        display: step === 1 ? "flex" : "none",
                        flexGrow: 1,
                        flexDirection: "column",
                    }}
                    onSubmit={handleReview}
                    component="form"
                >
                    <Box sx={{
                        width: "100%",
                        flexGrow: 1,
                        overflowY: "auto",
                        border: 1,
                        borderRadius: 1,
                        borderColor: "grey.300",
                        mb: 1,
                    }}>
                        <Grid container spacing={2} justifyContent="center">
                            {show && initStructs.main ? (
                                <Grid item xs={12} sm={6} md={4} lg={3} sx={{"& > :not(style)": {my: 1}}}>
                                    <Typography variant="h4" textAlign="center"><b>Lương chính</b></Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Bảng tính lương chính</InputLabel>
                                        <Select size="small" inputProps={{name: "mainSheetIndex"}} label="Bảng tính lương chính"
                                                defaultValue={initStructs.main.sheetIndex}
                                                onChange={handleChangeMainSheet}>
                                            {workbook.SheetNames.map((name, index) => (
                                                <MenuItem value={index}>{name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField size="small" fullWidth name="mainSalary" label="Lương cơ bản"
                                               defaultValue={initStructs.main.salary}/>

                                    <Typography textAlign="center"><b>Các hàng</b></Typography>
                                    <TextField size="small" fullWidth name="mainStartRow" label="Hàng dữ liệu đầu tiên"
                                               defaultValue={initStructs.main.startRow}/>
                                    <TextField size="small" fullWidth name="mainEndRow" label="Hàng dữ liệu cuối cùng"
                                               defaultValue={initStructs.main.endRow}/>
                                    <TextField size="small" fullWidth name="mainDropRows"
                                               label="Các hàng dữ liệu loại bỏ"
                                               defaultValue={initStructs.main.dropRows.toString()}/>

                                    <Typography textAlign="center"><b>Các cột</b></Typography>
                                    <TextField size="small" fullWidth name="mainName" label="Tên"
                                               defaultValue={initStructs.main.name}/>
                                    <TextField size="small" fullWidth name="code" label="Mã số ngạch lương"
                                               defaultValue={initStructs.main.code}/>
                                    <TextField size="small" fullWidth name="newLevel" label="Bậc mới"
                                               defaultValue={initStructs.main.newLevel}/>
                                    <TextField size="small" fullWidth name="mainCoefficientMain" label="Hệ số lương"
                                               defaultValue={initStructs.main.coefficientMain}/>
                                    <TextField size="small" fullWidth name="mainCoefficientArea" label="Phụ cấp khu vực"
                                               defaultValue={initStructs.main.coefficientArea}/>
                                    <TextField size="small" fullWidth name="mainCoefficientPosition" label="Phụ cấp chức vụ"
                                               defaultValue={initStructs.main.coefficientPosition}/>
                                    <TextField size="small" fullWidth name="mainCoefficientOverYear"
                                               label="Phụ cấp thâm niên VK"
                                               defaultValue={initStructs.main.coefficientOverYear}/>
                                    <TextField size="small" fullWidth name="coefficientJob" label="Phụ cấp TN theo cv"
                                               defaultValue={initStructs.main.coefficientJob}/>
                                    <TextField size="small" fullWidth name="coefficientTeach"
                                               label="PC thâm niên nhà giáo"
                                               defaultValue={initStructs.main.coefficientTeach}/>
                                    <TextField size="small" fullWidth name="mainCoefficientSum" label="Cộng hệ số"
                                               defaultValue={initStructs.main.coefficientSum}/>
                                    <TextField size="small" fullWidth name="mainSum"
                                               label="Tổng cộng tiền lương được hưởng"
                                               defaultValue={initStructs.main.sum}/>
                                    <TextField size="small" fullWidth name="teachReward" label="Ưu đãi đứng lớp"
                                               defaultValue={initStructs.main.teachReward}/>
                                    <TextField size="small" fullWidth name="insuranceHealth" label="BHYT"
                                               defaultValue={initStructs.main.insuranceHealth}/>
                                    <TextField size="small" fullWidth name="insuranceSocial" label="BHXH"
                                               defaultValue={initStructs.main.insuranceSocial}/>
                                    <TextField size="small" fullWidth name="insuranceUnemployment" label="BHTN"
                                               defaultValue={initStructs.main.insuranceUnemployment}/>
                                    <TextField size="small" fullWidth name="insuranceSum" label="Tổng trừ"
                                               defaultValue={initStructs.main.insuranceSum}/>
                                    <TextField size="small" fullWidth name="mainRemain" label="Còn nhận"
                                               defaultValue={initStructs.main.remain}/>
                                </Grid>
                            ) : (
                                <></>
                            )}
                            {show && initStructs.add ? (
                                <Grid item xs={12} sm={6} md={4} lg={3} sx={{"& > :not(style)": {my: 1}}}>
                                    <Typography variant="h4" textAlign="center"><b>Lương tăng thêm</b></Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Bảng tính lương chính</InputLabel>
                                        <Select size="small" inputProps={{name: "addSheetIndex"}} label="Bảng tính lương tăng thêm"
                                                defaultValue={initStructs.add.sheetIndex}
                                                onChange={handleChangeAddSheet}>
                                            {workbook.SheetNames.map((name, index) => (
                                                <MenuItem value={index}>{name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField size="small" fullWidth name="addSalary" label="Mức chi trả/1 hệ số"
                                               defaultValue={initStructs.add.salary}/>

                                    <Typography textAlign="center"><b>Các hàng</b></Typography>
                                    <TextField size="small" fullWidth name="addStartRow" label="Hàng dữ liệu đầu tiên"
                                               defaultValue={initStructs.add.startRow}/>
                                    <TextField size="small" fullWidth name="addEndRow" label="Hàng dữ liệu cuối cùng"
                                               defaultValue={initStructs.add.endRow}/>
                                    <TextField size="small" fullWidth name="addDropRows"
                                               label="Các hàng dữ liệu loại bỏ"
                                               defaultValue={initStructs.add.dropRows.toString()}/>

                                    <Typography textAlign="center"><b>Các cột</b></Typography>
                                    <TextField size="small" fullWidth name="addName" label="Tên"
                                               defaultValue={initStructs.add.name.toString()}/>
                                    <TextField size="small" fullWidth name="addCoefficientMain" label="Hệ số lương"
                                               defaultValue={initStructs.add.coefficientMain}/>
                                    <TextField size="small" fullWidth name="addCoefficientOverYear"
                                               label="Phụ cấp thâm niên VK"
                                               defaultValue={initStructs.add.coefficientOverYear}/>
                                    <TextField size="small" fullWidth name="addCoefficientArea" label="Phụ cấp khu vực"
                                               defaultValue={initStructs.add.coefficientArea}/>
                                    <TextField size="small" fullWidth name="addCoefficientPosition" label="Phụ cấp chức vụ"
                                               defaultValue={initStructs.add.coefficientPosition}/>
                                    <TextField size="small" fullWidth name="addCoefficientSum" label="Cộng hệ số"
                                               defaultValue={initStructs.add.coefficientSum}/>
                                    <TextField size="small" fullWidth name="addSum" label="Thành tiền"
                                               defaultValue={initStructs.add.sum}/>
                                    <TextField size="small" fullWidth name="addSum80" label="80% tiền lương được nhận"
                                               defaultValue={initStructs.add.sum80}/>
                                    <TextField size="small" fullWidth name="addSum40" label="40% tiền lương được nhận"
                                               defaultValue={initStructs.add.sum40}/>
                                    <TextField size="small" fullWidth name="addRemain20" label="20% còn lại"
                                               defaultValue={initStructs.add.remain20}/>
                                    <TextField size="small" fullWidth name="addSubDayOff" label="Trừ ngày nghỉ"
                                               defaultValue={initStructs.add.subDayOff}/>
                                    <TextField size="small" fullWidth name="addRemain" label="Thực nhận"
                                               defaultValue={initStructs.add.remain}/>
                                </Grid>
                            ) : (
                                <></>
                            )}
                            {show && initStructs.fee ? (
                                <Grid item xs={12} sm={6} md={4} lg={3} sx={{"& > :not(style)": {my: 1}}}>
                                    <Typography variant="h4" textAlign="center"><b>Quản lý phí</b></Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Bảng tính lương chính</InputLabel>
                                        <Select size="small" inputProps={{name: "feeSheetIndex"}} label="Bảng tính quản lý phí"
                                                defaultValue={initStructs.fee.sheetIndex}
                                                onChange={handleChangeFeeSheet}>
                                            {workbook.SheetNames.map((name, index) => (
                                                <MenuItem value={index}>{name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField size="small" fullWidth name="feeSalary" label="Mức chi trả/1 hệ số"
                                               defaultValue={initStructs.fee.salary}/>

                                    <Typography textAlign="center"><b>Các hàng</b></Typography>
                                    <TextField size="small" fullWidth name="feeStartRow" label="Hàng dữ liệu đầu tiên"
                                               defaultValue={initStructs.fee.startRow}/>
                                    <TextField size="small" fullWidth name="feeEndRow" label="Hàng dữ liệu cuối cùng"
                                               defaultValue={initStructs.fee.endRow}/>
                                    <TextField size="small" fullWidth name="feeDropRows"
                                               label="Các hàng dữ liệu loại bỏ"
                                               defaultValue={initStructs.fee.dropRows.toString()}/>

                                    <Typography textAlign="center"><b>Các cột</b></Typography>
                                    <TextField size="small" fullWidth name="feeName" label="Tên"
                                               defaultValue={initStructs.fee.name.toString()}/>
                                    <TextField size="small" fullWidth name="coefficientGovernment"
                                               label="Hệ số Chức vụ chính quyền"
                                               defaultValue={initStructs.fee.coefficientGovernment}/>
                                    <TextField size="small" fullWidth name="coefficientParty"
                                               label="Hệ số Chức vụ Đảng/ Đoàn thể"
                                               defaultValue={initStructs.fee.coefficientParty}/>
                                    <TextField size="small" fullWidth name="feeCoefficientSum"
                                               label="Cộng hệ số được hưởng"
                                               defaultValue={initStructs.fee.coefficientSum}/>
                                    <TextField size="small" fullWidth name="feeSum" label="Thành tiền"
                                               defaultValue={initStructs.fee.sum}/>
                                    <TextField size="small" fullWidth name="specialJob"
                                               label="Phụ cấp công việc đặc thù"
                                               defaultValue={initStructs.fee.specialJob}/>
                                    <TextField size="small" fullWidth name="feeAddSum" label="Cộng tiền"
                                               defaultValue={initStructs.fee.addSum}/>
                                    <TextField size="small" fullWidth name="feeSubDayOff" label="Trừ ngày nghỉ"
                                               defaultValue={initStructs.fee.subDayOff}/>
                                    <TextField size="small" fullWidth name="feeRemain" label="Thực nhận"
                                               defaultValue={initStructs.fee.remain}/>
                                </Grid>
                            ) : (
                                <></>
                            )}

                            {show && initStructs.teach ? (
                                <Grid item xs={12} sm={6} md={4} lg={3} sx={{"& > :not(style)": {my: 1}}}>
                                    <Typography variant="h4"><b>Tiền lương giảng dạy</b></Typography>

                                    <TextField size="small" fullWidth name="teachTableName" label="Tên lương giảng dạy"
                                               defaultValue={initStructs.teach.tableName}/>

                                    <Typography textAlign="center"><b>Các hàng</b></Typography>
                                    <TextField size="small" fullWidth name="teachStartRow" label="Hàng dữ liệu đầu tiên"
                                               defaultValue={initStructs.teach.startRow}/>
                                    <TextField size="small" fullWidth name="teachEndRow" label="Hàng dữ liệu cuối cùng"
                                               defaultValue={initStructs.teach.endRow}/>
                                    <TextField size="small" fullWidth name="teachDropRows"
                                               label="Các hàng dữ liệu loại bỏ"
                                               defaultValue={initStructs.teach.dropRows.toString()}/>

                                    <Typography textAlign="center"><b>Các cột</b></Typography>
                                    <TextField size="small" fullWidth name="teachName" label="Tên"
                                               defaultValue={initStructs.teach.name.toString()}/>
                                    <TextField size="small" fullWidth name="lessons" label="Số tiết đăng ký giảng dạy"
                                               defaultValue={initStructs.teach.lessons}/>
                                    <TextField size="small" fullWidth name="exchangedLessons"
                                               label="Tổng số giờ quy đổi"
                                               defaultValue={initStructs.teach.exchangedLessons}/>
                                    <TextField size="small" fullWidth name="superviseExam" label="Giờ coi thi"
                                               defaultValue={initStructs.teach.superviseExam}/>
                                    <TextField size="small" fullWidth name="subTeach" label="Trừ tiết chuẩn giảng dạy"
                                               defaultValue={initStructs.teach.subTeach}/>
                                    <TextField size="small" fullWidth name="subResearch" label="Trừ tiết chuẩn NCKH"
                                               defaultValue={initStructs.teach.subResearch}/>
                                    <TextField size="small" fullWidth name="subSum" label="Tổng tiết chuẩn"
                                               defaultValue={initStructs.teach.subSum}/>
                                    <TextField size="small" fullWidth name="lessonSum"
                                               label="Tổng số tiết sau khi trừ giờ chuẩn"
                                               defaultValue={initStructs.teach.lessonSum}/>
                                    <TextField size="small" fullWidth name="sum" label="Thành tiền"
                                               defaultValue={initStructs.teach.sum}/>
                                </Grid>
                            ) : (
                                <></>
                            )}

                            {show && initStructs.guide ? (
                                <Grid item xs={12} sm={6} md={4} lg={3} sx={{"& > :not(style)": {my: 1}}}>
                                    <Typography variant="h4"><b>Đồ án</b></Typography>

                                    <TextField size="small" fullWidth name="guideTableName" label="Tên lương"
                                               defaultValue={initStructs.guide.tableName}/>

                                    <Typography textAlign="center"><b>Các hàng</b></Typography>
                                    <TextField size="small" fullWidth name="guideStartRow" label="Hàng dữ liệu đầu tiên"
                                               defaultValue={initStructs.guide.startRow}/>
                                    <TextField size="small" fullWidth name="guideEndRow" label="Hàng dữ liệu cuối cùng"
                                               defaultValue={initStructs.guide.endRow}/>
                                    <TextField size="small" fullWidth name="guideDropRows"
                                               label="Các hàng dữ liệu loại bỏ"
                                               defaultValue={initStructs.guide.dropRows.toString()}/>

                                    <Typography textAlign="center"><b>Các cột</b></Typography>
                                    <TextField size="small" fullWidth name="guideName" label="Tên"
                                               defaultValue={initStructs.guide.name.toString()}/>
                                    <TextField size="small" fullWidth name="mission" label="Nhiệm vụ"
                                               defaultValue={initStructs.guide.mission}/>
                                    <TextField size="small" fullWidth name="studentCount"
                                               label="Số sinh viên"
                                               defaultValue={initStructs.guide.studentCount}/>
                                    <TextField size="small" fullWidth name="lessonCount" label="Số tiết/sv"
                                               defaultValue={initStructs.guide.lessonCount}/>
                                    <TextField size="small" fullWidth name="price" label="Đơn giá"
                                               defaultValue={initStructs.guide.price}/>
                                    <TextField size="small" fullWidth name="guideSum" label="Thành tiền"
                                               defaultValue={initStructs.guide.sum}/>
                                </Grid>
                            ) : (
                                <></>
                            )}

                            {show && initStructs.welfare ?
                                initStructs.welfare.map((welfare, index) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} sx={{"& > :not(style)": {my: 1}}}>
                                        <Typography variant="h5" textAlign="center"><b>{welfare.sheetName}</b></Typography>

                                        <TextField size="small" fullWidth name={`welfareTableName${index}`} label="Tên phúc lợi"
                                                   defaultValue={welfare.tableName}/>

                                        <Typography textAlign="center"><b>Các hàng</b></Typography>
                                        <TextField size="small" fullWidth name={`welfareStartRow${index}`}
                                                   label="Hàng dữ liệu đầu tiên"
                                                   defaultValue={welfare.startRow}/>
                                        <TextField size="small" fullWidth name={`welfareEndRow${index}`}
                                                   label="Hàng dữ liệu cuối cùng"
                                                   defaultValue={welfare.endRow}/>
                                        <TextField size="small" fullWidth name={`welfareDropRows${index}`}
                                                   label="Các hàng dữ liệu loại bỏ"
                                                   defaultValue={welfare.dropRows.toString()}/>

                                        <Typography textAlign="center"><b>Các cột</b></Typography>
                                        <TextField size="small" fullWidth name={`welfareName${index}`} label="Tên"
                                                   defaultValue={welfare.name.toString()}/>
                                        <TextField size="small" fullWidth name={`sum${index}`} label="Số tiền"
                                                   defaultValue={welfare.sum}/>
                                    </Grid>
                                )) : (
                                    <></>
                                )}

                            {show && initStructs.other ?
                                initStructs.other.map((other, index) => (
                                    <Grid key={index} item xs={12} sm={6} md={4} lg={3} sx={{"& > :not(style)": {my: 1}}}>
                                        <Typography variant="h5" textAlign="center"><b>{other.sheetName}</b></Typography>

                                        <TextField size="small" fullWidth name={`otherTableName${index}`} label="Tên khoản lương"
                                                   defaultValue={other.tableName}/>

                                        <Typography textAlign="center"><b>Các hàng</b></Typography>
                                        <TextField size="small" fullWidth name={`otherStartRow${index}`}
                                                   label="Hàng dữ liệu đầu tiên"
                                                   defaultValue={other.startRow}/>
                                        <TextField size="small" fullWidth name={`otherEndRow${index}`}
                                                   label="Hàng dữ liệu cuối cùng"
                                                   defaultValue={other.endRow}/>
                                        <TextField size="small" fullWidth name={`otherDropRows${index}`}
                                                   label="Các hàng dữ liệu loại bỏ"
                                                   defaultValue={other.dropRows.toString()}/>

                                        <Typography textAlign="center"><b>Các cột</b></Typography>
                                        <TextField size="small" fullWidth name={`otherName${index}`} label="Tên"
                                                   defaultValue={other.name.toString()}/>
                                        <TextField size="small" fullWidth name={`sum${index}`} label="Số tiền"
                                                   defaultValue={other.sum}/>
                                    </Grid>
                                )) : (
                                    <></>
                                )}
                        </Grid>
                    </Box>

                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button variant="contained" onClick={handlePrevious} startIcon={<ArrowBackIos/>}>Trước</Button>
                        <LoadingButton
                            loading={isLoading}
                            loadingPosition="end"
                            type="submit"
                            variant="contained"
                            endIcon={<Send/>}
                        >
                            Xem trước
                        </LoadingButton>
                    </Box>

                </Box>

                {/*Step 3*/}
                <Box sx={{
                    display: step === 2 ? "flex" : "none",
                    width: "100%",
                    flexGrow: 1,
                    flexDirection: "column",
                    "& > :not(style)": {mt: 2}
                }}>
                    {modifiedStructs[salaryType]?.length > 1 ?
                        <FormControl fullWidth>
                            <InputLabel>Chọn</InputLabel>
                            <Select size="small" label={"Chọn"} defaultValue={0} onChange={(e) => setDatasetIndex(e.target.value)}>
                                {modifiedStructs.welfare?.map((welfare, index) => (
                                    <MenuItem value={index}>{welfare.tableName}</MenuItem>
                                ))}
                                {modifiedStructs.other?.map((other, index) => (
                                    <MenuItem value={index}>{other.tableName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        : <></>}

                    {["main", "add", "fee"].includes(salaryType) &&
                        <AppBar position="static">
                            <Tabs
                                centered
                                value={salaryType}
                                onChange={(e, v) => handleChangeSalaryType(v)}
                                indicatorColor="secondary"
                                textColor="inherit"
                            >
                                {[
                                    {label: "Lương chính", value: "main"},
                                    {label: "Lương tăng thêm", value: "add"},
                                    {label: "Quản lý phí", value: "fee"},
                                ].map(item =>
                                    <Tab label={item.label} value={item.value}/>
                                )}
                            </Tabs>
                        </AppBar>
                    }

                    <Box style={{flexGrow: 1, width: '100%'}}>
                        <DataGrid
                            hideFooter
                            rows={reviewData}
                            columns={columns}
                            checkboxSelection
                            disableSelectionOnClick
                            onCellEditCommit={handleCellEditCommit}
                        />
                    </Box>

                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Button variant="contained" onClick={handlePrevious} startIcon={<ArrowBackIos/>}>Trước</Button>
                        <LoadingButton
                            loading={isLoading}
                            loadingPosition="end"
                            variant="contained"
                            endIcon={<Send/>}
                            onClick={handleImportSalary}
                        >
                            Nhập lương
                        </LoadingButton>
                    </Box>
                </Box>

                {/*Step 4*/}
                <Box sx={{
                    flexGrow: 1,
                    display: step === 3 ? "flex" : "none",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    "& > :not(style)": {mt: 1}
                }}>
                    <CheckCircle sx={{fontSize: "100px"}} color="success" />
                    <Typography variant="h5" sx={{fontWeight: "bold"}}>Nhập lương thành công</Typography>
                    {sent === true ? <Button variant="contained" disabled>Đã gửi</Button> : <Button variant="contained" onClick={() => setDialogType("send-mail")}>Gửi thông báo lương (Gửi qua email)</Button>}
                    <Typography>Hệ thống sẽ mất một khoảng thời gian để gửi cho tất cả CB - GV</Typography>
                    <Button variant="contained" color="secondary" onClick={() => setStep(0)}>Quay lại</Button>
                </Box>
            </Paper>

            <Dialog
                    open={dialogType === "send-mail"}
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
        </>
    );
}

export default Import;