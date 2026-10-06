import mongoose from 'mongoose'

import MenuItem from '../models/MenuItem.js'
import Category from '../models/Category.js'

import {
  deleteGridFSFile,
} from '../utils/gridfs.js'

// ========================================
// GET ALL MENU ITEMS - ADMIN
// ========================================

export const getMenuItems = async (
  req,
  res
) => {
  try {
    const menuItems =
      await MenuItem.find()
        .populate(
          'category',
          'name isActive displayOrder'
        )
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        'Failed to load menu items',
      error: error.message,
    })
  }
}

// ========================================
// PUBLIC CUSTOMER MENU
// ========================================

export const getPublicMenuItems =
  async (req, res) => {
    try {
      const menuItems =
        await MenuItem.find({
          isAvailable: true,
        })
          .populate({
            path: 'category',

            match: {
              isActive: true,
            },

            select:
              'name displayOrder',
          })
          .sort({
            displayOrder: 1,
            createdAt: -1,
          })

      const visibleItems =
        menuItems.filter(
          (item) =>
            item.category !== null
        )

      res.status(200).json({
        success: true,
        count:
          visibleItems.length,
        data: visibleItems,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          'Failed to load public menu',
        error: error.message,
      })
    }
  }

// ========================================
// GET ONE
// ========================================

export const getMenuItemById =
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Invalid menu item ID',
          })
      }

      const menuItem =
        await MenuItem.findById(
          req.params.id
        ).populate(
          'category',
          'name isActive displayOrder'
        )

      if (!menuItem) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Menu item not found',
          })
      }

      res.status(200).json({
        success: true,
        data: menuItem,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          'Failed to load menu item',
        error: error.message,
      })
    }
  }

// ========================================
// CREATE
// ========================================

export const createMenuItem =
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        category,
        imageId,

        isAvailable,
        isPopular,
        isNew,
        isSpecial,

        displayOrder,
      } = req.body

      if (
        !name ||
        !name.trim()
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Menu item name is required',
          })
      }

      if (
        price === undefined ||
        price === null ||
        Number(price) < 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'A valid price is required',
          })
      }

      if (!category) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Category is required',
          })
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          category
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Invalid category ID',
          })
      }

      const categoryExists =
        await Category.findById(
          category
        )

      if (!categoryExists) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Selected category does not exist',
          })
      }

      if (
        imageId &&
        !mongoose.Types.ObjectId.isValid(
          imageId
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Invalid image ID',
          })
      }

      const menuItem =
        await MenuItem.create({
          name: name.trim(),

          description:
            description?.trim() ||
            '',

          price:
            Number(price),

          category,

          imageId:
            imageId
              ? new mongoose.Types.ObjectId(
                  imageId
                )
              : null,

          isAvailable:
            isAvailable ?? true,

          isPopular:
            isPopular ?? false,

          isNew:
            isNew ?? false,

          isSpecial:
            isSpecial ?? false,

          displayOrder:
            displayOrder ?? 0,
        })

      const populatedMenuItem =
        await MenuItem.findById(
          menuItem._id
        ).populate(
          'category',
          'name isActive displayOrder'
        )

      res.status(201).json({
        success: true,
        message:
          'Menu item created successfully',
        data:
          populatedMenuItem,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          'Failed to create menu item',
        error: error.message,
      })
    }
  }

// ========================================
// UPDATE
// ========================================

export const updateMenuItem =
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Invalid menu item ID',
          })
      }

      const menuItem =
        await MenuItem.findById(
          req.params.id
        )

      if (!menuItem) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Menu item not found',
          })
      }

      const oldImageId =
        menuItem.imageId
          ? menuItem.imageId.toString()
          : null

      const {
        name,
        description,
        price,
        category,
        imageId,

        isAvailable,
        isPopular,
        isNew,
        isSpecial,

        displayOrder,
      } = req.body

      if (
        category !== undefined
      ) {
        if (
          !mongoose.Types.ObjectId.isValid(
            category
          )
        ) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                'Invalid category ID',
            })
        }

        const categoryExists =
          await Category.findById(
            category
          )

        if (!categoryExists) {
          return res
            .status(404)
            .json({
              success: false,
              message:
                'Selected category does not exist',
            })
        }

        menuItem.category =
          category
      }

      if (name !== undefined) {
        if (!name.trim()) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                'Menu item name cannot be empty',
            })
        }

        menuItem.name =
          name.trim()
      }

      if (
        description !== undefined
      ) {
        menuItem.description =
          description.trim()
      }

      if (price !== undefined) {
        if (
          Number(price) < 0
        ) {
          return res
            .status(400)
            .json({
              success: false,
              message:
                'Price cannot be negative',
            })
        }

        menuItem.price =
          Number(price)
      }

      if (
        imageId !== undefined
      ) {
        if (
          imageId === null ||
          imageId === ''
        ) {
          menuItem.imageId =
            null
        } else {
          if (
            !mongoose.Types.ObjectId.isValid(
              imageId
            )
          ) {
            return res
              .status(400)
              .json({
                success: false,
                message:
                  'Invalid image ID',
              })
          }

          menuItem.imageId =
            new mongoose.Types.ObjectId(
              imageId
            )
        }
      }

      if (
        isAvailable !== undefined
      ) {
        menuItem.isAvailable =
          isAvailable
      }

      if (
        isPopular !== undefined
      ) {
        menuItem.isPopular =
          isPopular
      }

      if (
        isNew !== undefined
      ) {
        menuItem.isNew =
          isNew
      }

      if (
        isSpecial !== undefined
      ) {
        menuItem.isSpecial =
          isSpecial
      }

      if (
        displayOrder !== undefined
      ) {
        menuItem.displayOrder =
          displayOrder
      }

      await menuItem.save()

      const newImageId =
        menuItem.imageId
          ? menuItem.imageId.toString()
          : null

      // New photo / removed photo:
      // delete old GridFS image.
      if (
        oldImageId &&
        oldImageId !== newImageId
      ) {
        await deleteGridFSFile(
          oldImageId
        )
      }

      const updatedMenuItem =
        await MenuItem.findById(
          menuItem._id
        ).populate(
          'category',
          'name isActive displayOrder'
        )

      res.status(200).json({
        success: true,
        message:
          'Menu item updated successfully',
        data:
          updatedMenuItem,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          'Failed to update menu item',
        error: error.message,
      })
    }
  }

// ========================================
// DELETE
// ========================================

export const deleteMenuItem =
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Invalid menu item ID',
          })
      }

      const menuItem =
        await MenuItem.findById(
          req.params.id
        )

      if (!menuItem) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Menu item not found',
          })
      }

      const imageId =
        menuItem.imageId
          ? menuItem.imageId.toString()
          : null

      await menuItem.deleteOne()

      if (imageId) {
        await deleteGridFSFile(
          imageId
        )
      }

      res.status(200).json({
        success: true,
        message:
          'Menu item deleted successfully',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          'Failed to delete menu item',
        error: error.message,
      })
    }
  }