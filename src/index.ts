import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { MoviesAPI } from './datasources/movie';

const typeDefs = readFileSync('./schema.graphql', 'utf-8');

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  }
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

interface ContextValue {
  token: string;
  dataSources: {
    moviesAPI: MoviesAPI;
  }
}

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
})

function getTokenFromRequest(req) {
  return req.headers.authorization;
}

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = getTokenFromRequest(req);
    const { cache } = server;
    return {
      token,
      dataSources: {
        moviesAPI: new MoviesAPI({ token, cache }),
      }
    }
  }
});

console.log(`🚀 Server ready at: ${url}`);
