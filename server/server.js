// server/server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// File to store scores
const SCORES_FILE = 'scores.json';

// GET /scores — return all scores
app.get('/scores', (req, res) => {
  let scores = [];
  if (fs.existsSync(SCORES_FILE)) {
    scores = JSON.parse(fs.readFileSync(SCORES_FILE));
  }
  res.json(scores);
});

// POST /scores — save new score
app.post('/scores', (req, res) => {
  const { name, time } = req.body;
  if (!name || typeof time !== 'number') {
    return res.status(400).json({ error: 'Invalid name or time' });
  }

  let scores = [];
  if (fs.existsSync(SCORES_FILE)) {
    scores = JSON.parse(fs.readFileSync(SCORES_FILE));
  }

  scores.push({ name, time });
  scores.sort((a, b) => a.time - b.time); // lowest time first
  scores = scores.slice(0, 10); // keep top 10
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
