const express = require("express");
const Joi = require("joi");
const route = express.Router();
const PermissionModel = require("../models/PermissionModel");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const validation = Joi.object({
    code: Joi.string().alphanum().required(),
    name: Joi.string().alphanum().min(4).max(20).required(),
    description: Joi.string(),
});

route.use(AuthMiddleware);

route.get("/", async (req, res) => {
    try {
        const permissions = await PermissionModel.find(); //.populate("Permission", "name");

        res.status(200).json(permissions);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.get("/:id", async (req, res) => {
    try {
        const permission = await PermissionModel.findById(req.params.id); //.populate("Permission", "name");

        res.status(200).json(permission);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", async (req, res) => {
    try {
        await validation.validate(req.body);

        const permission = new PermissionModel(req.body);
        await permission.save();

        res.status(200).json(permission);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.put("/:id", async (req, res) => {
    try {
        await validation.validate(req.body);

        const permission = await PermissionModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        );
        if (!permission) throw new Error();

        res.status(200).json(permission);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.delete("/:id", async (req, res) => {
    try {
        const permission = await PermissionModel.findOneAndDelete(
            { _id: req.params.id },
            req.body
        );
        if (!permission) throw new Error();

        res.status(200).json(permission);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = route;
