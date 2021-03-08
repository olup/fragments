// getting-started.js
import mongoose from 'mongoose'

export const connect = () => mongoose.connect(process.env.DB_URL || '', { useNewUrlParser: true })

export * from './fragment'
export * from './user'
