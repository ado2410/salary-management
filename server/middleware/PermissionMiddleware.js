const {BaseUserModel} = require("../models/UserModel");

const middleware = (permissionCode) => {
    return async (req, res, next) => {
        try {
            let user = await BaseUserModel.findById(req.headers.auth._id).populate("role");
            user = await user.populate("role.permissions");
            const permissions = user.role.permissions;
            const validPermissions = permissions.filter(permission => permission.code === permissionCode);

            if (validPermissions.length > 0)
                next();
            else throw {name: "Unauthenticated", message: "Permission limited"};
        } catch (error) {
            console.log(error);
            res.status(400).json(error);
        }
    }
}

module.exports = middleware;