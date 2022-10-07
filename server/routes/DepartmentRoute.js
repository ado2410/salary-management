const express = require("express");
const query = require("../utils/query");
const Joi = require("joi");
const route = express.Router();
const DepartmentModel = require("../models/DepartmentModel");
const {BaseUserModel} = require("../models/UserModel");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const validation = Joi.object({
    name: Joi.string().alphanum().min(4).max(20).required(),
    description: Joi.string(),
});

route.use(AuthMiddleware);

route.get("/", async (req, res) => {
    try {
        if (req.query.all) {
            const users = await DepartmentModel.find().select(["name"]);
            return res.status(200).json(users);
        } else {
            let departments = await query.list(DepartmentModel, {
                pagination: {
                    perPage: 10,
                    page: req.query.page,
                },
                search: {
                    keyword: req.query.keyword,
                    fields: ["name"],
                },
            });
            let users = await BaseUserModel.find().lean();

            departments.data = departments.data.map((department) => {
                department.userCount = users.filter(user => user.department?.toString() === department._id.toString()).length;
                return department;
            });

            res.status(200).json(departments);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/:id", async (req, res) => {
    try {
        const department = await DepartmentModel.findById(req.params.id); //.populate("Permission", "name");

        res.status(200).json(department);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", async (req, res) => {
    try {
        await validation.validate(req.body);

        const department = new DepartmentModel(req.body);
        await department.save();

        res.status(200).json(department);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.put("/:id", async (req, res) => {
    try {
        const department = await query.update(DepartmentModel, req.params.id, req.body, validation);

        res.status(200).json(department);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.delete("/:id", async (req, res) => {
    try {
        const department = await DepartmentModel.findOneAndDelete(
            { _id: req.params.id },
            req.body
        );
        if (!department) throw new Error();

        res.status(200).json(department);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = route;
