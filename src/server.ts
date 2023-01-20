import { ApolloServer, gql } from 'apollo-server'
import colors from 'colors'
import dotenv from 'dotenv'
import _ from 'lodash'
import user from './graphql/schema/user'
import UserResolver from './graphql/resolver/UserResolver'
import sequelize from './config/sequelize'
import User from './model/User'
import getUserFromToken from './middleware/getUserFromToken'
import Todo from './model/Todo'
import todo from './graphql/schema/todo'
import TodoResolver from './graphql/resolver/TodoResolver'
import { Context } from './utility/contextType'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core'

dotenv.config()

const baseTypeDef = gql`
  type Query
`
const server = new ApolloServer({
  typeDefs: [baseTypeDef, user, todo],
  resolvers: _.merge({}, UserResolver, TodoResolver),
  introspection: process.env.APPLICATION_ENV !== 'production',
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageGraphQLPlayground()
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
  context: async ({ req }): Promise<Context> => {
    const user = await getUserFromToken(req.headers.authorization!)
    return {
      user,
    }
  },
})

User.hasMany(Todo, { constraints: true, onDelete: 'CASCADE' })
Todo.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })

sequelize
  .sync({ alter: true })
  .then((url) => {
    console.log(
      colors.bgGreen.inverse(
        `Database connected ${url.config.host}-${url.config.username}-${url.config.database} ${url.config.port}`,
      ),
    )
  })
  .catch((err: any) => {
    console.error(colors.red.underline(`Database connection error: ${err}`))
  })

server
  .listen({ port: 4001 })
  .then(({ url }) => {
    console.log(
      colors.cyan.bold.inverse(
        `Server in ${process.env.NODE_ENV} is running on ${url}`,
      ),
    )
  })
  .catch((err: any) => {
    console.error(colors.red.bold(`Error Connection: ${err}`))
  })
