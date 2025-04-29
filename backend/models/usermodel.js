
const sequelize = require('../db/db.js');
const { DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');


const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, 
        unique: true,
        validate:{
            isEmail: true
        }
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true // Allow null since not every user may have a refresh token
    }
},);

const generateToken = (payload, secret, expiresIn) => {
    try {
        return jwt.sign(payload, secret, { expiresIn });
    } catch (error) {
        console.error("Failed to generate token:", error);
        throw new Error("Failed to generate token"); // Re-throw to handle in calling function
    }
};

User.prototype.generateRefreshToken = function() {
    return generateToken(
        { id: this.id, email: this.email },
        process.env.REFRESH_TOKEN,
        '7d'
    );
};

User.prototype.generateAccessToken = function() {
    return generateToken(
        { id: this.id, email: this.email },
        process.env.ACCESS_TOKEN,
        '15m'
    );
};

module.exports = User;