const express = require("express");
const Joi = require("joi");
const JWT = require('jsonwebtoken');
const {BaseUserModel, TeacherUserModel} = require('../models/UserModel');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const route = express.Router();

const validation = Joi.object({
    username: Joi.string().alphanum().min(4).max(20).required(),
    password: Joi.string().min(6).max(20).required(),
});

route.post("/login", async (req, res) => {
    try {
        await validation.validateAsync(req.body);

        req.body.password = require('crypto').createHash('sha256').update(req.body.password).digest('hex');

        let user = await BaseUserModel.findOne({username: req.body.username.toLowerCase()});
        if (!user) throw {username: {name: "Unauthorized", message: "Tên tài khoản không tồn tại"}};

        user = await BaseUserModel.findOne({username: req.body.username.toLowerCase(), password: req.body.password});
        if (!user) throw {password: {name: "Unauthorized", message: "Mật khẩu không đúng"}};

        const payload = await BaseUserModel.findOne({username: req.body.username.toLowerCase(), password: req.body.password}).populate("role").lean();

        const accessToken = JWT.sign(payload, process.env.ACCESS_TOKEN_KEY, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
        const refreshToken = JWT.sign(payload, process.env.REFRESH_TOKEN_KEY, {expiresIn: process.env.REFRESH_TOKEN_EXPIRATION});

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, auth: payload});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
});

route.get('/logout', AuthMiddleware, (req, res) => {
    res.send(req.headers['auth']);
});

route.get('/check', AuthMiddleware, (req, res) => {
    res.status(200).json({auth: req.headers.auth});
});

route.post("/generateAccessToken", async (req, res) => {
    try {
        let refreshToken = req.body.refreshToken;

        if (!refreshToken) throw {name: "JsonWebTokenError", message: "Không tìm thấy refresh token"};

        const auth = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
        const payload = await BaseUserModel.findById(auth._id).select("+refreshToken").populate("role").lean();

        if (refreshToken !== payload.refreshToken) throw {name: "JsonWebTokenError", message: "Refresh token khác với CSDL"};

        const accessToken = JWT.sign(payload, process.env.ACCESS_TOKEN_KEY, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
        refreshToken = JWT.sign(payload, process.env.REFRESH_TOKEN_KEY, {expiresIn: process.env.REFRESH_TOKEN_EXPIRATION});

        const user = await BaseUserModel.findById(auth._id);
        user.refreshToken = refreshToken;
        user.save();

        res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, auth: payload});
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError")
            error.name = "JsonWebTokenError";
        res.status(400).json(error);
    }
});

module.exports = route;
