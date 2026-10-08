// Import Prisma client
const { PrismaClient } = require('@prisma/client');
const asyncHandler = require('express-async-handler');
const prisma = new PrismaClient();

const ALLOWED_TAGS = ['Health', 'Fitness', 'Default'];

const validateAndNormalizeTags = (tags) => {
  if (!Array.isArray(tags) || tags.length === 0) {
    throw new Error('At least one tag is required');
  }
  const normalized = tags.map((t) => {
    if (typeof t !== 'string') {
      throw new Error('Each tag must be a string');
    }
    const trimmed = t.trim();
    const match = ALLOWED_TAGS.find((allowed) => allowed.toLowerCase() === trimmed.toLowerCase());
    if (!match) {
      throw new Error(`Invalid tag "${trimmed}". Allowed tags: ${ALLOWED_TAGS.join(', ')}`);
    }
    return match;
  });
  return [...new Set(normalized)];
};

const createTask = asyncHandler(async (req, res) => {
  const { taskName, dueDate, tags } = req.body;

  const cleanTags = validateAndNormalizeTags(tags);

  const task = await prisma.task.create({
    data: {
      taskName,
      dueDate,
      tags: cleanTags,
    },
  });
  res.json({
    taskId: task.id,
    msg: 'Task created successfully',
    success: true,
  });
});

// Get all Task

const getAllTask = asyncHandler(async (req, res) => {
  try {
    const Tasks = await prisma.task.findMany();
    res.json(Tasks);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a task by id
const deleteTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSingleTask = await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(deleteSingleTask);
  } catch (error) {
    throw new Error(error);
  }
});

//Update a single Message
const updateTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const data = {
      taskName: req.body.taskName,
      dueDate: req.body.dueDate,
    };
    if (req.body.tags !== undefined) {
      data.tags = validateAndNormalizeTags(req.body.tags);
    }
    const updateSingleTask = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data,
    });
    res.json(updateSingleTask);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createTask, getAllTask, deleteTaskById, updateTaskById };
