const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve HTML, JS, CSS, images

const SCORES_FILE = 'scores.json';

// GET scores
app.get('/scores', (req, res) => {
  let scores = [];
  if (fs.existsSync(SCORES_FILE)) {
    scores = JSON.parse(fs.readFileSync(SCORES_FILE));
  }
  res.json(scores);
});

// POST new score
app.post('/scores', (req, res) => {
  const { name, time } = req.body;
  let scores = [];
  if (fs.existsSync(SCORES_FILE)) {
    scores = JSON.parse(fs.readFileSync(SCORES_FILE));
  }
  scores.push({ name, time });
  scores.sort((a,b) => a.time - b.time);
  scores = scores.slice(0, 10); // keep top 10
  fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2));
  res.json({ success: true });
});

// Serve index.html on /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
