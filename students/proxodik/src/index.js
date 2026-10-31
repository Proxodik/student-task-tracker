const http = require("node:http");

const tasks = [
  { id: 1, title: "Complete DevOps project", completed: false },
  { id: 2, title: "Prepare for English exam", completed: false }
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/") {
    res.end(JSON.stringify({
      name: "Student Task Tracker",
      status: "running"
    }));
    return;
  }

  if (req.method === "GET" && req.url === "/tasks") {
    res.end(JSON.stringify(tasks));
    return;
  }

  if (req.method === "POST" && req.url === "/tasks") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (typeof data.title !== "string" || !data.title.trim()) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Title is required" }));
          return;
        }

        const task = {
          id: Math.max(0, ...tasks.map(t => t.id)) + 1,
          title: data.title.trim(),
          completed: false
        };

        tasks.push(task);
        res.writeHead(201);
        res.end(JSON.stringify(task));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  const match = req.url.match(/^\/tasks\/(\d+)\/complete$/);

  if (req.method === "PATCH" && match) {
    const task = tasks.find(t => t.id === Number(match[1]));

    if (!task) {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Task not found" }));
      return;
    }

    task.completed = true;
    res.end(JSON.stringify(task));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Student Task Tracker running on port ${PORT}`);
});
