import { fetchExchange, dedupExchange, stringifyVariables } from "urql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
  MeDocument,
  LoginMutation,
  MeQuery,
  RegisterMutation,
  LogoutMutation,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import { Exchange } from "urql";
import Router from "next/router";

export type MergeMode = "before" | "after";

export const cursorPagination = (): Resolver<any, any, any> => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const results: string[] = [];
    let hasMore = false;
    fieldInfos.forEach((fi) => {
      const key = cache.resolve(entityKey, fi.fieldKey) as string;
      const posts = cache.resolve(key, "posts") as string[];
      hasMore = cache.resolve(key, "hasMore") as boolean;
      results.push(...posts);
    });

    const key = cache.resolve(
      entityKey,
      `${fieldName}(${stringifyVariables(fieldArgs)})`
    ) as string;
    const isInCache = cache.resolve(key, "posts");

    info.partial = !!!isInCache;
    return { __typename: "PaginatedPosts", hasMore, posts: results };
  };
};

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        // If the OperationResult has an error send a request to sentry
        if (error?.message.includes("Not authenticated")) {
          // the error is a CombinedError with networkError and graphqlErrors properties
          Router.push("/login");
        }
      })
    );
  };

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      keys: {
        PaginatedPosts: () => null,
      },
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          createPost(_result, _, cache, __) {
            const allFields = cache.inspectFields("Query");
            const fieldInfos = allFields.filter(
              (field) => field.fieldName === "posts"
            );
            fieldInfos.forEach((fi) =>
              cache.invalidate("Query", "posts", fi.arguments)
            );
          },
          login: (_result, _, cache, __) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          logout: (_result, _, cache, __) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          register: (_result, _, cache, __) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    errorExchange,
    ssrExchange,
    fetchExchange,
  ],
});
