const express = require("express");
const Joi = require("joi");
const route = express.Router({mergeParams: true});
const PostModel = require("../models/PostModel");
const {BaseUserModel} = require("../models/UserModel");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const PermissionMiddleware = require("../middleware/PermissionMiddleware");
const NotificationModel = require("../models/NotificationModel");

const validation = Joi.object({
    content: Joi.string().required(),
});

route.use(AuthMiddleware);

route.get("/", PermissionMiddleware("comment-list"), async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.postId).select("comments");
        const comment = post.comments.id(req.params.commentId).replies;

        res.status(200).json(comment);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.get("/:id", PermissionMiddleware("comment-view"), async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.postId).select("comments"); //.populate("role", "name");
        const reply = post.comments.id(req.params.commentId).replies.id(req.params.id);

        res.status(200).json(reply);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", PermissionMiddleware("comment-create"), async (req, res) => {
    try {
        await validation.validate(req.body);

        req.body.user = req.headers.auth._id;

        let post = await PostModel.findById(req.params.postId).select("comments");
        post.comments.id(req.params.commentId).replies.push(req.body);
        await post.save();

        post = await PostModel.findById(req.params.postId);
        post = await BaseUserModel.populate(post, "comments.replies.user");
        const comment = post.comments.id(req.params.commentId);
        const reply = comment.replies[comment.replies.length - 1];

        let notification = new NotificationModel({
            type: "post_comment_reply",
            ref: [post._id, comment._id, reply._id],
        });
        await notification.save();

        res.status(200).json(reply);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.put("/:id", PermissionMiddleware("comment-update"), async (req, res) => {
    try {
        await validation.validate(req.body);

        let post = await PostModel.findById(req.params.postId).select("comments"); //.populate("role", "name");
        post.comments.id(req.params.commentId).replies.id(req.params.id).content = req.body.content;
        post.save();

        post = await BaseUserModel.populate(post, "comments.replies.user");
        const reply = post.comments.id(req.params.id).replies.id(req.params.id);

        res.status(200).json(reply);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.delete("/:id", PermissionMiddleware("comment-delete"), async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.postId).select("comments"); //.populate("role", "name");
        const reply = post.comments.id(req.params.commentId).replies.pull(req.params.id)
        post.save();

        res.status(200).json(reply);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = route;
