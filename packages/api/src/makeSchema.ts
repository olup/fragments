import { fieldAuthorizePlugin, makeSchema } from 'nexus'
import path from 'path'
import * as allTypes from './schema'

export const schema = makeSchema({
  types: allTypes,
  outputs: {
    schema: path.join(__dirname, 'schema.graphql'),
    typegen: path.join(__dirname, 'generated', 'nexus.ts'),
  },
  plugins: [fieldAuthorizePlugin()],

  contextType: {
    module: path.join(__dirname, 'context.ts'),
    export: 'Context',
  },

  //  headers: ['import * as db from "../db"'],

  prettierConfig: require.resolve('../.prettierrc'),
})
