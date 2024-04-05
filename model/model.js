const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: {
        required: true,
        type: String
    },
    taskDescription: {
        required: true,
        type: String
    },
    createdDate: {
        required: true,
        type: Date
    },
    dueDate: {
        required: true,
        type: Date
    },
    completed: {
        required: true,
        type: Boolean
    }
}, {
    versionKey: false,
});

module.exports = mongoose.model('Task', taskSchema);