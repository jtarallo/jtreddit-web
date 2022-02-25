import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Text, VStack } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import useInView from "react-cool-inview";
import { useState } from "react";
import { INITIAL_POST_QUERY_VARS } from "../utils/globalConstants";
import { PostCard } from "../components/PostCard";

const Index = () => {
  const [postQueryVars, setPostQueryVars] = useState<{
    limit: number;
    cursor?: string | null;
  }>(INITIAL_POST_QUERY_VARS);

  const [{ data, fetching }] = usePostsQuery({
    variables: postQueryVars,
  });

  const { observe } = useInView({
    rootMargin: "100px 0px",
    onEnter: ({ unobserve }) => {
      unobserve();
      if (data?.posts?.posts.length && data?.posts?.hasMore) {
        setPostQueryVars({
          limit: postQueryVars.limit,
          cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
        });
      }
    },
  });

  return (
    <Layout>
      {fetching && !data ? (
        <>loading...</>
      ) : !data ? (
        <>No data to show</>
      ) : (
        <VStack spacing={6} pb={6}>
          {data.posts.posts.map((p, idx) => (
            <PostCard
              post={p}
              observe={idx === data.posts.posts.length - 1 ? observe : () => {}}
            />
          ))}
          {!data.posts.hasMore ? (
            <Text px={8} pb={8} pt={4}>
              Last post loaded
            </Text>
          ) : null}
        </VStack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
