const fs = require('fs').promises;
const path = require('path');


const DATABASES_DIR = path.join(__dirname, 'databases');
fs.mkdir(DATABASES_DIR, { recursive: true })
	.then(() => console.log('Databases directory created or already exists.'))
	.catch(console.error);
const TASK_DATA_FILE = path.join(DATABASES_DIR, 'taskManager.json');

function createTask(name, priority, description, dueDate = null) {
    return {
        name,
        priority,
        description,
        dueDate,
    };
}

async function loadTaskData(){
    try {
        const data = await fs.readFile(TASK_DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading task data', error);
        return { tasks: [] };
    }
}

async function saveTaskData(data){
    try {
        await fs.writeFile(TASK_DATA_FILE, JSON.stringify(data, null, 2))
    } catch (error) {
        console.error('Error saving task data', error)
    }
}

async function addTask(name, priority, description, dueDate = null) {
    const data = await loadTaskData();
    const task = createTask(name, priority, description, dueDate);
    data.tasks.push(task);
    await saveTaskData(data)
    return task;
}

async function listTask() {
    const data = await loadTaskData();
    return data.tasks;
}

async function removeTask(name) {
    const data = await loadTaskData();

    const initialLength = data.tasks.length;
    const updatedTasks = data.tasks.filter(task => task.name.toLowerCase() !== name.toLowerCase());

    if(updatedTasks.length === initialLength){
        return null;
    }

    data.tasks = updatedTasks;
    await saveTaskData(data);
    return updatedTasks;

}

module.exports = { createTask, loadTaskData, saveTaskData, addTask, listTask, removeTask}