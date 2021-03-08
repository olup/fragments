import mongoose, { Document } from 'mongoose'

export interface DbUserType extends Document {
  email: string
  metadata: {}
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    metadata: {},
  },
  {
    timestamps: true,
  }
)
userSchema.index({ email: 1 }, { unique: true })

export const DbUser = mongoose.model<DbUserType>('user', userSchema)
