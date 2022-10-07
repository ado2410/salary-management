const {BaseUserModel} = require("../models/UserModel");

module.exports = async (userId, roleId) => {
    const user = await BaseUserModel.findById(userId);
    if (user.role.valueOf() === roleId)
        return true;
    return false;
}