const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load JSON data
const dataPath = path.join(__dirname, 'data.json');
const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Load additional chapter data
const chapter3Path = path.join(__dirname, 'chapter3.json');
const chapter3Data = JSON.parse(fs.readFileSync(chapter3Path, 'utf8'));

const chapter4Path = path.join(__dirname, 'chapter4.json');
const chapter4Data = JSON.parse(fs.readFileSync(chapter4Path, 'utf8'));

const chapter5Path = path.join(__dirname, 'chapter5.json');
const chapter5Data = JSON.parse(fs.readFileSync(chapter5Path, 'utf8'));

// Merge chapters
jsonData.chapters.push(chapter3Data);
jsonData.chapters.push(chapter4Data);
jsonData.chapters.push(chapter5Data);

// Set EJS as view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  // Render initial scene (first scene of the first chapter)
  const initialScene = jsonData.chapters[0].scenes[0];
  res.render('index', { scene: initialScene });
});

// Handle user choices
app.get('/choice/:sceneId/:choiceId', (req, res) => {
  const { sceneId, choiceId } = req.params;
  const currentScene = findScene(sceneId);
  
  // Find the next scene based on the choice made
  const nextSceneId = currentScene.choices[choiceId].leads_to;
  
  if (nextSceneId === "victory") {
    res.redirect('/victory');
  } else {
    const nextScene = findScene(nextSceneId);
    res.render('index', { scene: nextScene });
  }
});

// Route for the victory page
app.get('/victory', (req, res) => {
  res.render('victory');
});

// Helper function to find a scene by ID
function findScene(sceneId) {
  for (let chapter of jsonData.chapters) {
    for (let scene of chapter.scenes) {
      if (scene.scene_id == sceneId) {
        return scene;
      }
    }
  }
  return null;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
