const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    bookCount: Int
    SavedBooks: [Book]!
  }
  type Book {
  _id: ID
    authors: [String]
    description: String
    bookId: String!
    title: String
    image: String
    link: String
  }
  type Auth {
    token: ID!
    user: User
  }
  input BookInput {
    authors: [String]
    description: String!
    bookId: ID!
    title: String!
    image: String
    link: String
  }
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
