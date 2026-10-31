const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");

const PORT = 3100;
let server;

test.before(async () => {
  server = spawn(process.execPath, ["src/index.js"], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: "ignore"
  });

  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/`);
      if (response.ok) return;
    } catch {}

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  throw new Error("Server did not start");
});

test.after(() => {
  if (server) server.kill();
});

test("GET / returns application status", async () => {
  const response = await fetch(`http://127.0.0.1:${PORT}/`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.status, "running");
});

test("GET /tasks returns tasks", async () => {
  const response = await fetch(`http://127.0.0.1:${PORT}/tasks`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(data));
});

test("POST /tasks creates a task", async () => {
  const response = await fetch(`http://127.0.0.1:${PORT}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test assignment" })
  });

  const data = await response.json();

  assert.equal(response.status, 201);
  assert.equal(data.title, "Test assignment");
  assert.equal(data.completed, false);
});
