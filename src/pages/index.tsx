import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Flex } from "@chakra-ui/react";
import { Layout } from "../components/Layout";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => (
          <Flex key={p.id} p={4}>
            {p.title}
          </Flex>
        ))
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
