import { decorateType } from '@nexus/schema'
import { GraphQLDateTime } from 'graphql-scalars'

export const GQLDate = decorateType(GraphQLDateTime, {
  rootTyping: 'Date',
  asNexusMethod: 'dateTime',
})

export * from './Fragment'
export * from './Query'
