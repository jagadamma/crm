const jwt = require('jsonwebtoken')

const authenticationMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({msg: "Header Not found"})
    }
    const token = authHeader.split(' ')[1]
  
    try {
      const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN )
      req.user = decoded
      next()
    } catch (error) {
      return res.status(401).json({ msg: 'Not authorized' })
    }
  }
  module.exports = authenticationMiddleware