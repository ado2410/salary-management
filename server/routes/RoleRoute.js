const express = require("express");
const Joi = require("joi");
const route = express.Router();
const RoleModel = require("../models/RoleModel");
const PermissionModel = require("../models/PermissionModel");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const PermissionMiddleware = require("../middleware/PermissionMiddleware");

const validation = Joi.object({
    name: Joi.string().alphanum().min(4).max(20).required(),
    description: Joi.string().alphanum(),
});

route.use(AuthMiddleware);

route.get("/", PermissionMiddleware("role-list"), async (req, res) => {
    try {
        const roles = await RoleModel.find().populate("permissions", [ "code", "name"]);

        res.status(200).json(roles);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/:id", PermissionMiddleware("role-view"), async (req, res) => {
    try {
        const role = await RoleModel.findById(req.params.id); //.populate("Permission", "name");

        res.status(200).json(role);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", PermissionMiddleware("role-create"), async (req, res) => {
    try {
        await validation.validate(req.body);

        const role = new RoleModel(req.body);
        await role.save();

        res.status(200).json(role);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.put("/", PermissionMiddleware("role-update"), async (req, res) => {
    try {
        const roleCode = req.body.roleCode;
        const permissionCode = req.body.permissionCode;
        const checked = req.body.checked;
        const role = await RoleModel.findOne({code: roleCode}).populate("permissions");
        const permission = await PermissionModel.findOne({code: permissionCode});
        const hasPermission = role.permissions.filter(permission => permission.code === permissionCode)[0];
        if (hasPermission && !checked)
            role.permissions.pull(permission._id);
        else if (!hasPermission && checked)
            role.permissions.push(permission._id);
        await role.save();

        res.status(200).json({});
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

route.put("/:id", PermissionMiddleware("role-update"), async (req, res) => {
    try {
        await validation.validate(req.body);

        const role = await RoleModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body
        );
        if (!role) throw new Error();

        res.status(200).json(role);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.delete("/:id", PermissionMiddleware("role-delete"), async (req, res) => {
    try {
        const role = await RoleModel.findOneAndDelete(
            { _id: req.params.id },
            req.body
        );
        if (!role) throw new Error();

        res.status(200).json(role);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = route;
