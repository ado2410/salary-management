const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ["post", "post_comment", "post_comment_reply", "salary", "salary_feedback", "salary_feedback_reply", "salary_history"],
        },
        ref: [{
            type: mongoose.Types.ObjectId,
        }],
        users: [
            {
                type: mongoose.Types.ObjectId,
                ref: "BaseUser",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", schema);
