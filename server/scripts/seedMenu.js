import dotenv from 'dotenv'
import mongoose from 'mongoose'

import connectDB from '../config/db.js'
import Category from '../models/Category.js'
import MenuItem from '../models/MenuItem.js'

dotenv.config()

const RESET_EXISTING_MENU = process.argv.includes('--reset')

const menuData = [
  {
    "name": "Fried Rice",
    "items": [
      {
        "name": "Vegetable Fried Rice",
        "price": 600
      },
      {
        "name": "Vegetable & Egg Fried Rice",
        "price": 650
      },
      {
        "name": "Garlic Fried Rice",
        "price": 700
      },
      {
        "name": "Fried Rice Chicken (Half)",
        "price": 750
      },
      {
        "name": "Fried Rice Chicken (Full)",
        "price": 850
      },
      {
        "name": "Fried Rice Fish (Half)",
        "price": 800
      },
      {
        "name": "Fried Rice Fish (Full)",
        "price": 900
      },
      {
        "name": "Fried Rice Prawns (Half)",
        "price": 800
      },
      {
        "name": "Fried Rice Prawns (Full)",
        "price": 900
      },
      {
        "name": "Fried Rice Beef (Half)",
        "price": 850
      },
      {
        "name": "Fried Rice Beef (Full)",
        "price": 950
      },
      {
        "name": "Mixed Fried Rice",
        "price": 1200,
        "description": "Chicken / Sausages / Fish / Prawns / Cuttlefish"
      },
      {
        "name": "SELANI Special Fried Rice",
        "price": 1250,
        "isSpecial": true
      },
      {
        "name": "Seafood Fried Rice",
        "price": 1000
      },
      {
        "name": "Nasi Goreng Rice",
        "price": 1050
      },
      {
        "name": "Seafood Mongoline Rice",
        "price": 1100
      },
      {
        "name": "Mix Spicy Mongolian Rice",
        "price": 1100
      },
      {
        "name": "Mix Spicy Mongolian Rice",
        "price": 1200
      }
    ]
  },
  {
    "name": "Biriyani Rice",
    "items": [
      {
        "name": "Chicken Biriyani Rice",
        "price": 980
      }
    ]
  },
  {
    "name": "Noodles",
    "items": [
      {
        "name": "Fried Noodles with Vegetables",
        "price": 750
      },
      {
        "name": "Fried Noodles with Egg",
        "price": 800
      },
      {
        "name": "Fried Noodles Chicken (Half)",
        "price": 900
      },
      {
        "name": "Fried Noodles Chicken (Full)",
        "price": 1000
      },
      {
        "name": "Fried Noodles Fish (Half)",
        "price": 950
      },
      {
        "name": "Fried Noodles Fish (Full)",
        "price": 1050
      },
      {
        "name": "Fried Noodles Beef (Half)",
        "price": 1000
      },
      {
        "name": "Fried Noodles Beef (Full)",
        "price": 1100
      },
      {
        "name": "Fried Noodles Prawns (Half)",
        "price": 950
      },
      {
        "name": "Fried Noodles Prawns (Full)",
        "price": 1050
      },
      {
        "name": "Mixed Fried Noodles",
        "price": 1350,
        "description": "Chicken / Sausages / Fish / Prawns / Cuttlefish"
      },
      {
        "name": "Seafood Noodles",
        "price": 1250
      },
      {
        "name": "Seafood Noodles",
        "price": 1500,
        "description": "Seafood / Chicken / & (one Chaicken Pease & Fried Egg"
      }
    ]
  },
  {
    "name": "Chopsuey Rice",
    "items": [
      {
        "name": "Vegetable Chopsuey Rice",
        "price": 1050
      },
      {
        "name": "Chopsuey Rice Chicken",
        "price": 1400
      },
      {
        "name": "Chopsuey Rice Beef",
        "price": 2050
      },
      {
        "name": "Chopsuey Rice Fish",
        "price": 2050
      },
      {
        "name": "Chopsuey Rice Prawns",
        "price": 1750
      },
      {
        "name": "Chopsuey Rice Sausages",
        "price": 1300
      },
      {
        "name": "Mixed Chopsuey Rice",
        "price": 1650,
        "description": "Chicken / Sausages / Fish / Prawns / Cuttlefish"
      },
      {
        "name": "Sea Food Chopsuey Rice",
        "price": 1550
      },
      {
        "name": "SELANI Special Chopsuey Rice",
        "price": 1950,
        "isSpecial": true
      }
    ]
  },
  {
    "name": "Fish",
    "items": [
      {
        "name": "Devilled Fish (S)",
        "price": 1750
      },
      {
        "name": "Devilled Fish (L)",
        "price": 1900
      },
      {
        "name": "Spicy Fish (S)",
        "price": 1750
      },
      {
        "name": "Spicy Fish (L)",
        "price": 1900
      },
      {
        "name": "Hot Garlic Fish (S)",
        "price": 1800
      },
      {
        "name": "Hot Garlic Fish (L)",
        "price": 1950
      },
      {
        "name": "Hot Butter Fish (S)",
        "price": 1800
      },
      {
        "name": "Hot Butter Fish (L)",
        "price": 1950
      },
      {
        "name": "Fried Fish (S)",
        "price": 1730
      },
      {
        "name": "Fried Fish (L)",
        "price": 1880
      },
      {
        "name": "Sweet & Sour Fish (S)",
        "price": 1750
      },
      {
        "name": "Sweet & Sour Fish (L)",
        "price": 1900
      }
    ]
  },
  {
    "name": "Chicken",
    "items": [
      {
        "name": "Devilled Chicken (S)",
        "price": 1100
      },
      {
        "name": "Devilled Chicken (L)",
        "price": 1200
      },
      {
        "name": "Fried Chicken (S)",
        "price": 1080
      },
      {
        "name": "Fried Chicken (L)",
        "price": 1180
      },
      {
        "name": "Pepper Chicken (S)",
        "price": 1250
      },
      {
        "name": "Pepper Chicken (L)",
        "price": 1350
      },
      {
        "name": "Spicy Chicken (S)",
        "price": 1300
      },
      {
        "name": "Spicy Chicken (L)",
        "price": 1400
      },
      {
        "name": "Hot Butter Chicken (S)",
        "price": 1400
      },
      {
        "name": "Hot Butter Chicken (L)",
        "price": 1400
      },
      {
        "name": "Hot Garlic Chicken (S)",
        "price": 1400
      },
      {
        "name": "Hot Garlic Chicken (L)",
        "price": 1500
      },
      {
        "name": "Chicken with dry Red Chillie (S)",
        "price": 1400
      },
      {
        "name": "Chicken with dry Red Chillie (L)",
        "price": 1200
      },
      {
        "name": "Kangkung with Chicken (S)",
        "price": 1900
      },
      {
        "name": "Kangkung with Chicken (L)",
        "price": 1500
      },
      {
        "name": "Sweet & Sour Chicken (S)",
        "price": 1100
      },
      {
        "name": "Sweet & Sour Chicken (L)",
        "price": 2000
      },
      {
        "name": "Chillie Chicken with Cashewnuts (S)",
        "price": 2300
      },
      {
        "name": "Chillie Chicken with Cashewnuts (L)",
        "price": 1200
      },
      {
        "name": "Devilled Chicken 1Kg",
        "price": 2500
      }
    ]
  },
  {
    "name": "Prawns",
    "items": [
      {
        "name": "Devilled Prawns (S)",
        "price": 1500
      },
      {
        "name": "Devilled Prawns (L)",
        "price": 1650
      },
      {
        "name": "Fried Prawns (S)",
        "price": 1450
      },
      {
        "name": "Fried Prawns (L)",
        "price": 1600
      },
      {
        "name": "Spicy Prawns (S)",
        "price": 1500
      },
      {
        "name": "Spicy Prawns (L)",
        "price": 1650
      },
      {
        "name": "Hot Butter Prawns (S)",
        "price": 1550
      },
      {
        "name": "Hot Butter Prawns (L)",
        "price": 1700
      },
      {
        "name": "Hot Garlic Prawns (S)",
        "price": 1550
      },
      {
        "name": "Hot Garlic Prawns (L)",
        "price": 1700
      },
      {
        "name": "Sweet & Sour Prawns (S)",
        "price": 1500
      },
      {
        "name": "Sweet & Sour Prawns (L)",
        "price": 1650
      },
      {
        "name": "Battered Prawns (S)",
        "price": 1580
      },
      {
        "name": "Battered Prawns (L)",
        "price": 1700
      },
      {
        "name": "Sri Lanka Style Prawns (S)",
        "price": 1980
      },
      {
        "name": "Sri Lanka Style Prawns (L)",
        "price": 2450
      }
    ]
  },
  {
    "name": "Cuttlefish",
    "items": [
      {
        "name": "Devilled Cuttlefish (S)",
        "price": 1500
      },
      {
        "name": "Devilled Cuttlefish (L)",
        "price": 1650
      },
      {
        "name": "Fried Cuttlefish (S)",
        "price": 1450
      },
      {
        "name": "Fried Cuttlefish (L)",
        "price": 1600
      },
      {
        "name": "Spicy Cuttlefish (S)",
        "price": 1500
      },
      {
        "name": "Spicy Cuttlefish (L)",
        "price": 1650
      },
      {
        "name": "Hot Butter Cuttlefish (S)",
        "price": 1550
      },
      {
        "name": "Hot Butter Cuttlefish (L)",
        "price": 1700
      },
      {
        "name": "Hot Garlic Cuttlefish (S)",
        "price": 1550
      },
      {
        "name": "Hot Garlic Cuttlefish (L)",
        "price": 1700
      },
      {
        "name": "Sweet & Sour Cuttlefish (S)",
        "price": 1500
      },
      {
        "name": "Sweet & Sour Cuttlefish (L)",
        "price": 1650
      },
      {
        "name": "Battered Cuttlefish (S)",
        "price": 1580
      },
      {
        "name": "Battered Cuttlefish (L)",
        "price": 1700
      },
      {
        "name": "Sri Lankan Style Cuttlefish (S)",
        "price": 1900
      },
      {
        "name": "Sri Lankan Style Cuttlefish (L)",
        "price": 2500
      }
    ]
  },
  {
    "name": "Beef",
    "items": [
      {
        "name": "Devilled Beef (S)",
        "price": 1800
      },
      {
        "name": "Devilled Beef (L)",
        "price": 1900
      },
      {
        "name": "Fried Beef (S)",
        "price": 1700
      },
      {
        "name": "Fried Beef (L)",
        "price": 1800
      },
      {
        "name": "Spicy Beef (S)",
        "price": 1800
      },
      {
        "name": "Spicy Beef (L)",
        "price": 1900
      },
      {
        "name": "Pepper Beef (S)",
        "price": 1900
      },
      {
        "name": "Pepper Beef (L)",
        "price": 2000
      },
      {
        "name": "Beef with Dry Red Chilli (S)",
        "price": 1800
      },
      {
        "name": "Beef with Dry Red Chilli (L)",
        "price": 1900
      },
      {
        "name": "Sri Lankan Style Beef (S)",
        "price": 2700
      },
      {
        "name": "Sri Lankan Style Beef (L)",
        "price": 2900
      },
      {
        "name": "Kankung with Beef (S)",
        "price": 1900
      },
      {
        "name": "Kankung with Beef (L)",
        "price": 2000
      }
    ]
  },
  {
    "name": "Stews",
    "items": [
      {
        "name": "Fish Stew (S)",
        "price": 1900
      },
      {
        "name": "Fish Stew (L)",
        "price": 2100
      },
      {
        "name": "Chicken Stew (S)",
        "price": 1400
      },
      {
        "name": "Chicken Stew (L)",
        "price": 1590
      },
      {
        "name": "Beef Stew (S)",
        "price": 1900
      },
      {
        "name": "Beef Stew (L)",
        "price": 2050
      }
    ]
  },
  {
    "name": "Starters and Appetigen",
    "items": [
      {
        "name": "French Fries",
        "price": 880
      }
    ]
  },
  {
    "name": "Soups",
    "items": [
      {
        "name": "Vegetable Soup",
        "price": 550
      },
      {
        "name": "Sweet Cron with Veg.Soup",
        "price": 800
      },
      {
        "name": "Sweet Cron with Chicken Soup",
        "price": 900
      },
      {
        "name": "Cream of Mushroom Soup",
        "price": 650
      },
      {
        "name": "Sweet Corn with Prawns Soup",
        "price": 700
      },
      {
        "name": "Tom Yum Seafood Soup",
        "price": 780
      },
      {
        "name": "Sweet Corn with Egg Soup",
        "price": 620
      },
      {
        "name": "Garlic Soup",
        "price": 600
      },
      {
        "name": "Noodles Vegetable Soup",
        "price": 650
      },
      {
        "name": "Selani Special Seafood Soup",
        "price": 750,
        "isSpecial": true
      }
    ]
  },
  {
    "name": "Savouries",
    "items": [
      {
        "name": "Sri Lankan Omelette",
        "price": 550
      },
      {
        "name": "Chicken Omelette",
        "price": 650
      },
      {
        "name": "Cheese Omelette",
        "price": 850
      },
      {
        "name": "Fried Cashew Nuts",
        "price": 850
      },
      {
        "name": "Fried Egg",
        "price": 100
      },
      {
        "name": "Selani Special Seafood Omelette",
        "price": 900,
        "isSpecial": true
      },
      {
        "name": "Boiled Vegetables",
        "price": 850
      },
      {
        "name": "Sausages Deviled",
        "price": 880
      },
      {
        "name": "Sausages Fried",
        "price": 850
      }
    ]
  }
]

const seedMenu = async () => {
  try {
    await connectDB()

    console.log('\nSelani menu seed started...')
    console.log(`Reset existing menu: ${RESET_EXISTING_MENU ? 'YES' : 'NO'}\n`)

    if (RESET_EXISTING_MENU) {
      const existingImages = await MenuItem.countDocuments({ imageId: { $ne: null } })

      if (existingImages > 0) {
        console.log(
          `Warning: ${existingImages} existing menu item(s) have GridFS image references.`
        )
        console.log(
          'This script clears menu item/category documents only. Existing GridFS image files are not deleted.\n'
        )
      }

      await MenuItem.deleteMany({})
      await Category.deleteMany({})

      console.log('Existing categories and menu items cleared.\n')
    }

    let categoryCount = 0
    let itemCount = 0

    for (let categoryIndex = 0; categoryIndex < menuData.length; categoryIndex += 1) {
      const categoryData = menuData[categoryIndex]

      const category = await Category.findOneAndUpdate(
        { name: categoryData.name },
        {
          $set: {
            displayOrder: categoryIndex + 1,
            isActive: true,
          },
          $setOnInsert: {
            name: categoryData.name,
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )

      categoryCount += 1

      for (let itemIndex = 0; itemIndex < categoryData.items.length; itemIndex += 1) {
        const item = categoryData.items[itemIndex]

        await MenuItem.findOneAndUpdate(
          {
            category: category._id,
            displayOrder: itemIndex + 1,
          },
          {
            $set: {
              name: item.name,
              description: item.description || '',
              price: Number(item.price),
              category: category._id,
              imageId: null,
              isAvailable: true,
              isPopular: false,
              isNew: false,
              isSpecial: item.isSpecial || false,
              displayOrder: itemIndex + 1,
            },
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          }
        )

        itemCount += 1
      }

      console.log(
        `✓ ${categoryData.name}: ${categoryData.items.length} item(s)`
      )
    }

    console.log('\n----------------------------------------')
    console.log(`Categories seeded: ${categoryCount}`)
    console.log(`Menu items seeded: ${itemCount}`)
    console.log('Images: not added (imageId = null)')
    console.log('----------------------------------------\n')
    console.log('Selani menu seed completed successfully.')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('\nSelani menu seed failed:')
    console.error(error)

    try {
      await mongoose.connection.close()
    } catch {
      // Ignore close errors.
    }

    process.exit(1)
  }
}

seedMenu()
