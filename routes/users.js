import { Router } from "express";
import bcrypt from "bcrypt";

import { createUser, getUserByUsername } from "#db/queries/users";
import { createToken } from "#utils/jwt";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).send("username and password are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      username,
      password: hashedPassword,
    });

    const token = createToken({ id: user.id });

    res.status(201).send(token);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).send("username and password are required");
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send("Invalid credentials");
    }

    const token = createToken({ id: user.id });

    res.send(token);
  } catch (err) {
    next(err);
  }
});

export default router;
