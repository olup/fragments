import mongoose from 'mongoose'
import { nanoid } from 'nanoid'
import { arg, idArg, mutationType, nonNull } from 'nexus'
import { DbFragment } from '../db'
import { listHandles, listTags } from '../utils/tools'
import { Fragment, FragmentInput } from './types/fragment'

export const Mutation = mutationType({
  definition(t) {
    t.field('saveFragment', {
      type: Fragment,
      args: { fragment: nonNull(arg({ type: FragmentInput })) },
      async resolve(root, { fragment }, { user }) {
        const optionalDatas = fragment.content
          ? {
              linksTo: listHandles(fragment.content),
              tags: listTags(fragment.content),
              previewContent: fragment.content.slice(0, 100),
            }
          : {}

        let response: any = {}

        if (fragment.uuid) {
          console.log('updating fragment')
          const oldFragment = await DbFragment.findOne({ uuid: fragment.uuid })

          response = await DbFragment.findOneAndUpdate(
            { uuid: fragment.uuid, userId: user.email },
            // @ts-ignore
            { ...fragment, ...optionalDatas },
            { new: true }
          )

          const oldHandle = oldFragment?.handle
          const newHandle = fragment.handle
          if (oldHandle !== newHandle) {
            // @ts-ignore
            const db = mongoose.connection.db
            await db.collection('fragments').updateMany({ userId: user.email, linksTo: oldHandle }, [
              {
                $set: {
                  content: {
                    $replaceOne: { input: '$content', find: '@' + oldHandle, replacement: '@' + newHandle },
                  },
                },
              },
            ])
            await db
              .collection('fragments')
              .updateMany({ userId: user.email, linksTo: oldHandle }, { $set: { 'linkTo.$': newHandle } })
          }
        } else {
          console.log('creating fragment')
          //@ts-ignore
          response = await DbFragment.create({
            uuid: nanoid(20),
            linkedBy: [],
            linksTo: [],
            tags: [],
            userId: user.email,

            ...fragment,
            ...optionalDatas,
          })
        }

        // update backlinks
        if (fragment.handle) {
          await DbFragment.updateMany(
            { userId: user.email },
            {
              $pull: { linkedBy: fragment.handle },
            }
          )
          await DbFragment.updateMany(
            { userId: user.email, handle: { $in: optionalDatas.linksTo || [] } },
            {
              $push: { linkedBy: fragment.handle },
            }
          )
        }

        return response
      },
    })

    t.nonNull.boolean('deleteFragment', {
      args: { uuid: nonNull(idArg()) },
      async resolve(root, { uuid }, { user: { email: userId } }) {
        await DbFragment.findOneAndDelete({ uuid, userId })
        return true
      },
    })
  },
})
