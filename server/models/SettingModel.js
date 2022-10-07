const mongoose = require("mongoose");

const schema = mongoose.Schema({
    salaryStructs: {
        type: mongoose.Schema.Types.Mixed,
    },
});

module.exports = mongoose.model("Setting", schema);
