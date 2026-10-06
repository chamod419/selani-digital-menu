import express from 'express'

import upload from '../middleware/uploadMiddleware.js'

import {
  protect,
} from '../middleware/authMiddleware.js'

import {
  uploadImage,
  getImage,
} from '../controllers/imageController.js'

const router = express.Router()

router.get('/:id', getImage)

router.post(
  '/upload',
  protect,
  upload.single('image'),
  uploadImage
)

export default router