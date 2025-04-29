const express = require('express')
const taskrouter = express.Router()

const { postTask, getAllTasks, getTask, updateTask, deleteTask, moveTask } = require('../controllers/taskController.js')

taskrouter.post('/post',postTask)
taskrouter.get('/get',getAllTasks)
taskrouter.get('/get/:id',getTask)
taskrouter.put('/update/:id',updateTask)
taskrouter.delete('/delete/:id',deleteTask)
taskrouter.put('/move/:id',moveTask)


module.exports = taskrouter
