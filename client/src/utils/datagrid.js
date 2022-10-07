import request from "./request";

export const columns = {
    main: [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {
            field: 'username',
            headerName: 'Tên tài khoản',
            type: 'singleSelect',
            valueOptions: [],
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'name',
            headerName: 'Tên trong file',
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedUsername',
            headerName: 'Tên tài khoản',
            hide: false,
            valueGetter: params => params.row.user?.username,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedName',
            headerName: 'Họ tên',
            hide: false,
            valueGetter: params => params.row.user ? `${params.row.user?.name?.first} ${params.row.user?.name?.last}` : '',
            flex: 1,
            minWidth: 200,
        },
        {
            field: 'code',
            headerName: 'Mã số ngạch lương',
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'newLevel',
            headerName: 'Bậc mới',
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'coefficientMain',
            headerName: 'Hệ số lương',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 130,
        },
        {
            field: 'coefficientArea',
            headerName: 'Phụ cấp khu vực',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'coefficientPosition',
            headerName: 'Phụ cấp chức vụ',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'coefficientOverYear',
            headerName: 'Phụ cấp thâm niên VK',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'coefficientJob',
            headerName: 'Phụ cấp t/n theo CV',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'coefficientTeach',
            headerName: 'Phụ cấp t/n nhà giáo',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 180,
        },
        {
            field: 'mainCoefficientSum',
            headerName: 'Cộng hệ số',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 100,
        },
        {
            field: 'mainSum',
            headerName: 'Tổng cộng',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 120,
        },
        {
            field: 'teachReward',
            headerName: 'Ưu đãi đứng lớp',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'insuranceHealth',
            headerName: 'Bảo hiểm y tế',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'insuranceSocial',
            headerName: 'Bảo hiểm xá hội',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'insuranceUnemployment',
            headerName: 'Bảo hiểm thất nghiệp',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'insuranceSum',
            headerName: 'Tổng trừ',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'mainRemain',
            headerName: 'Còn nhận',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
    ],
    add: [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {
            field: 'username',
            headerName: 'Tên tài khoản',
            type: 'singleSelect',
            valueOptions: [],
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'name',
            headerName: 'Tên trong file',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedUsername',
            headerName: 'Tên tài khoản',
            hide: false,
            valueGetter: params => params.row.user?.username,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedName',
            headerName: 'Họ tên',
            hide: false,
            valueGetter: params => params.row.user ? `${params.row.user?.name?.first} ${params.row.user?.name?.last}` : '',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'coefficientMain',
            headerName: 'Hệ số lương',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'coefficientOverYear',
            headerName: 'Phụ cấp thâm niên VK',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'coefficientArea',
            headerName: 'Phụ cấp khu vực',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'coefficientPosition',
            headerName: 'Phụ cấp chức vụ',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'addCoefficientSum',
            headerName: 'Cộng hệ số',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'addSum',
            headerName: 'Thành tiền',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'addSum80',
            headerName: '80% tiền lương được nhận',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'addSum40',
            headerName: '40% tiền lương được nhận',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'addRemain20',
            headerName: '20% còn lại',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'addSubDayOff',
            headerName: 'Trừ ngày nghỉ',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'addRemain',
            headerName: 'Thực nhận',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
    ],
    fee: [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {
            field: 'username',
            headerName: 'Tên tài khoản',
            type: 'singleSelect',
            valueOptions: [],
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'name',
            headerName: 'Tên trong file',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedUsername',
            headerName: 'Tên tài khoản',
            hide: false,
            valueGetter: params => params.row.user?.username,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedName',
            headerName: 'Họ tên',
            hide: false,
            valueGetter: params => params.row.user ? `${params.row.user?.name?.first} ${params.row.user?.name?.last}` : '',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'coefficientGovernment',
            headerName: 'Hệ số chức vụ chính quyền',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'coefficientParty',
            headerName: 'Hệ số chức vụ Đảng/Đoàn thể',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'feeCoefficientSum',
            headerName: 'Cộng hệ số được hưởng',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'feeSum',
            headerName: 'Thành tiền',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'specialJob',
            headerName: 'Phụ cấp công việc đặc thù',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'feeAddSum',
            headerName: 'Cộng tiền',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'feeSubDayOff',
            headerName: 'Trừ ngày nghỉ',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'feeRemain',
            headerName: 'Thực nhận',
            type: "number",
            editable: true,
            hide: false,
            flex: 1,
            minWidth: 150,
        },
    ],
    teach: [
        {field: 'id', headerName: 'ID', minWidth: 90, hide: true},
        {
            field: 'username',
            headerName: 'Tên tài khoản',
            type: 'singleSelect',
            valueOptions: [],
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'name',
            headerName: 'Tên trong file',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedUsername',
            headerName: 'Tên tài khoản',
            hide: false,
            valueGetter: params => params.row.user?.username,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedName',
            headerName: 'Họ tên',
            hide: false,
            valueGetter: params => params.row.user ? `${params.row.user?.name?.first} ${params.row.user?.name?.last}` : '',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'lessons',
            headerName: 'Số tiết đăng ký giảng dạy',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'exchangedLessons',
            headerName: 'Tổng số tiết quy đổi',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'superviseExam',
            headerName: 'Giờ coi thi',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'subTeach',
            headerName: 'Trừ tiết chuẩn giảng dạy',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'subResearch',
            headerName: 'Trừ tiết chuẩn NCKH',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'subSum',
            headerName: 'Tổng tiết chuẩn',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'lessonSum',
            headerName: 'Tổng số tiết sau khi trừ giờ chuẩn',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'sum',
            headerName: 'Thành tiền',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
    ],
    welfare: [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {
            field: 'username',
            headerName: 'Tên tài khoản',
            type: 'singleSelect',
            valueOptions: [],
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'name',
            headerName: 'Tên trong file',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedUsername',
            headerName: 'Tên tài khoản',
            hide: false,
            valueGetter: params => params.row.user?.username,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedName',
            headerName: 'Họ tên',
            hide: false,
            valueGetter: params => params.row.user ? `${params.row.user?.name?.first} ${params.row.user?.name?.last}` : '',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'sum',
            headerName: 'Số tiền',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
    ],
    guide: [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {
            field: 'username',
            headerName: 'Tên tài khoản',
            type: 'singleSelect',
            valueOptions: [],
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'name',
            headerName: 'Tên trong file',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedUsername',
            headerName: 'Tên tài khoản',
            hide: false,
            valueGetter: params => params.row.user?.username,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedName',
            headerName: 'Họ tên',
            hide: false,
            valueGetter: params => params.row.user ? `${params.row.user?.name?.first} ${params.row.user?.name?.last}` : '',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'mission',
            headerName: 'Nhiệm vụ',
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'studentCount',
            headerName: 'Số sinh viên',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'lessonCount',
            headerName: 'Số tiết/sv',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'price',
            headerName: 'Đơn giá',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'sum',
            headerName: 'Thành tiền',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
    ],
    other: [
        {field: 'id', headerName: 'ID', width: 90, hide: true},
        {
            field: 'username',
            headerName: 'Tên tài khoản',
            type: 'singleSelect',
            valueOptions: [],
            editable: true,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'name',
            headerName: 'Tên trong file',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedUsername',
            headerName: 'Tên tài khoản',
            hide: false,
            valueGetter: params => params.row.user?.username,
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'storedName',
            headerName: 'Họ tên',
            hide: false,
            valueGetter: params => params.row.user ? `${params.row.user?.name?.first} ${params.row.user?.name?.last}` : '',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'sum',
            headerName: 'Số tiền',
            type: "number",
            editable: true,
            flex: 1,
            minWidth: 150,
        },
    ],
};

// Detect row struct from a worksheet
export const detectRows = (worksheet) => {
    let dropRows = [];
    let startRow = 1;
    while (!Number.isInteger(worksheet[`A${startRow}`]?.v)) startRow++;
    let endRow = startRow;
    while (true) {
        if (!Number.isInteger(worksheet[`A${endRow}`]?.v) && !Number.isInteger(worksheet[`A${endRow + 1}`]?.v)) break;
        if (!Number.isInteger(worksheet[`A${endRow}`]?.v)) dropRows.push(endRow);
        endRow++;
    }

    return {startRow: startRow, endRow: endRow - 1, dropRows: dropRows};
}

export const selectColumns = (type, dropColumns = []) => {
    if (!["add", "fee", "teach", "guide", "welfare", "other"].includes(type)) type = "main";

    return new Promise((resolve, reject) => {
        request.get("/users?all=1").then(res => {
            const users = res.data;
            const convertedUsers = users.map(user => ({
                value: user.username,
                label: `${user.name.first} ${user.name.last}`
            }));
            const currentColumns = columns[type]?.map(column => {
                if (column.field === "username") column.valueOptions = convertedUsers;
                return column;
            }).filter(columns => !dropColumns.includes(columns.field));

            resolve({columns: currentColumns, users: users});
        }).catch(err => reject(err.response.data));
    });
}

export const updateData = (data, params) => {
    let row = data.filter(row => row.id === params.id)[0];
    row[params.field].value = params.value;
    return data;
}

export const getReviewData = (data) => {
    data = data?.map((row, index) => {
        row = {...row};
        for (let key in row) {
            if (key === "_id") row["_id"] = row[key];
            else if (key === "user") row["username"] = row[key].username;
            else row[key] = row[key].value;
        }
        if (!row.id) row.id = index;
        return row;
    });
    return data ? data : [];
}

/*const calculateMainRow = (row) => {
    row.mainCoefficientSum = (parseFloat(row.coefficientMain ? row.coefficientMain : 0) + parseFloat(row.coefficientArea ? row.coefficientArea : 0) + parseFloat(row.coefficientPosition ? row.coefficientPosition : 0) + parseFloat(row.coefficientOverYear ? row.coefficientOverYear : 0) + parseFloat(row.coefficientJob ? row.coefficientJob : 0) + parseFloat(row.coefficientTeach ? row.coefficientTeach : 0));
    row.mainSum = (parseFloat(row.mainCoefficientSum) * salaries.main);
    row.teachRewardCheck = row.teachRewardCheck ? true : false;
    row.teachReward = row.teachRewardCheck ? ((parseFloat(row.coefficientMain ? row.coefficientMain : 0) + parseFloat(row.coefficientPosition ? row.coefficientPosition : 0)) * salaries.main * 25 / 100) : undefined;
    row.insuranceHealth = ((parseFloat(row.mainCoefficientSum) - parseFloat(row.coefficientArea ? row.coefficientArea : 0)) * salaries.main * 1.5 / 100);
    row.insuranceSocial = ((parseFloat(row.mainCoefficientSum) - parseFloat(row.coefficientArea ? row.coefficientArea : 0)) * salaries.main * 7 / 100);
    row.insuranceUnemployment = ((parseFloat(row.mainCoefficientSum) - parseFloat(row.coefficientArea ? row.coefficientArea : 0)) * salaries.main * 1 / 100);
    row.insuranceSum = (parseFloat(row.insuranceHealth) + parseFloat(row.insuranceSocial) + parseFloat(row.insuranceUnemployment));
    row.mainRemain = (parseFloat(row.mainSum) + parseFloat(row.teachReward ? row.teachReward : 0) - parseFloat(row.insuranceSum));
    row.addCoefficientSum = (parseFloat(row.coefficientMain ? row.coefficientMain : 0) + parseFloat(row.coefficientOverYear ? row.coefficientOverYear : 0) + parseFloat(row.coefficientArea ? row.coefficientArea : 0) + parseFloat(row.coefficientPosition ? row.coefficientPosition : 0));
    row.addSum = (parseFloat(row.addCoefficientSum) * salaries.add);
    row.addSum80 = row.addSum80Check ? ((parseFloat(row.addSum) * 80 / 100)) : undefined;
    row.addSum40 = !row.addSum80Check ? ((parseFloat(row.addSum) * 40 / 100)) : undefined;
    row.addRemain20 = row.addSum80Check ? ((parseFloat(row.addSum) * 20 / 100)) : undefined;
    row.addRemain = parseFloat(row.addSum80 ? row.addSum80 : 0) + parseFloat(row.addSum40 ? row.addSum40 : 0) + parseFloat(row.addSubDayOff ? row.addSubDayOff : 0);
    row.feeCoefficientSum = parseFloat(row.coefficientGovernment ? row.coefficientGovernment : 0) >= 1 ? (parseFloat(row.coefficientGovernment ? row.coefficientGovernment : 0) + parseFloat(row.coefficientParty ? row.coefficientParty : 0) * 30 / 100) : parseFloat(row.coefficientParty ? row.coefficientParty : 0);
    row.feeSum = parseFloat(row.feeCoefficientSum) * salaries.fee;
    row.feeAddSum = parseFloat(row.feeSum) + parseFloat(row.specialJob ? row.specialJob : 0);
    row.feeRemain = parseFloat(row.feeAddSum) - parseFloat(row.feeSubDayOff ? row.feeSubDayOff : 0);
    return row;
}

const calculateTeachRow = (row) => {
    row.subSum = (parseFloat(row.subTeach) + parseFloat(row.subResearch)).toFixed(2);
    row.lessonSum = (parseFloat(row.exchangedLessons) - parseFloat(row.subSum)).toFixed(2);
    row.sum = parseFloat(row.lessonSum) * 20000;
    return row;
}*/