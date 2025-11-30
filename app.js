import express from "express";

import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#routes/users";
import tasksRouter from "#routes/tasks";

const app = express();

app.use(express.json());

app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);

    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
