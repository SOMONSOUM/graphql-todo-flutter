import { gql } from "apollo-server";

export default gql`

  type User{
    id: ID!,
    name: String!,
    email: String!,
    password: String!,
    role: String!,
    isAdmin: Boolean!,
    isActive: Boolean!,
    token:String!,
  }
  type ErrorMessage{
    message: String
  }

  type UsersPayload{
    errors: [ErrorMessage!]!,
    data: [User!]
  }
  type UserPayload{
    errors: [ErrorMessage!]!,
    data: User
  }

  input UserInput{
    name: String,
    email: String!,
    password: String!
  }

  type Query{
    users: UsersPayload!
    user(id: ID!): UserPayload!
    profile: UserPayload!
  }
  type Mutation{
    registerUser(input: UserInput!): UserPayload!
    logInUser(input: UserInput!): UserPayload!
    logOutUser: UserPayload!
  }

`