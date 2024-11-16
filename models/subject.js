const mongoose = require('mongoose')
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
    },
    maxMarks: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
