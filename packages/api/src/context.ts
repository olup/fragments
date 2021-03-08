import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { initializeLoaders } from './loaders'

export const createContext = ({ req }: ExpressContext) => {
  return {
    //@ts-ignore
    user: req.user,
    loaders: initializeLoaders(),
  }
}

export type Context = ReturnType<typeof createContext>
