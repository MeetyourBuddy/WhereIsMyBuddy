// Function to handle requests to protected routes
const getProtected = async (req, res) => {
  // Access session and user data from req.session
  const session = req.session;
  const user = session ? session.user : null;

  // Check if the session and user are present
  if (!session || !user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Respond with a success message and user info
  res.status(200).json({ message: `Welcome, user ${user._id}` });
};

module.exports = {
  getProtected
};
