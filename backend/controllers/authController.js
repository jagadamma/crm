const User = require('../models/usermodel.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const creatUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(req.body);

        if (!(username && email && password)) {
            return res.status(400).send("All fields are required");
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email: email } });

        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // Encrypt password
        const encryptedPassword = await bcrypt.hash(password, 4);

        // Create user
        const user = await User.create({
            username: username,
            email: email,
            password: encryptedPassword
        });

        // No need to save manually with Sequelize - .create() does it

        return res.status(201).send("User created successfully");

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: error.message }); // Send error message from Sequelize
    }
};
const loginUser = async (req,res)=>{
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send("All fields are required");
        }

        // Find the user by email
        const user = await User.findOne({ where: { email: email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate tokens
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            // Update the user's refresh token in the database
            user.refreshToken = refreshToken;
            await user.save(); // Sequelize's save() persists changes to the DB

            // Send the tokens in the response
            return res.status(200).json({ accessToken, refreshToken }); // Using .json for consistency

        } else {
            return res.status(400).send("Invalid credentials");
        }

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: error.message }); // Send a more helpful error message
    }
}


const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(403).send("Access is forbidden");
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

        // Find the user associated with the decoded token
        const user = await User.findByPk(decoded.id);  // Assuming the ID is in the decoded token

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).send("Invalid refresh token");
        }

        // Generate a new access token
        const accessToken = user.generateAccessToken();

        return res.status(200).json({ accessToken });  // Send as JSON

    } catch (error) {
        console.error(error);
        return res.status(403).send("Invalid refresh token");
    }
};

module.exports = { refreshToken };

module.exports = {creatUser, loginUser, refreshToken}