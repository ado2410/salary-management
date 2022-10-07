const express = require("express");
const Joi = require("joi");
const route = express.Router({mergeParams: true});
const AuthMiddleware = require("../middleware/AuthMiddleware");
const PermissionMiddleware = require("../middleware/PermissionMiddleware");
const SalaryModel = require("../models/SalaryModel");
const roles = require("../utils/roles");
const hasRole = require("../utils/hasRole");
const NotificationModel = require("../models/NotificationModel");

const validation = Joi.object({
    content: Joi.string().required(),
});

const hasFeedback = async (userId, salaryId, feedbackId) => {
    const salary = await SalaryModel.findById(salaryId);
    const feedback = salary.feedbacks.id(feedbackId);

    if (!salary || !feedback)
        return false;

    if (feedback.user.valueOf() === userId)
        return true;
    return false;
}

route.use(AuthMiddleware);

route.get("/", PermissionMiddleware("feedback-list"), async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.salaryId).select("feedbacks").populate("feedbacks.user feedbacks.replies.user");

        let feedbacks = salary.feedbacks;

        if (await hasRole(req.headers.auth._id, roles.teacher))
            feedbacks = salary.feedbacks.filter(feedback => feedback.user._id.valueOf() === req.headers.auth._id);

        res.status(200).json(feedbacks);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/:id", PermissionMiddleware("feedback-view"), async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.salaryId);

        res.status(200).json(salary.feedbacks.id(req.params.id));
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", PermissionMiddleware("feedback-create"), async (req, res) => {
    try {
        await validation.validate(req.body);

        req.body.user = req.headers.auth._id;

        let salary = await SalaryModel.findById(req.params.salaryId);
        salary.feedbacks.push(req.body);
        await salary.save();

        salary = await SalaryModel.findById(req.params.salaryId).populate("feedbacks.user");
        const feedback = salary.feedbacks[salary.feedbacks.length -1];

        let notification = new NotificationModel({
            type: "salary_feedback",
            ref: [salary._id, feedback._id],
        });
        await notification.save();

        res.status(200).json(feedback);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.put("/:id", PermissionMiddleware("feedback-update"), async (req, res) => {
    try {
        await validation.validate(req.body);

        const auth = req.headers.auth;
        if (await hasRole(auth._id, roles.teacher) && !await hasFeedback(auth._id, req.params.salaryId, req.params.id))
            throw {name: "PermissionLimited", message: "Permission limited"};

        let salary = await SalaryModel.findById(req.params.salaryId);
        salary.feedbacks.id(req.params.id).content = req.body.content;
        await salary.save();

        salary = await SalaryModel.findById(req.params.salaryId).populate("feedbacks.user");

        let feedback = salary.feedbacks.id(req.params.id);

        if (!feedback) throw {name: "FeedbackReplyNotFound", message: "Feedback reply not found"};

        res.status(200).json(feedback);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.delete("/:id", PermissionMiddleware("feedback-delete"), async (req, res) => {
    try {
        const auth = req.headers.auth;
        if (await hasRole(auth._id, roles.teacher) && !await hasFeedback(auth._id, req.params.salaryId, req.params.id))
            throw {name: "PermissionLimited", message: "Permission limited"};

        const salary = await SalaryModel.findById(req.params.salaryId);
        const feedback = salary.feedbacks.pull(req.params.id);
        await salary.save();

        res.status(200).json(feedback);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

module.exports = route;
