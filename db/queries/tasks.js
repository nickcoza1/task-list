import db from "#db/client";

export async function createTask({ title, done, userId }) {
  const {
    rows: [task],
  } = await db.query(
    `
      INSERT INTO tasks (title, done, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, done, user_id;
    `,
    [title, done, userId],
  );
  return task;
}

export async function getTasksByUserId(userId) {
  const { rows } = await db.query(
    `
      SELECT id, title, done, user_id
      FROM tasks
      WHERE user_id = $1
      ORDER BY id;
    `,
    [userId],
  );
  return rows;
}

export async function getTaskById(id) {
  const {
    rows: [task],
  } = await db.query(
    `
      SELECT id, title, done, user_id
      FROM tasks
      WHERE id = $1;
    `,
    [id],
  );
  return task;
}

export async function updateTask({ id, title, done }) {
  const {
    rows: [task],
  } = await db.query(
    `
      UPDATE tasks
      SET title = $1,
          done = $2
      WHERE id = $3
      RETURNING id, title, done, user_id;
    `,
    [title, done, id],
  );
  return task;
}

export async function deleteTask(id) {
  await db.query(
    `
      DELETE FROM tasks
      WHERE id = $1;
    `,
    [id],
  );
}
