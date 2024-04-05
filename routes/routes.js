const Model = require('../model/model');
const express = require('express');
const guidv4Module = require('../gen_guid');

const router = express.Router();

module.exports = router;

router.get("/tasks", async (req, res) => {
    if (req.query.completed !== 'true' && req.query.completed !== 'false') {
        return res.status(400).send({message: 'Error: invalid value for completed parameter.'});
    }

    let completed = (req.query.completed === 'true');
    let sortBy = req.query.sort_by;

    try {
        let filteredTasks = (await Model.find()).filter((task) => task.completed === completed);

        if (sortBy) {
            switch (sortBy) {
                case '+dueDate':
                    filteredTasks.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
                    break;
                case '-dueDate':
                    filteredTasks.sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());
                    break;
                case '+createdDate':
                    filteredTasks.sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
                    break;
                case '-createdDate':
                    filteredTasks.sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime());
                    break;
                default:
                    break;
            }
        }
        res.status(200).send(filteredTasks);
    }
    catch (e) {
        res.status(400).send({ message: e.message });
    }
});

router.get("/tasks/:id", async (req, res) => {
    try {
        const task = await Model.find({ id: req.params.id });
        if (task.length === 0) {
            return res.status(400).send({message: 'Error: task not found.'});
        }
        res.status(200).send(task[0]);
    }
    catch (e) {
        res.status(400).send({ message: e.message });
    }
});

router.post("/tasks", async (req, res) => {
    const { taskDescription, dueDate, completed } = req.body;

    let msg = "";
    if (!taskDescription) msg += 'Task description missing. ';
    if (!dueDate) msg += 'Due date missing. ';
    if (typeof (completed) !== 'boolean') msg += 'Completed body missing or invalid. ';
    if (msg !== "") {
        return res.status(400).send({message: 'Error: ' + msg});
    }

    const data = new Model({
        id: generateGUID(),
        taskDescription: taskDescription,
        createdDate: new Date(),
        dueDate: dueDate,
        completed: completed,
    })

    try {
        const dataToSave = await data.save();
        res.status(201).send(dataToSave);
    }
    catch (e) {
        res.status(400).send({ message: e.message });
    }
});

router.put("/tasks/:id", async (req, res) => {
    try {
        const { id, taskDescription, createdDate, dueDate, completed } = req.body;
        let msg = "";
        if (!taskDescription) msg += 'Task description missing. ';
        if (!dueDate) msg += 'Due date missing. ';
        if (typeof (completed) !== 'boolean') msg += 'Completed body missing or invalid. ';
        if (msg !== '') {
            return res.status(400).send({message: 'Error: ' + msg});
        }

        const filter = {id: req.params.id};
        const update = {taskDescription: taskDescription, dueDate: dueDate, completed: completed};

        const dataToSave = await Model.findOneAndUpdate(filter, update, {new: true});
        res.status(200).send(dataToSave);
    }
    catch (e){
        res.status(400).send({message: e.message});
    }
});

router.delete("/tasks/:id", async(req, res) => {
    try {
        const filter = {id: req.params.id};
        const data = await Model.findOneAndDelete(filter);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send({message: e.message});
    }
});

const generateGUID = () => {
    return guidv4Module.createGuidv4();
}