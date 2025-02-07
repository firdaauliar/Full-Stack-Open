const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI