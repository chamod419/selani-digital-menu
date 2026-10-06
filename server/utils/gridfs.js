import mongoose from 'mongoose'

export const getGridFSBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error(
      'MongoDB connection is not ready'
    )
  }

  return new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    {
      bucketName: 'foodImages',
    }
  )
}

export const deleteGridFSFile = async (
  imageId
) => {
  if (
    !imageId ||
    !mongoose.Types.ObjectId.isValid(imageId)
  ) {
    return false
  }

  try {
    const bucket = getGridFSBucket()

    await bucket.delete(
      new mongoose.Types.ObjectId(imageId)
    )

    return true
  } catch (error) {
    console.error(
      'GridFS image delete error:',
      error.message
    )

    return false
  }
}