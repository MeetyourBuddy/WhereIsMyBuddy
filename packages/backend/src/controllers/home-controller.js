const home = async (req, res) => {
  res.status(200).json({ message: 'Welcome to the home page' });
};

export default home;
