const {Task} = require('../models/taskmodel.js'); 


const postTask = async (req, res) => {
  try {
    const {
      title,
      assignedTo,
      startDate,
      dueDate,
      priority,
      tags,
      status,
      description,
      parentId
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Convert tags array to string if necessary
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;

    const newTask = await Task.create({
      title,
      assignedTo,
      startDate,
      dueDate,
      priority,
      tags: tagsString,
      status,
      description,
      parentId
    });

    res.status(201).json({ message: '✅ Task created successfully', task: newTask });
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};
  const getAllTasks = async (req, res) => {
    try {
      // Retrieve all tasks
      const tasks = await Task.findAll();
  
      // Return the tasks
      res.status(200).json(tasks);
    } catch (error) {
      // Handle any errors that occur during task retrieval
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve tasks' });
    }
  };

  const getTask = async (req, res) => {
    try {
      // Retrieve the task ID from the request parameters
      const taskId = req.params.id;
  
      // Retrieve the task by ID
      const task = await Task.findByPk(taskId);
  
      // Check if the task exists
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Return the task
      res.status(200).json(task);
    } catch (error) {
      // Handle any errors that occur during task retrieval
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve task' });
    }
  };

  const updateTask = async (req, res) => {
    try {
      const taskId = req.params.id;
  
      // Validate request
      if (!taskId) {
        return res.status(400).json({ message: 'Task ID is required' });
      }
  
      const task = await Task.findByPk(taskId);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Handle tags: convert array to comma-separated string if needed
      const updatedData = {
        ...req.body,
        tags: Array.isArray(req.body.tags)
          ? req.body.tags.join(',')
          : req.body.tags,
      };
  
      await task.update(updatedData);
  
      res.status(200).json(task);
    } catch (error) {
      console.error("❌ Error updating task:", error);
      res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
  };
  

  const deleteTask = async (req, res) => {
    try {
      // Retrieve the task ID from the request parameters
      const taskId = req.params.id;
  
      // Retrieve the task by ID
      const task = await Task.findByPk(taskId);
  
      // Check if the task exists
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      // Delete the task
      await task.destroy();
  
      // Return a success message
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      // Handle any errors that occur during task deletion
      console.error(error);
      res.status(500).json({ message: 'Failed to delete task' });
    }
  };

  const moveTask = async (req, res) => {
    try {
      // Extract the task ID from the request parameters
      const { taskId } = req.params;
  
      // Extract the destination column from the request body
      const { destinationColumn } = req.body;
  
      // Check if the task ID and destination column are provided
      if (!taskId || !destinationColumn) {
        // Return a 400 error if either field is missing
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Update the task status in the database
      const task = await Task.findByPk(taskId);
      if (!task) {
        // Return a 404 error if the task is not found
        return res.status(404).json({ error: "Task not found" });
      }
  
      // Update the task status
      await task.update({ status: destinationColumn });
  
      // Return a success message with the updated task information
      res.json({ message: "Task moved successfully", taskId, status: destinationColumn });
    } catch (error) {
      // Handle any errors that occur during the database query
      console.error(error);
      res.status(500).json({ error: "Failed to move task" });
    }
  };
  module.exports = { postTask, getAllTasks, getTask, updateTask, deleteTask, moveTask };