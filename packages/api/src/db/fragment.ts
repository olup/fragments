import mongoose, { Document } from 'mongoose'

export interface DbFragmentType extends Document {
  uuid: string
  content: string
  previewContent: string
  handle: string
  userId: string
  tags: string[]
  linksTo: string[]
  linkedBy: string[]
}

const fragmentSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    content: String,
    previewContent: String,
    handle: String,
    tags: [String],
    userId: { type: String, required: true },
    linksTo: { type: [String], default: [] },
    linkedBy: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
)

fragmentSchema.index({ userId: 1, handle: 1 }, { unique: true })
export const DbFragment = mongoose.model<DbFragmentType>('fragment', fragmentSchema)
