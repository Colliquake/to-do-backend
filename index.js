const guidv4Module = require('./gen_guid');

const express = require('express');

const app = express();
app.use(express.json());

const firstTaskDate = new Date(2023, 5, 16);
const firstTaskDueDate = new Date(2024, 7, 29);

const secondTaskDate = new Date(2024, 1, 3, 12, 30);
const secondTaskDueDate = new Date(2024, 5, 21);

let tasks = [
    {
        id: "403a5c06-64f9-4c13-95d2-fb59e3193a4e",
        taskDescription: "first task made",
        createdDate: firstTaskDate,
        dueDate: firstTaskDueDate,
        completed: false,
    },
    {
        id: "3fbcc3e5-63ae-4fd3-b418-0a74a27134e8",
        taskDescription: "second task",
        createdDate: secondTaskDate,
        dueDate: secondTaskDueDate,
        completed: false,
    },
]

app.get("/tasks", (req, res) => {
    if(req.query.completed !== 'true' && req.query.completed !== 'false'){
        return res.status(400).send('Error: invalid value for "completed" parameter.');
    }

    let completed = (req.query.completed === 'true');
    let sortBy = req.query.sort_by;

    let filteredTasks = tasks.filter((task) => task.completed === completed);

    if(sortBy){
        switch(sortBy){
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
});

app.get("/tasks/:id", (req, res) => {
    const task = tasks.find((item) => item.id === req.params.id);

    if(task){
        res.status(200).send(task);
    }
    else{
        res.status(400).send('Error: task not found.');
    }
});

app.post("/tasks", (req, res) => {
    const { taskDescription, dueDate, completed } = req.body;

    //handle invalid request body(s)
    let msg = "";
    if(!taskDescription)    msg += 'Task description missing. ';
    if(!dueDate)    msg += 'Due date missing. ';
    if(typeof(completed) !== 'boolean') msg += 'Completed body missing or invalid. ';
    if(msg !== ""){
        return res.status(400).send('Error: ' + msg);
    }

    let newTask = {
        id: generateGUID(),
        taskDescription: taskDescription,
        createdDate: new Date(),
        dueDate: dueDate,
        completed: completed,
    }

    tasks.push(newTask);

    res.status(201).send(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const task = tasks.find((item) => item.id === req.params.id);
    if(!task){
        return res.status(400).send('Error: task not found. No changes were made.');
    }

    const { id, taskDescription, createdDate, dueDate, completed } = req.body;
    let msg = "";
    if(!taskDescription)    msg += 'Task description missing. ';
    if(!dueDate)    msg += 'Due date missing. ';
    if(typeof(completed) !== 'boolean') msg += 'Completed body missing or invalid. ';
    if(msg !== ''){
        return res.status(400).send('Error: ' + msg);
    }

    task.taskDescription = taskDescription;
    task.dueDate = dueDate;
    task.completed = completed;

    res.status(200).send(task);
});

const generateGUID = () => {
    let guid = guidv4Module.createGuidv4();
    return guid;
};

app.listen(3000, () => {
    console.log(`listening on port 3000`);
});

