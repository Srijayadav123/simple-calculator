const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../frontend")));

let history = [];

// API: perform calculation
app.post("/api/calc", (req, res) => {
  const { num1, num2, operator } = req.body;
  let result;

  switch (operator) {
    case "+": result = num1 + num2; break;
    case "-": result = num1 - num2; break;
    case "*": result = num1 * num2; break;
    case "/": result = num2 !== 0 ? num1 / num2 : "Error: divide by zero"; break;
    default: result = "Invalid operator";
  }

  const entry = { num1, num2, operator, result, timestamp: new Date() };
  history.push(entry);

  res.json(entry);
});

// API: get history
app.get("/api/history", (req, res) => {
  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Calculator backend running on http://localhost:${PORT}`);
});
