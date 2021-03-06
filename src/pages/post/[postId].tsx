import React from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useRouter } from "next/router";
import { usePostQuery } from "../../generated/graphql";
import { Layout } from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/react";
import { EditAndDeleteButtons } from "../../components/EditAndDeleteButtons";

const Post: React.FC = ({}) => {
  const router = useRouter();
  const [{ data, error, fetching }] = usePostQuery({
    variables: { postId: router.query.postId as string },
  });

  if (fetching) {
    return <Layout>Fetching post...</Layout>;
  }

  if (error) {
    return <Layout>There was an error.</Layout>;
  }

  if (!data || !data.post) {
    return <Layout>Couldn't fetch post.</Layout>;
  }

  const { post } = data;

  return (
    <Layout>
      <Heading>{post.title}</Heading>
      <Box p={6} mb={8}>
        {post.text}
      </Box>
      <EditAndDeleteButtons posterId={post.poster.id} postId={post.id} />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
