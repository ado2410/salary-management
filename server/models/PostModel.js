const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "BaseUser",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Không được để trống"],
        },
        content: {
            type: String,
            required: [true, "Không được để trống"],
        },
        comments: [
            {
                type: new mongoose.Schema(
                    {
                        user: {
                            type: mongoose.Types.ObjectId,
                            ref: "BaseUser",
                            required: true,
                        },
                        content: {
                            type: String,
                            required: [true, "Không được để trống"],
                        },
                        replies: [
                            {
                                type: new mongoose.Schema(
                                    {
                                        user: {
                                            type: mongoose.Types.ObjectId,
                                            ref: "BaseUser",
                                            required: true,
                                        },
                                        content: {
                                            type: String,
                                            required: [true, "Không được để trống"],
                                        },
                                    },
                                    { timestamps: true }
                                ),
                            },
                        ],
                    },
                    { timestamps: true }
                ),
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", schema);
