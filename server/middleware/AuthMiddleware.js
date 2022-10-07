const JWT = require('jsonwebtoken');
const {BaseUserModel} = require("../models/UserModel");

const middleware = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) throw {name: "JsonWebTokenError", message: "Không tìm thấy access token"};

        const token = authorization.split(' ')[1];

        const auth = JWT.verify(token, process.env.ACCESS_TOKEN_KEY);

        const user = await BaseUserModel.findById(auth._id);
        if (!user) throw {name: "JsonWebTokenError", message: "Id người dùng không tồn tại trong CSDL"};

        req.headers.auth = auth;

        next();
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports = middleware;