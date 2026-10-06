import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const protect = async (req, res, next) => {
  try {
    let token

    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    const admin = await Admin.findById(decoded.adminId)

    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is unavailable',
      })
    }

    req.admin = admin

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session',
    })
  }
}