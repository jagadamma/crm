const jwt = require('jsonwebtoken')

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log('Auth header:', authHeader)
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No authorization header or wrong format')
      return res.status(401).json({msg: "Header Not found"})
    }
    const token = authHeader.split(' ')[1]
    console.log('Token:', token)
  
    try {
      const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN )
      console.log('Decoded token:', decoded)
      req.user = decoded
      next()
    } catch (error) {
      console.log('JWT verification error:', error.message)
      return res.status(401).json({ msg: 'Not authorized' })
    }
  }
  module.exports = authenticationMiddleware