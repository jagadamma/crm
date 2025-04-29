const express = require('express')
const userRouter = express.Router()
const {getUser} = require('../controllers/userController.js')

userRouter.get('/get-user', getUser)

module.exports = userRouter