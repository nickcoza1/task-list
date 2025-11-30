import db from "#db/client";
import bcrypt from "bcrypt";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

async function seed() {
  await db.query("TRUNCATE tasks RESTART IDENTITY CASCADE;");
  await db.query("TRUNCATE users RESTART IDENTITY CASCADE;");

  const passwordHash = await bcrypt.hash("seedpassword", 10);

  const user = await createUser({
    username: "seeduser",
    password: passwordHash,
  });

  await createTask({ title: "Seed task 1", done: false, userId: user.id });
  await createTask({ title: "Seed task 2", done: false, userId: user.id });
  await createTask({ title: "Seed task 3", done: true, userId: user.id });
}

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");
