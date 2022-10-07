import {useContext, useEffect, useState} from "react";
import {
    Avatar,
    Box,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography
} from "@mui/material";
import request from "../utils/request";
import {timeSince} from "../utils/date";
import context from "../utils/context";
import {useNavigate} from "react-router-dom";
function Notification(props) {

    const navigate = useNavigate();
    const {startLoading, stopLoading, isLoading, error} = useContext(context);
    const [notificationData, setNotificationData] = useState({});

    useEffect(() => {
        getNotifications().then(data => {
            setNotificationData(data);
            props.onItemsChange(data);
        });
    }, []);

    const getNotifications = (config = {search: null, page: 1}) => {
        let path = "/notifications?query";
        if (config.page) path += "&page=" + config.page;
        if (config.search) path += "&keyword=" + config.search;
        startLoading();
        return new Promise(((resolve, reject) => {
            request.get(path).then(res => {
                stopLoading();
                res.data.data = res.data.data.reverse();
                if (res.data.currentPage === res.data.lastPage)
                    res.data.endPage = true;
                resolve(res.data);
            }).catch(err => {
                stopLoading();
                reject(err)
                error("Tải xuống thông báo bị lỗi");
            });
        }));
    }

    const handleShowMoreNotification = () => {
        startLoading();
        getNotifications({search: notificationData.keyword, page: notificationData.currentPage + 1}).then(newPosts => {
            notificationData.data = notificationData.data.concat(newPosts.data);
            notificationData.currentPage = newPosts.currentPage;
            notificationData.endPage = newPosts.endPage;
            stopLoading();
            setNotificationData(notificationData);
        }).catch(() => {
            stopLoading();
            error("Tải xuống bài đăng mới bị lỗi");
        });
    }

    const handleClickNotification = (notification) => {
        switch (notification.type) {
            case "salary":
                navigate(`/salaries/${notification.ref._id}`);
                break;
            case "salary_feedback":
                navigate(`/salaries/${notification.ref.salary._id}?type=${notification.ref.type}`);
                break;
            case "salary_feedback_reply":
                navigate(`/salaries/${notification.ref.salary._id}?type=${notification.ref.type}`);
                break;
        }
        props.onClose();
    }

    return (
        <>
            <Typography variant="h6" sx={{ml: 1}}>Thông báo</Typography>
            <List sx={{width: 500}} dense>
                {notificationData?.data?.map((notification, index) =>
                    <ListItem key={index} disablePadding selected={!notification.seen}>
                        <ListItemButton onClick={() => handleClickNotification(notification)}>
                            <ListItemAvatar>
                                <Avatar>{notification.user.name.last.charAt(0)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography>
                                        <b>{notification.user.name.first} {notification.user.name.last}</b>{" "}
                                        {notification.type === "post" ? <>đã đăng một bài viết</>
                                            : notification.type === "post_comment" ? <>đã bình luận một bài viết</>
                                                : notification.type === "post_comment_reply" ? <>đã trả lời bình luận của bạn</>
                                                    : notification.type === "salary" ? <>đã thêm một dữ liệu lương mới</>
                                                        : notification.type === "salary_feedback" ? <>đã thêm một phản hồi mới</>
                                                            : notification.type === "salary_feedback_reply" ? <>đã trả lời phản hồi của bạn</>
                                                                : notification.type === "salary_history" ? <>đã chỉnh sửa dữ liệu lương</>
                                                                    : <>hành động chưa biết rõ</>
                                        }
                                    </Typography>
                                }
                                secondary={<Typography>{timeSince(new Date(notification.createdAt))}</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>
                )}

                {!notificationData.endPage ?
                    <Box sx={{display: "flex", justifyContent: "center"}}>
                        <Button disabled={isLoading} onClick={handleShowMoreNotification}>Xem thêm</Button>
                    </Box>
                    : <></>
                }

                {!isLoading && notificationData.endPage ?
                    <Typography textAlign="center">Đã xem hết thông báo</Typography>
                    : <></>
                }

                {!isLoading && notificationData?.data?.length === 0 ?
                    <Typography textAlign="center">Không tìm thấy thông báo</Typography>
                    : <></>
                }
            </List>

        </>
    );
}

export default Notification;