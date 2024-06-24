const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load JSON data
const dataPath = path.join(__dirname, 'data.json');
const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

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
  const nextScene = findScene(nextSceneId);
  
  // Render the next scene
  res.render('index', { scene: nextScene });
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
