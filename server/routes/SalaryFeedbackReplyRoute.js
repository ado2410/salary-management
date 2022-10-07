const express = require("express");
const Joi = require("joi");
const route = express.Router({mergeParams: true});
const AuthMiddleware = require("../middleware/AuthMiddleware");
const SalaryModel = require("../models/SalaryModel");
const roles = require("../utils/roles");
const hasRole = require("../utils/hasRole");
const NotificationModel = require("../models/NotificationModel");

const validation = Joi.object({
    message: Joi.string().required(),
});

const hasReply = async (userId, salaryId, feedbackId, replyId) => {
    const salary = await SalaryModel.findById(salaryId);
    const feedback = salary.feedbacks.id(feedbackId);

    if (!salary || !feedback)
        return false;

    if (feedback.user.valueOf() !== userId)
        return false;

    const reply = feedback.replies.id(replyId);

    if (!reply)
        return false;

    if (reply.user.valueOf() === userId)
        return true;
    return false;
}

route.use(AuthMiddleware);

route.get("/", async (req, res) => {
    try {
        let salary = await SalaryModel.findById(req.params.salaryId);
        const replies = salary.feedbacks.id(req.params.feedbackId).replies;

        res.status(200).json(replies);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.get("/:id", async (req, res) => {
    try {
        const feedback = await SalaryModel.findById(req.params.feedbackId).select("replies"); //.populate("role", "name");

        res.status(200).json(feedback.replies.id(req.params.id));
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", async (req, res) => {
    try {
        await validation.validate(req.body);

        req.body.user = req.headers.auth._id;

        let salary = await SalaryModel.findById(req.params.salaryId);
        salary.feedbacks.id(req.params.feedbackId).replies.push(req.body);
        await salary.save();

        salary = await SalaryModel.findById(req.params.salaryId);
        salary = await salary.populate("feedbacks.replies.user");
        const feedback = salary.feedbacks.id(req.params.feedbackId);
        const reply = feedback.replies[feedback.replies.length - 1];

        let notification = new NotificationModel({
            type: "salary_feedback_reply",
            ref: [salary._id, feedback._id, reply._id],
        });
        await notification.save();

        res.status(200).json(reply);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.put("/:id", async (req, res) => {
    try {
        await validation.validate(req.body);

        const auth = req.headers.auth;
        if (await hasRole(auth._id, roles.teacher) && !await hasReply(auth._id, req.params.salaryId, req.params.feedbackId, req.params.id))
            throw {name: "PermissionLimited", message: "Permission limited"};

        let salary = await SalaryModel.findById(req.params.salaryId);
        salary.feedbacks.id(req.params.feedbackId).replies.id(req.params.id).content = req.body.content;
        await salary.save();

        salary = await SalaryModel.findById(req.params.salaryId).populate("feedbacks.replies.user");

        const reply = salary.feedbacks.id(req.params.feedbackId).replies.id(req.params.id);

        if (!reply) throw {name: "ReplyNotFound", message: "Reply not found"};

        res.status(200).json(reply);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.delete("/:id", async (req, res) => {
    try {
        const auth = req.headers.auth;
        if (await hasRole(auth._id, roles.teacher) && !await hasReply(auth._id, req.params.salaryId, req.params.feedbackId, req.params.id))
            throw {name: "PermissionLimited", message: "Permission limited"};

        const salary = await SalaryModel.findById(req.params.salaryId);
        const reply = salary.feedbacks.id(req.params.feedbackId).replies.pull(req.params.id);
        await salary.save();

        res.status(200).json(reply);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

module.exports = route;
