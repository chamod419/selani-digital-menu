import mongoose from 'mongoose'

import {
  getGridFSBucket,
} from '../utils/gridfs.js'

// POST /api/images/upload
export const uploadImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          'Please select a food photo',
      })
    }

    const bucket =
      getGridFSBucket()

    const uploadStream =
      bucket.openUploadStream(
        req.file.originalname,
        {
          metadata: {
            contentType:
              req.file.mimetype,

            originalName:
              req.file.originalname,

            uploadedAt:
              new Date(),
          },
        }
      )

    await new Promise(
      (resolve, reject) => {
        uploadStream.on(
          'finish',
          resolve
        )

        uploadStream.on(
          'error',
          reject
        )

        uploadStream.end(
          req.file.buffer
        )
      }
    )

    res.status(201).json({
      success: true,
      message:
        'Food photo uploaded successfully',

      data: {
        imageId:
          uploadStream.id.toString(),
      },
    })
  } catch (error) {
    console.error(
      'Image upload error:',
      error
    )

    res.status(500).json({
      success: false,
      message:
        'Unable to upload food photo',
      error: error.message,
    })
  }
}

// GET /api/images/:id
export const getImage = async (
  req,
  res
) => {
  try {
    const { id } = req.params

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid image ID',
      })
    }

    const bucket =
      getGridFSBucket()

    const objectId =
      new mongoose.Types.ObjectId(id)

    const files =
      await bucket
        .find({
          _id: objectId,
        })
        .limit(1)
        .toArray()

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          'Image not found',
      })
    }

    const file = files[0]

    res.set(
      'Content-Type',
      file.metadata?.contentType ||
        'application/octet-stream'
    )

    res.set(
      'Cache-Control',
      'public, max-age=86400'
    )

    const downloadStream =
      bucket.openDownloadStream(
        objectId
      )

    downloadStream.on(
      'error',
      (error) => {
        console.error(
          'Image stream error:',
          error.message
        )

        if (!res.headersSent) {
          res.status(404).json({
            success: false,
            message:
              'Image not found',
          })
        } else {
          res.end()
        }
      }
    )

    downloadStream.pipe(res)
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        'Unable to load image',
      error: error.message,
    })
  }
}