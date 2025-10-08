const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// File to store scores
const SCORES_FILE = 'scores.json';

// Get scores
app.get('/scores', (req, res) => {
  let scores = [];
  if (fs.existsSync(SCORES_FILE)) {
    scores = JSON.parse(fs.readFileSync(SCORES_FILE));
  }
  res.json(scores);
});

// Save score
app.post('/scores', (req, res) => {
  const { name, time } = req.body;
  let scores = [];
  if (fs.existsSync(SCORES_FILE)) {
    scores = JSON.parse(fs.readFileSync(SCORES_FILE));
  }
  scores.push({ name, time });
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
