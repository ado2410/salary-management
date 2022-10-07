const express = require("express");
const route = express.Router();
const AuthMiddleware = require("../middleware/AuthMiddleware");
const PermissionMiddleware = require("../middleware/PermissionMiddleware");
const {BaseUserModel, TeacherUserModel} = require("../models/UserModel");
const SalaryModel = require("../models/SalaryModel");
const PostModel = require("../models/PostModel");
const query = require("../utils/query");
const roles = require("../utils/roles");
const mongoose = require("mongoose");

route.use(AuthMiddleware);

route.get("/downloadTemplate", PermissionMiddleware("user-create"), (req, res) => {
    const file = `${__dirname}/../resources/files/user-template.xlsx`;
    res.download(file, "file.xlsx");
});

route.get("/", PermissionMiddleware("user-list"), async (req, res) => {
    try {
        let roleId = roles[req.query.type || "teacher"];

        let users;
        if (req.query.all) {
            if (req.query.type === "teacher") users = await TeacherUserModel.find({role: roleId}).select(["username", "name"]);
            else users = await BaseUserModel.find({role: roleId}).select(["username", "name"]);
        }
        else {
            if (req.query.type === "teacher") {
                users = await query.list(TeacherUserModel, {
                    find: {
                        role: roleId,
                    },
                    pagination: {
                        perPage: 10,
                        page: req.query.page,
                    },
                    search: {
                        keyword: req.query.keyword,
                        fields: ["username", "name.first", "name.last", "email", "gender", "address"],
                    },
                    filters: [
                        {
                            field: "department",
                            values: req.query.department?.split(",") || [],
                        },
                    ],
                    populates: [
                        {
                            path: "role",
                            select: ["name"],
                        },
                        {
                            path: "department",
                            select: ["name"],
                        },
                    ],
                });
            } else {
                users = await query.list(BaseUserModel, {
                    find: {
                        role: roleId,
                    },
                    pagination: {
                        perPage: 10,
                        page: req.query.page,
                    },
                    search: {
                        keyword: req.query.keyword,
                        fields: ["username", "name.first", "name.last", "email"],
                    },
                    filters: [
                        {
                            field: "username",
                            values: [],
                        },
                    ],
                    populates: [
                        {
                            path: "role",
                            select: ["name"],
                        },
                    ],
                });
            }
        }
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/:id", PermissionMiddleware("user-view"), async (req, res) => {
    try {
        const user = await query.view(BaseUser, req.params.id, {
            populates: [{ path: "role", select: "name" }],
        });

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.post("/import", async (req, res) => {
    try {
        req.body = req.body.map(user => {
            user.gender = user.gender === "Nam" ? "male" : user.gender === "Nữ" ? "female" : "";
            user.role = roles.teacher;
            return user;
        });
        const users = await TeacherUserModel.insertMany(req.body);
        return res.status(200).json(users);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", PermissionMiddleware("user-create"), async (req, res) => {
    try {
        req.body.role = roles[req.query.type];
        const user = await query.insert((req.query.type === undefined || req.query.type === "teacher") ? TeacherUserModel : BaseUserModel, req.body);

        res.status(200).json(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.put("/:id", PermissionMiddleware("user-update"), async (req, res) => {
    try {
        const user = await query.update((req.query.type === undefined || req.query.type === "teacher") ? TeacherUserModel : BaseUserModel, req.params.id, req.body);

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.delete("/:id", PermissionMiddleware("user-delete"), async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        let references = 0;
        references += await SalaryModel.find({
            $or: [
                {"user": id},
                {"salaries.main.data.user": id},
                {"salaries.teach.data.user": id},
                {"salaries.welfare.data.user": id},
                {"salaries.other.data.user": id},
                {"histories.user": id},
                {"feedbacks.user": id},
                {"feedbacks.replies.user": id},
            ]
        }).count();
        references += await PostModel.find({
            $or: [
                {"user": id},
                {"comments.user": id},
                {"comments.replies.user": id},
            ]
        }).count();

        if (references > 0) throw {name: "Reference", message: "Reference"};

        const user = await query.delete(BaseUserModel, req.params.id);

        res.status(200).json(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = route;
