require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const UserRoute = require("./routes/UserRoute");
const DepartmentRoute = require("./routes/DepartmentRoute");
const RoleRoute = require("./routes/RoleRoute");
const PermissionRoute = require("./routes/PermissionRoute");
const PostRoute = require("./routes/PostRoute");
const PostCommentRoute = require("./routes/PostCommentRoute");
const PostCommentReplyRoute = require("./routes/PostCommentReplyRoute");
const SalaryFeedbackRoute = require("./routes/SalaryFeedbackRoute");
const SalaryFeedbackReplyRoute = require("./routes/SalaryFeedbackReplyRoute");
const SalaryRoute = require("./routes/SalaryRoute");
const NotificationRoute = require("./routes/NotificationRoute");
const AuthRoute = require("./routes/AuthRoute");

mongoose.connect(process.env.DB_URL, () => console.log("MongoDB Connected"));

const app = express();
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}));
app.use(express.json({limit: "1mb"}));

app.use((req, res, next) => {
    req.headers.io = io;
    next();
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.ORIGIN,
        credentials: true,
    }
});

io.on("connection", (socket) => {
    console.log(`${socket.id} has connected`);
});

app.use('/users', UserRoute);
app.use('/roles', RoleRoute);
app.use('/departments', DepartmentRoute);
app.use('/permissions', PermissionRoute);
app.use('/posts', PostRoute);
app.use('/posts/:postId/comments', PostCommentRoute);
app.use('/posts/:postId/comments/:commentId/replies', PostCommentReplyRoute);
app.use('/salaries', SalaryRoute);
app.use('/salaries/:salaryId/feedbacks', SalaryFeedbackRoute);
app.use('/salaries/:salaryId/feedbacks/:feedbackId/replies', SalaryFeedbackReplyRoute);
app.use('/notifications', NotificationRoute);
app.use('/auth', AuthRoute);

httpServer.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`));
