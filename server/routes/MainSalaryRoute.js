const express = require("express");
const Joi = require("joi");
const route = express.Router({ mergeParams: true });
const SalaryModel = require("../models/SalaryModel");
const AuthMiddleware = require("../middleware/AuthMiddleware");

const validation = Joi.object({
    code: Joi.number().required(),
    newLevel: Joi.number().required(),
    coefficients: Joi.object({
        basic: Joi.number().required(),
        area: Joi.number().required(),
        position: Joi.number().required(),
        overYear: Joi.number().required(),
        job: Joi.number().required(),
        teachYear: Joi.number().required(),
        sum: Joi.number().required(),
    }),
    sum: Joi.number().required(),
    teachReward: Joi.number().required(),
    insurances: Joi.object({
        health: Joi.number().required(),
        social: Joi.number().required(),
        unemployment: Joi.number().required(),
        sum: Joi.number().required(),
    }),
    remain: Joi.number().required(),
    description: Joi.string(),
});

route.use(AuthMiddleware);

route.get("/", async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.salaryId); //.populate("Permission", "name");
        const mainSalaries = salary.salaries.main;

        res.status(200).json(mainSalaries);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.get("/:id", async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.salaryId); //.populate("Permission", "name");
        const mainSalary = salary.salaries.main.data.id(req.params.id);

        res.status(200).json(mainSalary);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.post("/", async (req, res) => {
    try {
        await validation.validate(req.body);

        const salary = await SalaryModel.findById(req.params.salaryId); //.populate("Permission", "name");
        salary.salaries.main.data.push(req.body);
        const mainSalary = await salary.save();

        res.status(200).json(mainSalary);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

route.put("/:id", async (req, res) => {
    try {
        await validation.validate(req.body);

        const salary = await SalaryModel.findById(req.params.salaryId); //.populate("Permission", "name");
        const mainSalaryData = salary.salaries.main.data.id(req.params.id);
        const mainSalaryModified = salary.salaries.main.modified;
        const changes = req.body.changes;

        changes.forEach(change => mainSalaryData[change.column] = change.value);

        const modified = {
            user: req.body.user,
            changes: changes.map((change) => ({
                data: change.data,
                column: change.column,
                oldValue: mainSalaryData[change.column],
                newValue: change.value,
            })),
        };
        mainSalaryModified.push(modified);

        salary.save();

        res.status(200).json(modified);
    } catch (error) {
        res.status(400).send(error);
    }
});

route.delete("/:id", async (req, res) => {
    try {
        const salary = await SalaryModel.findById(req.params.salaryId); //.populate("Permission", "name");
        const mainSalaryData = salary.salaries.main.data.pull(req.params.id);
        salary.save();

        res.status(200).json(mainSalaryData);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = route;
