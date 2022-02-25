import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import useInView from "react-cool-inview";
import { useState } from "react";
import { INITIAL_POST_QUERY_VARS } from "../utils/globalConstants";

const Index = () => {
  const [postQueryVars, setPostQueryVars] = useState<{
    limit: number;
    cursor?: string | null;
  }>(INITIAL_POST_QUERY_VARS);

  const [{ data, fetching }] = usePostsQuery({
    variables: postQueryVars,
  });

  const { observe } = useInView({
    // For better UX, we can grow the root margin so the data will be loaded earlier
    rootMargin: "100px 0px",
    // When the last item comes to the viewport
    onEnter: ({ unobserve }) => {
      // Pause observe when loading data
      unobserve();
      // Load more data
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
            <Box
              backgroundColor={"gray.700"}
              borderRadius="lg"
              borderWidth="2px"
              color={"white"}
              key={p.id}
              px={4}
              py={2}
              ref={idx === data.posts.posts.length - 1 ? observe : null}
              shadow="md"
              width="100%"
            >
              <Heading fontSize={"2xl"} p={4}>
                {p.title}
              </Heading>
              <Text px={8} pb={8} pt={4}>
                {p.textSnippet}
              </Text>
              <Flex justifyContent="end" width="full" fontSize={"sm"}>
                <Text>by @</Text>
                <Text fontWeight={700}>{p.poster.username}</Text>
                <Text>
                  &nbsp;at {new Date(p.createdAt).toLocaleDateString()}
                </Text>
              </Flex>
            </Box>
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
