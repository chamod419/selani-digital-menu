import express from 'express'

import {
  getCategories,
  getPublicCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'

import {
  protect,
} from '../middleware/authMiddleware.js'

const router = express.Router()

// Customer API
router.get(
  '/public',
  getPublicCategories
)

// Everything below requires admin login
router.use(protect)

router
  .route('/')
  .get(getCategories)
  .post(createCategory)

router
  .route('/:id')
  .put(updateCategory)
  .delete(deleteCategory)

export default router