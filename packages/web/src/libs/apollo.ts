import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
});

export const useInitializeApolloClient = (
  getAccessTokenSilently: () => any
) => {
  const authLink = setContext(async (_, { headers }) => {
    const token = await getAccessTokenSilently();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Fragment: {
          keyFields: ["uuid"],
          fields: {
            createdAt: {
              read(createdAt) {
                return new Date(createdAt);
              },
            },
          },
        },
        User: { keyFields: ["email"] },
      },
    }),
  });

  return { client };
};
