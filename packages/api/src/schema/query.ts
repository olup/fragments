import { nonNull, queryType, stringArg } from 'nexus'
import { DbFragment, DbUser } from '../db'
import { initializeUser } from '../flow/initialize'
import { Fragment, SearchFragmentInput } from './types/fragment'
import { User } from './types/user'

export const Query = queryType({
  definition(t) {
    t.field('fragmentByHandle', {
      type: Fragment,
      args: { handle: nonNull(stringArg()) },
      resolve(root, { handle }, { user }) {
        return DbFragment.findOne({ handle, userId: user.email })
      },
    })

    t.nonNull.list.nonNull.field('fragments', {
      type: Fragment,
      args: { filter: SearchFragmentInput },
      resolve(root, { filter }, { user }) {
        // @ts-ignore
        return DbFragment.find({
          ...(filter?.content && { content: { $regex: filter?.content } }),
          ...(filter?.tags && { tags: filter.tags }),
          userId: user.email,
        }).sort('-createdAt')
      },
    })

    t.nonNull.list.nonNull.string('tags', {
      resolve(root, _, { user }) {
        // @ts-ignore
        return DbFragment.find({ userId: user.email }).distinct('tags')
      },
    })

    t.field('me', {
      type: User,
      resolve: async (root, _, { user }) => {
        let thisUser = await DbUser.findOne({ email: user.email })
        if (!thisUser) thisUser = await initializeUser(user.email)

        return thisUser
      },
    })
  },
})
