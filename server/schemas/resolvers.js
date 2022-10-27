const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
      if (context.user) {
        const data = await User.findOne({ _id: context.user._id }).select('-__v').populate('savedBooks');

        return data;
      }
      throw new AuthenticationError('You are not logged in');
    },
  },
  Mutation: {
    login: async (_parent, { email, password }, _args, _context) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('incorrect login');
      }
      const correctPassword = await user.isCorrectPassword(password);
      if (!correctPassword) {
        throw new AuthenticationError('incorrect password');
      }
      const token = signToken(user);
      return { token, user };
    },
    addUser: async (_parent, args, _context) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_parent, { bookData }, _args, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id }, { $push: { savedBooks: { ...bookData }}}, { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in');
    },
    removeBook: async (parent, { params }, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id }, { $pull: { savedBooks: { bookId: params.bookId }}}, { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in')
    },
  },
};

module.exports = resolvers;