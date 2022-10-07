const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        permissions: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Permission",
            },
        ],
        description: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Role", schema);
