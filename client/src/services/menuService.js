import api from './api'

import {
  getMenuImageUrl,
} from '../utils/imageUrl'

export const getPublicCategories =
  async () => {
    const response =
      await api.get(
        '/categories/public'
      )

    return (
      response.data.data || []
    )
  }

export const getPublicMenuItems =
  async () => {
    const response =
      await api.get(
        '/menu-items/public'
      )

    const items =
      response.data.data || []

    return items.map(
      (item) => ({
        id: item._id,

        name: item.name,

        description:
          item.description || '',

        price:
          Number(
            item.price || 0
          ),

        categoryId:
          item.category?._id ||
          '',

        category:
          item.category?.name ||
          'Other',

        imageId:
          item.imageId || '',

        image:
          getMenuImageUrl(
            item.imageId
          ),

        isAvailable:
          item.isAvailable ??
          true,

        isPopular:
          item.isPopular ??
          false,

        isNew:
          item.isNew ??
          false,

        isSpecial:
          item.isSpecial ??
          false,

        displayOrder:
          item.displayOrder ??
          0,
      })
    )
  }