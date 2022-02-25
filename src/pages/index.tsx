import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery, useVoteMutation } from "../generated/graphql";
import { Box, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import useInView from "react-cool-inview";
import { useState } from "react";
import { INITIAL_POST_QUERY_VARS } from "../utils/globalConstants";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const Index = () => {
  const [postQueryVars, setPostQueryVars] = useState<{
    limit: number;
    cursor?: string | null;
  }>(INITIAL_POST_QUERY_VARS);

  const [{ data, fetching }] = usePostsQuery({
    variables: postQueryVars,
  });

  const [, vote] = useVoteMutation();

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

  const onVote = (postId: string, value: number) => {
    vote({ postId, value });
  };

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
              borderWidth="1px"
              color={"white"}
              key={p.id}
              position="relative"
              px={4}
              py={2}
              ref={idx === data.posts.posts.length - 1 ? observe : null}
              shadow="xs"
              width="100%"
            >
              <Flex
                pos={"absolute"}
                align="center"
                right={2}
                top={1}
                direction="row"
              >
                <Text
                  p={4}
                  color={
                    p.points > 0
                      ? "green.400"
                      : p.points === 0
                      ? "white"
                      : "red.400"
                  }
                >
                  {p.points} points
                </Text>
                <Flex direction="column">
                  <ChevronUpIcon
                    h={6}
                    w={6}
                    _hover={{ color: "green.400" }}
                    onClick={() => onVote(p.id, 1)}
                  />
                  <ChevronDownIcon
                    h={6}
                    w={6}
                    _hover={{ color: "red.400" }}
                    onClick={() => onVote(p.id, -1)}
                  />
                </Flex>
              </Flex>
              <Heading fontSize={"2xl"} p={4}>
                {p.title}
              </Heading>
              <Text px={8} pb={8} pt={4}>
                {p.textSnippet}
              </Text>
              <Flex justifyContent="end" width="full" fontSize={"sm"}>
                <Text>by @</Text>
                <Text fontWeight={700}>{p.poster.username}</Text>
                <Text>&nbsp;at {new Date(p.createdAt).toLocaleString()}</Text>
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
