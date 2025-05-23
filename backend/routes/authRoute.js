const express = require('express')
const authrouter = express.Router()
const {creatUser, loginUser, refreshAccessToken} = require('../controllers/authController.js')

authrouter.post('/register', creatUser)
authrouter.post('/login', loginUser)
authrouter.post('/refresh', refreshAccessToken)


module.exports = authrouter
