import { ManagementClient } from 'auth0'

const client = new ManagementClient({
  domain: 'fragment-app.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users update:users',
})
