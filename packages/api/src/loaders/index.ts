import DataLoader from 'dataloader'
import { DbFragment, DbFragmentType } from '../db'

export const initializeLoaders = () => ({
  fragmentByHandle: new DataLoader<string, unknown>(async (handles: readonly string[]) => {
    const fragments = await DbFragment.find({ handle: { $in: [...handles] } })
    return handles.map((handle) => fragments.find((f) => f.handle === handle))
  }),
})
