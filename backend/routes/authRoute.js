const express = require('express')
const authrouter = express.Router()
const {creatUser, loginUser, refreshToken} = require('../controllers/authController.js')

authrouter.post('/register', creatUser)
authrouter.post('/login', loginUser)
authrouter.post('/refresh', refreshToken)


module.exports = authrouter
