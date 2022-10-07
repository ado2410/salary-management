const express = require("express");
const Joi = require("joi");
const route = express.Router();
const SalaryModel = require("../models/SalaryModel");
const query = require("../utils/query");
const {BaseUserModel} = require("../models/UserModel");
const mongoose = require("mongoose");
const AuthMiddleware = require("../middleware/AuthMiddleware");
const PermissionMiddleware = require("../middleware/PermissionMiddleware");
const NotificationModel = require("../models/NotificationModel");
const SettingModel = require("../models/SettingModel");
const mailer = require("../utils/mailer");

const validation = Joi.object({
    period: Joi.object({
        month: Joi.number().required(),
        year: Joi.number().required(),
    }),
});

const getSalary = async (req, res) => {
    if (req.headers.auth.role.code === "teacher") {
        const match = req.params.id ? {
            "_id": mongoose.Types.ObjectId(req.params.id),
        } : {};

        let salary = await SalaryModel.aggregate([
            {
                $match: match,
            },
            {
                $project: {
                    period: 1,
                    salaries: {
                        main: {
                            _id: "$salaries.main._id",
                            mainSalary: "$salaries.main.mainSalary",
                            addSalary: "$salaries.main.addSalary",
                            feeSalary: "$salaries.main.feeSalary",
                            data: {
                                $first: {
                                    $filter: {
                                        input: "$salaries.main.data",
                                        as: "data",
                                        cond: {$eq: ["$$data.user", mongoose.Types.ObjectId(req.headers.auth._id)]},
                                    }
                                }
                            }
                        },
                        teach: {
                            _id: "$salaries.teach._id",
                            name: "$teach.name",
                            data: {
                                $first: {
                                    $filter: {
                                        input: "$salaries.teach.data",
                                        as: "data",
                                        cond: {$eq: ["$$data.user", mongoose.Types.ObjectId(req.headers.auth._id)]},
                                    }
                                },
                            }
                        },
                        guide: {
                            _id: "$salaries.guide._id",
                            name: "$guide.name",
                            data: {
                                $filter: {
                                    input: "$salaries.guide.data",
                                    as: "data",
                                    cond: {$eq: ["$$data.user", mongoose.Types.ObjectId(req.headers.auth._id)]},
                                }
                            }
                        },
                        welfare: {
                            $map: {
                                input: "$salaries.welfare",
                                as: "welfare",
                                in: {
                                    _id: "$$welfare._id",
                                    name: "$$welfare.name",
                                    data: {
                                        $first: {
                                            $filter: {
                                                input: "$$welfare.data",
                                                as: "data",
                                                cond: {$eq: ["$$data.user", mongoose.Types.ObjectId(req.headers.auth._id)]},
                                            }
                                        },
                                    }
                                }
                            }
                        },
                        other: {
                            $map: {
                                input: "$salaries.other",
                                as: "other",
                                in: {
                                    _id: "$$other._id",
                                    name: "$$other.name",
                                    data: {
                                        $first: {
                                            $filter: {
                                                input: "$$other.data",
                                                as: "data",
                                                cond: {$eq: ["$$data.user", mongoose.Types.ObjectId(req.headers.auth._id)]},
                                            }
                                        }
                                    }
                                }
                            }
                        },
                    },
                }
            },
            {
                $sort: {
                    "period.year": -1,
                    "period.month": -1,
                }
            }
        ]);

        salary = (await BaseUserModel.populate(salary, "user salaries.main.data.user salaries.teach.data.user salaries.guide.data.user salaries.welfare.data.user salaries.other.data.user"))[0];

        if (!salary) throw {name: "SalaryNotFound", message: "Salary not found"};

        return salary;
    } else {
        let salary = await SalaryModel.findById(req.params.id)
            .select({
                user: 1,
                period: 1,
                salaries: 1,
                mainRemain: {$sum: "$salaries.main.data.mainRemain.value"},
                addRemain: {$sum: "$salaries.main.data.addRemain.value"},
                feeRemain: {$sum: "$salaries.main.data.feeRemain.value"},
                teachSum: {$sum: "$salaries.teach.data.sum.value"},
                guideSum: {$sum: "$salaries.guide.data.sum.value"},
            });
        salary = (await BaseUserModel.populate(salary, {path: "user salaries.main.data.user salaries.teach.data.user salaries.guide.data.user salaries.welfare.data.user salaries.other.data.user"}));

        if (!salary) throw {name: "IdNotFound", message: "Id not found"};

        salary = salary.toObject();
        salary.welfareSum = salary.salaries.welfare?.map(welfare => welfare.data.reduce((prev, row) => prev + row.sum.value, 0));
        salary.otherSum = salary.salaries.other?.map(other => other.data.reduce((prev, row) => prev + row.sum.value, 0));

        return salary;
    }
}

route.use(AuthMiddleware);

route.get("/canInsert", PermissionMiddleware("salary-create"), async (req, res) => {
    try {
        let status = true;
        const salaries = await SalaryModel.find({"period.month": req.query.month, "period.year": req.query.year});
        if (salaries.length === 0) status = true;
        else {
            const salary = salaries[0];
            switch (req.query.type) {
                case "main":
                    if (salary.salaries?.main?.data?.length) status = false;
                    break;
                case "teach":
                    if (salary.salaries?.teach?.data?.length) status = false;
                    break;
                case "guide":
                        if (salary.salaries?.guide?.data?.length) status = false;
                    break;
            }
        }

        return res.status(200).json({status: status});
    } catch (e) {
        console.log(e)
        return res.status(400).json(e);
    }
});

route.get("/getStructs", async (req, res) => {
    try {
        const setting = await SettingModel.findOne({});
        if (!setting) throw {name: "SalaryStructNotExisted", message: "Salary struct not existed"}
        res.status(200).json(setting.salaryStructs);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/", PermissionMiddleware("salary-list"), async (req, res) => {
    try {
        let salaries = await SalaryModel.aggregate([
            {
                $group: {
                    _id: "$_id",
                    user: {$first: "$user"},
                    period: {$first: "$period"},
                    sum: {$sum: {$sum: "$salaries.main.data.mainRemain.value"}},
                    createdAt: {$first: "$createdAt"},
                    updatedAt: {$first: "updatedAt"},
                },
            },
        ]).sort({"period.year": -1, "period.month": -1});

        salaries = await BaseUserModel.populate(salaries, {path: "user"});

        res.status(200).json(salaries);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/:id/histories", async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.id).populate("histories.user");

        if (!salary)
            throw {name: "SalaryNotFound", message: "Salary not found"};

        const histories = salary.histories;
        res.status(200).json(histories);
    } catch(error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/newest", async (req, res) => {
    try {
        const newestSalary = await SalaryModel.findOne().sort({"period.year": -1, "period.month": -1});
        req.params.id = newestSalary._id;
        const salary = await getSalary(req, res);
        res.status(200).json(salary);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

route.get("/:id", PermissionMiddleware("salary-view"), async (req, res) => {
    try {
        const salary = await getSalary(req, res);

        res.status(200).json(salary);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.get("/:id/sendMail", PermissionMiddleware("salary-create"), async (req, res) => {
    try {
        let salary = await query.view(
            SalaryModel,
            req.params.id,
            {
                populates: [
                    {path: "user salaries.main.data.user salaries.teach.data.user salaries.guide.data.user salaries.welfare.data.user salaries.other.data.user"}
                ],
            }
        );
        salary = JSON.parse(JSON.stringify(salary));
        
        let salaryType = req.query.type;

        if (["add", "fee"].includes(salaryType)) salaryType = "main";

        const period = salary.period;

        if (!salary.salaries[salaryType]) throw {name: "NotFound", message: "Salary type not found"};

        let data = [];
        let name = '';
        let users = [];

        if (["welfare", "other"].includes(req.query.type)) {
            data = salary.salaries[salaryType];

            const tempData = data.reduce((prev, item) => prev.concat(item.data), []);

            users = tempData.reduce((prevUsers, item) => {
                if (!prevUsers.some(prevUser => prevUser?._id === item.user?._id))
                    prevUsers.push(item.user);
                return prevUsers;
            }, []).slice(0, 1);
        } else {
            data = salary.salaries[salaryType].data;
            users = data.reduce((prevUsers, item) => {
                if (!prevUsers.some(prevUser => prevUser._id === item.user._id))
                    prevUsers.push(item.user);
                return prevUsers;
            }, []).slice(0, 1);
        }

        switch (req.query.type) {
            case "main":
                for (const item of data) {
                    await mailer.sendMailTemplate(item.user.email, `Lương chính tháng ${period.month} ${period.year}`, req.query.type, {period: period, data: item});
                };
                break;
            case "add":
                for (const item of data) {
                    await mailer.sendMailTemplate(item.user.email, `Lương tăng thêm tháng ${period.month} ${period.year}`, req.query.type, {period: period, data: item});
                };
                break;
            case "fee":
                for (const item of data) {
                    await mailer.sendMailTemplate(item.user.email, `Quản lý phí tháng ${period.month} ${period.year}`, req.query.type, {period: period, data: item});
                };
                break;
            case "teach":
                name = salary.salaries[req.query.type].name;
                for (const item of data) {
                    await mailer.sendMailTemplate(item.user.email, name, req.query.type, {name: name, period: period, data: item});
                };
                break;
            case "guide":
                name = salary.salaries[req.query.type].name;
                for (const user of users) {
                    const items = data.filter(item => item.user._id === user._id);
                    const sum = items.reduce((sum, item) => sum + item.sum.value, 0);
                    await mailer.sendMailTemplate(user.email, name, req.query.type, {name: name, period: period, user: user, data: items, sum: sum});
                };
                break;
            case "welfare":
                for (const user of users) {
                    let items = [];
                    let sum = 0;
                    for (const welfare of data) {
                        name = welfare.name;
                        items = items.concat(
                            welfare.data.filter(welfare => welfare.user?._id === user._id).map(welfare => {
                                welfare.name = name;
                                return welfare;
                            })
                        );
                        items.reduce((sum, item) => sum + item.sum.value, 0);
                    };
                    await mailer.sendMailTemplate(user.email, "Phúc lợi tháng ${period.month} ${period.year}", req.query.type, {user: user, period: period, data: items, sum: sum});
                }
                break;
            case "other":
                    for (const user of users) {
                        let items = [];
                        let sum = 0;
                        for (const other of data) {
                            name = other.name;
                            items = items.concat(
                                other.data.filter(other => other.user?._id === user._id).map(other => {
                                    other.name = name;
                                    return other;
                                })
                            );
                            items.reduce((sum, item) => sum + item.sum.value, 0);
                        };
                        await mailer.sendMailTemplate("adork2410@gmail.com", `Lương khác tháng ${period.month} ${period.year}`, req.query.type, {user: user, period: period, data: items, sum: sum});
                    }
                    break;
        }

        res.status(200).json({status: 'success'});
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.post("/", PermissionMiddleware("salary-create"), async (req, res) => {
    try {
        req.body.user = req.headers.auth._id;

        let salary = await SalaryModel.findOne({
            "period.month": req.body.period.month,
            "period.year": req.body.period.year
        });

        if (salary === null)
            salary = await query.insert(SalaryModel, req.body, validation);
        else {
            req.body.salaries.main ? salary.salaries.main = req.body.salaries.main : null;
            req.body.salaries.teach ? salary.salaries.teach = req.body.salaries.teach : null;
            req.body.salaries.guide ? salary.salaries.guide = req.body.salaries.guide : null;
            req.body.salaries.welfare ? (salary.salaries.welfare ? salary.salaries.welfare.push(...req.body.salaries.welfare) : salary.salaries.welfare = req.body.salaries.welfare) : null;
            req.body.salaries.other ? (salary.salaries.other ? salary.salaries.other.push(...req.body.salaries.other) : salary.salaries.other = req.body.salaries.other) : null;
            salary = await salary.save();
        }

        let notification = new NotificationModel({
            type: "salary",
            ref: [salary._id],
        });
        await notification.save();

        res.status(200).json(salary);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
});

route.put("/:id", PermissionMiddleware("salary-update"), async (req, res) => {
    try {
        await validation.validate(req.body);

        let salary = await SalaryModel.findById(req.params.id);
        if (req.body.changes.length > 0) {
            salary.salaries = req.body.salaries;

            req.body.histories = {
                user: req.headers.auth._id,
                changes: req.body.changes,
            }
            salary.histories.push(req.body.histories);
            await salary.save();

            let history = salary.histories[salary.histories.length -1];

            let notification = new NotificationModel({
                type: "salary_history",
                ref: [salary._id, history._id],
            });
            await notification.save();
        }

        salary = await BaseUserModel.populate(salary, {path: "histories.user"});

        if (!salary) throw {name: "SalaryNotFound", message: "Salary not found"};

        res.status(200).json(salary.histories);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.delete("/:id", PermissionMiddleware("salary-delete"), async (req, res) => {
    try {
        let salary = null;
        let type = req.query.type;
        let index = req.query.index;
        if (type) {
            salary = await SalaryModel.findById(req.params.id);
            if (index && ["welfare", "other"].includes(type)) salary.salaries[type].pull(salary.salaries[type][index]._id);
            else salary.salaries[type] = null;
            salary.save();
        } else {
            salary = await SalaryModel.findOneAndDelete(
                {_id: req.params.id},
                req.body
            );
        }
        if (!salary) throw {name: "SalaryNotFound", message: "Salary not found"};

        res.status(200).json(salary);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.post("/updateStructs", async (req, res) => {
    try {
        const settings = await SettingModel.find({});

        if (settings.length === 0) {
            const setting = new SettingModel({salaryStructs: req.body});
            await setting.save();
        } else {
            settings[0].salaryStructs = req.body;
            await settings[0].save();
        }

        res.status(200).json(settings.salaryStructs);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

module.exports = route;
