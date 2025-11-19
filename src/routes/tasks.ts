import { Router } from "express";
import { Prisma, PrismaClient } from "../../generated/prisma/client.ts";

const router = Router();
const prisma = new PrismaClient();

interface TaskBody {
  description: string;
  completed: boolean;
}

// Get all tasks --------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to get tasks" });
  }
});

// Get task by ID -------------------------------------------------------------
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await prisma.task.findUniqueOrThrow({
      where: {
        id: Number(id),
      },
    });

    res.json(task);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "p2025"
    ) {
      return res
        .status(404)
        .json({ error: "No task found with the provided ID" });
    }

    console.error(err);
    res.status(500).json({ error: "failed to fetch task" });
  }
});

// Create a new task ----------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    // takes the whole TaskBody, includes 'completed: boolean',
    // which doesn't make sense for a post... Refactor later
    const { description }: TaskBody = req.body;

    const task = await prisma.task.create({ data: { description } });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to create task" });
  }
});

// Update a task --------------------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed }: TaskBody = req.body;

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { description, completed },
    });

    res.status(200).json(task);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ error: "No task found with the provided ID" });
    }
    console.error(err);
    res.status(500).json({ error: "failed to update task" });
  }
});

// Delete a task --------------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({ where: { id: Number(id) } });
    res.json({ message: "Task deleted" });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ error: "No task found with the provided ID" });
    }
    console.error(err);
    res.status(500).json({ error: "failed to delete task" });
  }
});

export default router;
