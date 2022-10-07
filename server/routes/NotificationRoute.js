const express = require("express");
const route = express.Router();
const NotificationModel = require("../models/NotificationModel");
const PostModel = require("../models/PostModel");
const {BaseUserModel} = require("../models/UserModel");
const SalaryModel = require("../models/SalaryModel");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const roles = require("../utils/roles");
const query = require("../utils/query");

route.use(AuthMiddleware);

route.get("/", async (req, res) => {
    try {
        const auth = req.headers.auth;

        let notificationData = await query.list(NotificationModel, {
            pagination: {page: req.query.page, perPage: 20},
        });

        let outNotificationData = {...notificationData, data: []};

        let posts = await PostModel.find({});
        let salaries = await SalaryModel.find({}, {user: 1, feedbacks: 1, histories: 1});

        await Promise.all(
            notificationData.data.map(async notification => {
                let outNotification = notification;
                let ref = notification.ref;

                var post = posts.filter(post => post._id.toString() === ref[0].toString())[0];
                if (post) var postComment = post.comments.id(ref[1]);
                if (postComment) var postCommentReply = postComment.replies.id(ref[2]);

                var salary = salaries.filter(salary => salary._id.toString() === ref[0].toString())[0];
                if (salary) var salaryFeedback = salary.feedbacks.id(ref[1]);
                if (salaryFeedback) var salaryFeedbackReply = salaryFeedback.replies.id(ref[2]);

                if (salary) var salaryHistory = salary.histories.id(ref[1]);

                switch (notification.type) {
                    case "post":
                        if (!post) return;
                        if (post.user.toString() === auth._id) return;
                        outNotification.ref = post;
                        outNotification.user = post.user;
                        break;
                    case "post_comment":
                        if (!post || !postComment) return;
                        if (post.user.toString() !== auth._id) return;
                        if (postComment.user.toString() === auth._id) return;
                        outNotification.ref = postComment;
                        outNotification.user = postComment.user;
                        break;
                    case "post_comment_reply":
                        if (!post || !postComment || !postCommentReply) return;
                        if (auth._id === postCommentReply.user.toString()) return;
                        if (postComment.replies.filter(reply => auth._id === reply.user.toString()).length === 0 && auth._id !== postComment.user.toString()) return;

                        outNotification.ref = postCommentReply;
                        outNotification.user = postCommentReply.user;
                        break;
                    case "salary":
                        if (!salary) return;
                        if (salary.user.toString() === auth._id) return;
                        outNotification.ref = salary;
                        outNotification.user = salary.user;
                        break;
                    case "salary_feedback":
                        if (!salary || !salaryFeedback) return;
                        if (auth.role._id === roles.teacher && salary.user.toString() !== auth._id) return;
                        salaryFeedback = salaryFeedback.toObject();
                        salaryFeedback.salary = {_id: salary._id};
                        outNotification.ref = salaryFeedback;
                        outNotification.user = salaryFeedback.user;
                        break;
                    case "salary_feedback_reply":
                        if (!salary || !salaryFeedback || !salaryFeedbackReply) return;
                        if (auth._id === salaryFeedbackReply.user.toString()) return;
                        if (salaryFeedback.replies.filter(reply => auth._id === reply.user.toString()).length === 0 && auth._id !== salaryFeedback.user.toString()) return;

                        salaryFeedbackReply = salaryFeedback.toObject();
                        salaryFeedback.salary = {_id: salary._id};
                        salaryFeedbackReply.salary = {_id: salary._id};
                        salaryFeedbackReply.feedback = salaryFeedback;
                        salaryFeedbackReply.ref = salaryFeedbackReply;
                        outNotification.user = salaryFeedbackReply.user;
                        break;
                    case "salary_history":
                        if ((auth._id === salaryHistory.user.toString() && auth.role._id !== roles.teacher)) return;

                        outNotification.ref = salaryHistory;
                        outNotification.user = salaryHistory.user;
                        break;
                }
                outNotificationData.data.push(outNotification);
            })
        );

        outNotificationData.data = outNotificationData.data.sort((first, second) => first.createdAt < second.createdAt ? -11 : 1);

        outNotificationData.data = await BaseUserModel.populate(outNotificationData.data, "user");

        res.status(200).json(outNotificationData);
    } catch (error) {
        console.log(error);
        res.status(200).json(error);
    }
});

module.exports = route;