const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
mongoose.set("strictQuery", false);

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String]
    id: ID!
  }
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          if (args.genre) {
            return await Book.find({
              author: author.id,
              genres: { $in: [args.genre] },
            }).populate("author");
          }
          return await Book.find({ author: author.id }).populate("author");
        }
        return null;
      }
      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
      }
      return Book.find({}).populate("author");
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      return authors.map(async (author) => {
        const bookCount = await Book.countDocuments({ author: author.id });
        return {
          name: author.name,
          born: author.born,
          bookCount,
        };
      });
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      const author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Error creating author: " + error.message, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Error creating book: " + error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      return book;
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: {
            code: "NOT_FOUND",
            invalidArgs: args.name,
          },
        });
      }

      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Error updating author: " + error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      return author;
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "password") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET) };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
