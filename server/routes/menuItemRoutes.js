import express from 'express'

import {
  getMenuItems,
  getPublicMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuItemController.js'

import {
  protect,
} from '../middleware/authMiddleware.js'

const router = express.Router()

// Customer QR Menu
router.get(
  '/public',
  getPublicMenuItems
)

// Admin authentication required below
router.use(protect)

router
  .route('/')
  .get(getMenuItems)
  .post(createMenuItem)

router
  .route('/:id')
  .get(getMenuItemById)
  .put(updateMenuItem)
  .delete(deleteMenuItem)

export default router