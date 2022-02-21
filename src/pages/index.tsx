import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import useInView from "react-cool-inview";
import { useState } from "react";

const Index = () => {
  const [postQueryVars, setPostQueryVars] = useState<{
    limit: number;
    cursor: string | null;
  }>({
    limit: 10,
    cursor: null,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables: postQueryVars,
  });

  const { observe } = useInView({
    // For better UX, we can grow the root margin so the data will be loaded earlier
    rootMargin: "50px 0px",
    // When the last item comes to the viewport
    onEnter: ({ unobserve }) => {
      // Pause observe when loading data
      unobserve();
      // Load more data
      if (data && data.posts && data.posts.length) {
        setPostQueryVars({
          limit: postQueryVars.limit,
          cursor: data.posts[data.posts.length - 1].createdAt,
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
        <VStack spacing={6} align="center">
          {data.posts.map((p, idx) => (
            <Box
              borderRadius="lg"
              borderWidth="2px"
              key={p.id}
              p={5}
              shadow="md"
              width="100%"
              backgroundColor={"purple.500"}
              ref={idx === data.posts.length - 1 ? observe : null}
            >
              <Heading fontSize={"2xl"}>{p.title}</Heading>
              <Text>{p.textSnippet}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
