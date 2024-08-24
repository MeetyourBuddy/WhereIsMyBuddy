const express = require('express');
const router = express.Router();

// Define routes for home
router.get('/', (req, res) => {
    res.send('Home Page');
});

router.get('/test', (req, res) => {
    res.send('Test Page');
});

module.exports = router;
