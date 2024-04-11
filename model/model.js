const mongoose = require('mongoose');
mongoose.pluralize(null);

function getModel(collectionName) {
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

    if(mongoose.models[collectionName]){
        return mongoose.model(collectionName);
    }
    else{
        return mongoose.model(collectionName, taskSchema);
    }
}

module.exports = getModel;