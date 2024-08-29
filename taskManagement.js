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

    } catch (error) {
        console.error('Error saving refrigerator data', error)
    }
}

async function addTask(name, priority, description, dueDate = null) {

}

async function listTask() {
    const data = await loadTaskData();
    return data.tasks;
}

async function removeTask(name) {

}

module.exports = { createTask, loadTaskData, saveTaskData, addTask, listTask, removeTask}