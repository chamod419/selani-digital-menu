import Category from '../models/Category.js'
import MenuItem from '../models/MenuItem.js'

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ displayOrder: 1, name: 1 })

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load categories',
      error: error.message,
    })
  }
}

// GET /api/categories/public
export const getPublicCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
    }).sort({
      displayOrder: 1,
      name: 1,
    })

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to load public categories',
      error: error.message,
    })
  }
}

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    const { name, displayOrder, isActive } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      })
    }

    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: 'i',
      },
    })

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists',
      })
    }

    const category = await Category.create({
      name: name.trim(),
      displayOrder: displayOrder ?? 0,
      isActive: isActive ?? true,
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message,
    })
  }
}

// PUT /api/categories/:id
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    const { name, displayOrder, isActive } = req.body

    if (name !== undefined) {
      const cleanName = name.trim()

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: 'Category name cannot be empty',
        })
      }

      const duplicateCategory = await Category.findOne({
        _id: { $ne: req.params.id },
        name: {
          $regex: `^${cleanName}$`,
          $options: 'i',
        },
      })

      if (duplicateCategory) {
        return res.status(409).json({
          success: false,
          message: 'Another category with this name already exists',
        })
      }

      category.name = cleanName
    }

    if (displayOrder !== undefined) {
      category.displayOrder = displayOrder
    }

    if (isActive !== undefined) {
      category.isActive = isActive
    }

    const updatedCategory = await category.save()

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message,
    })
  }
}

// DELETE /api/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    const menuItemCount = await MenuItem.countDocuments({
      category: req.params.id,
    })

    if (menuItemCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          'This category contains menu items. Remove or move those items before deleting the category.',
      })
    }

    await category.deleteOne()

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message,
    })
  }
}