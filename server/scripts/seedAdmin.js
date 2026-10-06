import dotenv from 'dotenv'
import mongoose from 'mongoose'

import connectDB from '../config/db.js'
import Admin from '../models/Admin.js'

dotenv.config()

const seedAdmin = async () => {
  try {
    await connectDB()

    const {
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
    } = process.env

    if (
      !ADMIN_EMAIL ||
      !ADMIN_PASSWORD
    ) {
      console.error(
        'ADMIN_EMAIL and ADMIN_PASSWORD are required in .env'
      )

      process.exit(1)
    }

    const existingAdmin =
      await Admin.findOne({
        email: ADMIN_EMAIL.toLowerCase(),
      })

    if (existingAdmin) {
      console.log(
        'Admin already exists:',
        existingAdmin.email
      )

      await mongoose.connection.close()
      process.exit(0)
    }

    const admin = await Admin.create({
      name:
        ADMIN_NAME ||
        'Selani Admin',

      email:
        ADMIN_EMAIL.toLowerCase(),

      password: ADMIN_PASSWORD,
    })

    console.log(
      'Admin created successfully:',
      admin.email
    )

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error(
      'Admin seed error:',
      error.message
    )

    await mongoose.connection.close()
    process.exit(1)
  }
}

seedAdmin()