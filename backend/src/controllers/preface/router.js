const express = require('express');
const router = express.Router();

// This is a placeholder. In a real application, you might serve a static page
// or fetch data from a 'Preface' model.
router.get('/', (req, res) => {
  res.send('This is the preface page.');
});

module.exports = router;
