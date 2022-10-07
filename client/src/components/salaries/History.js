import {Avatar, Box, Divider, Typography} from "@mui/material";
import {timeSince} from "../../utils/date";
import {useContext, useEffect, useState} from "react";
import request from "../../utils/request";
import context from "../../utils/context";
import {columns} from "../../utils/datagrid";

function History(props) {
    const {show, salaryId, currentSalary, salaryType} = props;
    const {startLoading, stopLoading, success, error, role, roles} = useContext(context);
    const [histories, setHistories] = useState([]);
    const [currentHistories, setCurrentHistories] = useState([]);

    useEffect(() => {
        if (salaryId) getHistories().then(data => setHistories(data));
    }, [salaryId]);

    useEffect(() => {
        const currentFeedbacks = getCurrentHistories(histories, salaryType);
        setCurrentHistories(currentFeedbacks);
    }, [histories, salaryId, currentSalary, salaryType]);

    const getHistories = () => {
        startLoading();
        return new Promise((resolve, reject) => {
            request.get(`/salaries/${salaryId}/histories`).then(res => {
                resolve(res.data.reverse());
                stopLoading();
            }).catch(err => {
                reject(err);
                stopLoading();
                error("Lỗi khi tải xuống lịch sử");
            });
        });
    }

    const getCurrentHistories = (histories) => {
        histories = histories ? histories.reduce((newHistories, history) => {
            history = {...history};
            let changes = history.changes.filter(change => change.type === salaryType);
            if (["welfare", "other"].includes(salaryType)) {
                changes = changes.filter(history => history.salaryRef === currentSalary._id);
            }
            history.changes = changes;
            if (changes.length > 0)
                newHistories.push(history);
            return newHistories;
        }, []) : [];

        histories.map(history => {
            history = {...history};
            history.changes = history.changes.map(change => {
                if (Array.isArray(currentSalary?.data)) change.username = currentSalary?.data?.filter(data => data._id === change.rowRef)[0]?.user?.username;
                else change.username = currentSalary?.data?.user?.username;

                change.columnLabel = columns[salaryType]?.filter(column => column.field === change.column)[0]?.headerName;
                return change;
            });
            return history;
        })

        return histories;
    }

    return (
        <Box sx={{display: show ? "flex" : "none", width: "100%", height: "100%", flexDirection: "column"}}>
            <Divider />
            <Box sx={{flexGrow: 1, height: 0, overflowY: "auto"}}>
                {currentHistories.map((history, historyIndex) =>
                    <>
                        <Divider />
                        <Box key={historyIndex} sx={{display: "flex", mt: 1}}>
                            <Avatar sx={{mr: 1}}>{history.user.name.last.charAt(0)}</Avatar>
                            <Box xs={{flex: 1}}>
                                <Typography sx={{fontWeight: "bold"}}>{history.user.name.first} {history.user.name.last} ({roles[history.user.role].label})</Typography>
                                <Typography variant="body2">{timeSince(new Date(history.createdAt))}</Typography>
                                {history.changes.map((change, changeIndex) =>
                                    <>
                                        <Typography sx={{fontWeight: "bold"}}>{role.name === 'teacher' ? change.columnLabel : `(${change.username}, ${change.columnLabel})`}</Typography>
                                        <Typography>Giá trị cũ: {change.oldValue.value}</Typography>
                                        <Typography>Giá trị mới: {change.newValue.value}</Typography>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </>
                )}
                {currentHistories?.length === 0 ?
                    <Typography sx={{mt: 1, textAlign: "center"}}>Chưa có dữ liệu</Typography>
                    : <></>
                }
            </Box>
        </Box>
    );
}

export default History;