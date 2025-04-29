const User = require('../models/usermodel.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const getUser = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Use optional chaining

        if (!token) {
            return res.status(401).send("No token provided"); // Or Unauthorized
        }

        jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(403).send("Invalid token");
            }

            console.log(decoded);

            // Use the id from the decoded token to find the user
            const user = await User.findByPk(decoded.id); // Assuming 'id' is the primary key

            if (!user) {
                return res.status(404).send("User not found");
            }

            // Send the user data
            res.status(200).json(user); // Use .json for consistency

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message }); // Send error message
    }
};

module.exports = {getUser};