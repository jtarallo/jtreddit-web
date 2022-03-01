import { Box, Heading, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { SnippetPostFragment } from "../generated/graphql";
import UpvoteSection from "./UpvoteSection";

interface PostCardProps {
  post: SnippetPostFragment;
  observe: (element?: HTMLElement | null | undefined) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, observe }) => {
  return (
    <Box
      backgroundColor={"gray.700"}
      borderRadius="sm"
      borderWidth="1px"
      color={"white"}
      key={post.id}
      position="relative"
      px={4}
      py={2}
      ref={observe}
      shadow="xs"
      width="100%"
    >
      <UpvoteSection post={post} />
      <Heading fontSize={"2xl"} p={4}>
        <Link href="/post/[id]" as={`/post/${post.id}`}>
          {post.title}
        </Link>
      </Heading>
      <Text px={8} pb={8} pt={4}>
        {post.textSnippet}
      </Text>
      <Flex justifyContent="end" width="full" fontSize={"sm"}>
        <Text>by @</Text>
        <Text fontWeight={700}>{post.poster.username}</Text>
        <Text>&nbsp;at {new Date(post.createdAt).toLocaleString()}</Text>
      </Flex>
    </Box>
  );
};
