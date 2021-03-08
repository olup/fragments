require('dotenv').config()

import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { schema } from './makeSchema'
import { createContext } from './context'
import cors from 'cors'
import morgan from 'morgan'

import jwt from 'express-jwt'
import jwks from 'jwks-rsa'
import { connect, DbFragment, DbUser } from './db'
import { nanoid } from 'nanoid'
import { initializeUser } from './flow/initialize'

var port = process.env.PORT || 10000

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://fragment-app.eu.auth0.com/.well-known/jwks.json',
  }),
  credentialsRequired: false,
  audience: 'https://fragment.ml',
  issuer: 'https://fragment-app.eu.auth0.com/',
  algorithms: ['RS256'],
})

connect().then(() => {
  const app = express()

  app.use(morgan('tiny'))
  app.use(cors())

  app.get('/healthcheck', (req, res) => {
    return res.status(200).send('ok')
  })

  app.use(jwtCheck)
  app.use(async (req, res, next) => {
    //@ts-ignore
    const email = req.user?.['https://fragment.ml/email'] as string | undefined
    if (email) {
      let user = await DbUser.findOne({ email })
      if (!user) user = await initializeUser(email)
      //@ts-ignore
      req.user = user
    }
    next()
  })

  const apolloServer = new ApolloServer({
    schema,
    context: createContext,
    introspection: true,
    playground: true,
  })

  apolloServer.applyMiddleware({ app: app })

  app.listen(port)
  console.log('server started on http://localhost:10000')
})
