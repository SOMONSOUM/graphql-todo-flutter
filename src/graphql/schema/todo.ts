import { gql } from "apollo-server";

export default gql`

  type Todo{
    id: ID!,
    title: String!,
    content: String!,
    user: User!,
    createdAt: String!,
    updatedAt: String!
  }

  type TodosPayload{
    errors: [ErrorMessage!]!,
    data: [Todo!],
    length: Int,
  }
  type TodoPayload{
    errors: [ErrorMessage!]!,
    data: Todo
  }

  input InputTodo{
    title: String,
    content: String
  }

  type Query{
    todos: TodosPayload,
    todo(id: ID!): TodoPayload
  }
  type Mutation{
    createTodo(input: InputTodo!): TodoPayload
    updateTodo(id: ID!, input: InputTodo!): TodoPayload
    deleteTodo(id: ID!): TodoPayload
  }
    
`