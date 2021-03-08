import { fieldAuthorizePlugin, makeSchema } from '@nexus/schema'
import path from 'path'
import * as allTypes from './schema'

export const schema = makeSchema({
  types: allTypes,
  outputs: {
    schema: path.join(__dirname, 'schema.graphql'),
    typegen: path.join(__dirname, 'generated', 'nexus.ts'),
  },
  plugins: [fieldAuthorizePlugin()],

  typegenAutoConfig: {
    headers: ['import * as db from "../db"'],
    contextType: 'ctx.Context',
    sources: [
      {
        alias: 'ctx',
        source: path.join(__dirname, 'context.ts'),
      },
    ],
  },
  prettierConfig: require.resolve('../.prettierrc'),
})
