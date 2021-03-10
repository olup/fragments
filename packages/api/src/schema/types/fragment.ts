import { inputObjectType, objectType } from 'nexus'
export const Fragment = objectType({
  name: 'Fragment',
  // sourceType: 'db.DbFragmentType',
  definition(t) {
    t.id('uuid')
    t.nonNull.string('handle')
    t.nonNull.string('content')
    t.nonNull.string('previewContent')

    t.nonNull.list.nonNull.field('linksTo', {
      type: Fragment,
      // @ts-ignore
      resolve: async ({ linksTo }, _, { loaders }) => {
        const fragments = await loaders.fragmentByHandle.loadMany(linksTo)
        return fragments.filter(Boolean)
      },
    })

    t.nonNull.list.nonNull.field('linkedBy', {
      type: Fragment,
      // @ts-ignore
      resolve: async ({ linkedBy }, _, { loaders }) => {
        const fragments = await loaders.fragmentByHandle.loadMany(linkedBy)
        return fragments.filter(Boolean)
      },
    })

    t.nonNull.list.nonNull.string('tags')
    t.dateTime('createdAt')
  },
})

export const FragmentInput = inputObjectType({
  name: 'FragmentInput',
  definition(t) {
    t.id('uuid')
    t.string('handle')
    t.string('content')
  },
})

export const SearchFragmentInput = inputObjectType({
  name: 'SearchFragmentInput',
  definition(t) {
    t.string('tags')
    t.string('handle')
    t.string('content')
  },
})
