const express = require('express');
const router = express.Router();
const { lucia } = require('../auth.js');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await lucia.auth.register(email, password);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await lucia.auth.login(email, password);
        req.session.userId = user.user_id; // Store user ID in session
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Logout route
router.post('/logout', async (req, res) => {
    try {
        await lucia.auth.logout(req.session.userId); // Logout user based on session ID
        req.session.destroy(); // Destroy session
        res.status(204).end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
