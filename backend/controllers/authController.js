const User = require('../models/usermodel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const creatUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);

    if (!(username && email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ where: { email: email } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username: username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Encrypt password
    const encryptedPassword = await bcrypt.hash(password, 4);

    // Create user
    const user = await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { email: email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save();

      return res.status(200).json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });

    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Access is forbidden" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = user.generateAccessToken();
    return res.status(200).json({ accessToken });

  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

module.exports = {
  creatUser,
  loginUser,
  refreshAccessToken,
};
