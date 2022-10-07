const express = require("express");
const Joi = require("joi");
const route = express.Router();
const PostModel = require("../models/PostModel");
const {BaseUserModel} = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");
const query = require("../utils/query");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const PermissionMiddleware = require("../middleware/PermissionMiddleware");
const {sendMail} = require("../utils/mailer");

route.use(AuthMiddleware);

route.get("/", PermissionMiddleware("post-list"), async (req, res) => {
    try {
        let posts = await query.list(PostModel, {
            search : {keyword: req.query.keyword, fields: ["title", "content", "user.first", "user.last"]},
            pagination: {page: req.query.page, perPage: 3},
            populates: [{path: "user comments.user comments.replies.user"}],
        });

        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/:id", PermissionMiddleware("post-view"), async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id); //.populate("Permission", "name");

        res.status(200).json(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", PermissionMiddleware("post-create"), async (req, res) => {
    try {
        req.body.user = req.headers.auth._id;

        let post = new PostModel(req.body);
        await post.save();
        post = await BaseUserModel.populate(post, "user");

        let content = "";
        req.body.content.split(/\n/).map(paraph => content += `<p>${paraph}</p>`);

        if (req.body.sendMail) await sendMail("adork2410@gmail.com", req.body.title, content);

        let notification = new NotificationModel({
            type: "post",
            ref: [post._id],
        });
        await notification.save();

        res.status(200).json(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.put("/:id", PermissionMiddleware("post-update"), async (req, res) => {
    try {
        let post = await query.update(PostModel, req.params.id, req.body);
        post = await BaseUserModel.populate(post, "user");

        res.status(200).json(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.delete("/:id", PermissionMiddleware("post-delete"), async (req, res) => {
    try {
        const post = await query.delete(PostModel, req.params.id);

        res.status(200).json(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = route;
