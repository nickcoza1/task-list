import { Router } from "express";

import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import {
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask,
} from "#db/queries/tasks";

const router = Router();

router.get("/", requireUser, async (req, res, next) => {
  try {
    const tasks = await getTasksByUserId(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  requireUser,
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const { title, done } = req.body;
      const task = await createTask({
        title,
        done,
        userId: req.user.id,
      });
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  "/:id",
  requireUser,
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const existing = await getTaskById(id);

      if (!existing || existing.user_id !== req.user.id) {
        return res.status(403).send("Forbidden");
      }

      const { title, done } = req.body;
      const updated = await updateTask({ id, title, done });

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },
);

router.delete("/:id", requireUser, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await getTaskById(id);

    if (!existing || existing.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    await deleteTask(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
