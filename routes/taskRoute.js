const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTask,
  deleteTaskById,
  updateTaskById,
} = require('../controller/taskCtrl');

router.post('/task/create', createTask);
router.get('/task/all-tasks', getAllTask);
router.delete('/task/delete-single-task/:id', deleteTaskById);
router.put('/task/update-single-task/:id', updateTaskById);

module.exports = router;
