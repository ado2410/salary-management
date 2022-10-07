const mongoose = require("mongoose");
const {isEmail} = require("validator");

const base = {
    role: {
        type: mongoose.Types.ObjectId,
        ref: "Role",
        required: [true, "Không được để trống"],
    },
    username: {
        type: String,
        required: [true, "Không được để trống"],
        unique: true,
        index: true,
        minLength: [3, "Ít nhất 3 kí tự"],
        maxLength: [20, "Tối đa 20 kí tự"],
    },
    password: {
        type: String,
        required: [true, "Không được để trống"],
        select: false,
        minLength: [8, "Ít nhất 8 kí tự"],
        maxLength: [30, "Tối đa 30 kí tự"],
    },
    email: {
        type: String,
        required: [true, "Không được để trống"],
        unique: true,
        validate: [isEmail, "Không phải là email"],
    },
    name: {
        first: {
            type: String,
            required: [true, "Không được để trống"],
            maxLength: [100, "Tối đa 100 kí tự"],
        },
        last: {
            type: String,
            required: [true, "Không được để trống"],
            maxLength: [100, "Tối đa 100 kí tự"],
        },
    },
}

const baseSchema = mongoose.Schema(base, { timestamps: true });
const teacherSchema = mongoose.Schema(
    {
        ...base,
        gender: {
            type: String,
            enum: ["male", "female"],
            required: [true, "Không được để trống"],
        },
        dob: {
            type: Date,
            required: [true, "Không được để trống"],
        },
        address: {
            type: String,
            required: [true, "Không được để trống"],
        },
        department: {
            type: mongoose.Types.ObjectId,
            ref: "Department",
            required: [true, "Không được để trống"],
        },
        coefficientSalary: {
            type: Number,
            required: [true, "Không được để trống"],
        },
        startedDate: {
            type: Date,
            required: [true, "Không được để trống"],
        },
        refreshToken: {
            type: String,
            select: false,
        }
    },
    { timestamps: true }
);

baseSchema.pre("save", preSave);
teacherSchema.pre("save", preSave);

baseSchema.path('username').validate(function (value, respond) {
    return /^[a-zA-Z0-9.]*$/.test(value);
}, 'Tên tài khoản không hợp lệ! Chỉ sử dụng kí tự a-z, 0-9 và (.)');

function preSave(next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = require("crypto")
            .createHash("sha256")
            .update(this.password)
            .digest("hex");
        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    BaseUserModel: mongoose.model("BaseUser", baseSchema, "users"),
    TeacherUserModel: mongoose.model("TeacherUser", teacherSchema, "users"),
};
