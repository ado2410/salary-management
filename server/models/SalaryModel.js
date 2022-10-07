const mongoose = require("mongoose");

const schema = mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "BaseUser",
            required: true,
        },
        period: {
            type: mongoose.Schema({
                month: {
                    type: Number,
                    required: true,
                },
                year: {
                    type: Number,
                    required: true,
                },
            }),
            required: true,
            unique: true,
        },
        salaries: {
            main: {
                type: new mongoose.Schema(
                    {
                        mainSalary: {
                            type: Number,
                        },
                        addSalary: {
                            type: Number,
                        },
                        feeSalary: {
                            type: Number,
                        },
                        data: [
                            {
                                user: {
                                    type: mongoose.Types.ObjectId,
                                    ref: "BaseUser",
                                    required: true,
                                },
                                code: {
                                    value: {
                                        type: String,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                newLevel: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                coefficientMain: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                coefficientArea: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                coefficientPosition: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                coefficientOverYear: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                coefficientJob: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                coefficientTeach: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                coefficientGovernment: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                coefficientParty: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                mainCoefficientSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                mainSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                teachReward: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                insuranceHealth: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                insuranceSocial: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                insuranceUnemployment: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                insuranceSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                mainRemain: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                mainDescription: {
                                    value: {
                                        type: String,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                addCoefficientSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                addSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                addSum80: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                addSum40: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                addRemain20: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                addSubDayOff: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                addRemain: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                addDescription: {
                                    value: {
                                        type: String,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                feeCoefficientSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                feeSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                specialJob: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                feeAddSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                feeSubDayOff: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                feeRemain: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                feeDescription: {
                                    value: {
                                        type: String,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                }
                            },
                        ],
                    },
                    {timestamps: true}
                )
            },
            teach: {
                type: new mongoose.Schema(
                    {
                        name: {
                            type: String,
                            required: true,
                        },
                        data: [
                            {
                                user: {
                                    type: mongoose.Types.ObjectId,
                                    ref: "BaseUser",
                                    required: true,
                                },
                                lessons: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                exchangedLessons: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                superviseExam: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                subTeach: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                subResearch: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                subSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                lessonSum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                sum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                            },
                        ]
                    },
                    {timestamps: true}
                ),
            },
            guide: {
                type: new mongoose.Schema(
                    {
                        name: {
                            type: String,
                            required: true,
                        },
                        data: [
                            {
                                user: {
                                    type: mongoose.Types.ObjectId,
                                    ref: "BaseUser",
                                    required: true,
                                },
                                mission: {
                                    value: {
                                        type: String,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                studentCount: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                lessonCount: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                price: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                                sum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                            }
                        ],
                    },
                    {timestamps: true}
                ),
            },
            welfare: [{
                type: new mongoose.Schema(
                    {
                        name: {
                            type: String,
                            required: true,
                        },
                        data: [
                            {
                                user: {
                                    type: mongoose.Types.ObjectId,
                                    ref: "BaseUser",
                                    required: true,
                                },
                                sum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                            }
                        ],
                    },
                    {timestamps: true}
                ),
            }],
            other: [{
                type: new mongoose.Schema(
                    {
                        name: {
                            type: String,
                            required: true,
                        },
                        data: [
                            {
                                user: {
                                    type: mongoose.Types.ObjectId,
                                    ref: "BaseUser",
                                    required: true,
                                },
                                sum: {
                                    value: {
                                        type: Number,
                                    },
                                    comments: [{
                                        type: String,
                                    }]
                                },
                            }
                        ],
                    },
                    {timestamps: true}
                ),
            }],
        },
        histories: [
            {
                type: new mongoose.Schema(
                    {
                        user: {
                            type: mongoose.Types.ObjectId,
                            ref: "BaseUser",
                            required: true,
                        },
                        changes: [
                            {
                                type: {
                                    type: String,
                                    enum: ["main", "add", "fee", "teach", "guide", "welfare", "other"],
                                    required: true,
                                },
                                salaryRef: {
                                    type: mongoose.Types.ObjectId,
                                    required: true,
                                },
                                rowRef: {
                                    type: mongoose.Types.ObjectId,
                                    required: true,
                                },
                                column: {
                                    type: String,
                                    required: true,
                                },
                                oldValue: {
                                    type: mongoose.Schema.Types.Mixed,
                                    required: true,
                                },
                                newValue: {
                                    type: mongoose.Schema.Types.Mixed,
                                    required: true,
                                },
                            }
                        ],
                    },
                    {timestamps: true}
                ),
            },
        ],
        feedbacks: [
            {
                type: new mongoose.Schema(
                    {
                        user: {
                            type: mongoose.Types.ObjectId,
                            ref: "BaseUser",
                            required: true,
                        },
                        type: {
                            type: String,
                            enum: ["main", "add", "fee", "teach", "guide", "welfare", "other"],
                            required: true,
                        },
                        ref: {
                            type: mongoose.Types.ObjectId,
                            required: true,
                        },
                        content: {
                            type: String,
                            required: true,
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
                                            required: true,
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
    {timestamps: true}
);

module.exports = mongoose.model("Salary", schema);
