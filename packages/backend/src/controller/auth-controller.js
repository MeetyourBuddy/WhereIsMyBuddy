let lucia;

// Function to initialize Lucia (from `auth.js`)
const initializeLucia = async () => {
  if (!lucia) {
    const { lucia: initializedLucia } = require('../auth.js');
    lucia = initializedLucia;
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    await initializeLucia();
    const { email, password } = req.body;
    const user = await lucia.auth.register(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user and create a session
exports.login = async (req, res) => {
  try {
    await initializeLucia();
    const { email, password } = req.body;
    const user = await lucia.auth.login(email, password);

    // Store user ID and session info in express session
    req.session.userId = user.user_id; // Store user ID in session
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save session' });
      }
      res.json(user); // Send user data back to the client
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Validate session (e.g., checking session status)
exports.validateSession = async (req, res) => {
  try {
    await initializeLucia();
    if (!req.session.userId) {
      return res.status(401).json({ error: 'No active session' });
    }

    res.status(200).json({ message: 'Session is active', userId: req.session.userId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Logout user and destroy session
exports.logout = async (req, res) => {
  try {
    await initializeLucia();
    if (!req.session.userId) {
      return res.status(400).json({ error: 'No active session to log out' });
    }

    // Logout user based on session
    await lucia.auth.logout(req.session.userId);

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.status(204).end();
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
