import { Box, Heading, Flex, Text, Button } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Link from "next/link";
import React from "react";
import {
  SnippetPostFragment,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";
import UpvoteSection from "./UpvoteSection";
import { useRouter } from "next/router";
import { isServer } from "../utils/isServer";

interface PostCardProps {
  post: SnippetPostFragment;
  observe: (element?: HTMLElement | null | undefined) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, observe }) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();
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
        <Link href="/post/[postId]" as={`/post/${post.id}`}>
          {post.title}
        </Link>
      </Heading>
      <Text px={8} pb={8} pt={4}>
        {post.textSnippet}
      </Text>
      <Flex>
        <Flex justifyContent="begin" width="full" fontSize={"sm"}>
          <Text>by @</Text>
          <Text fontWeight={700}>{post.poster.username}</Text>
          <Text>&nbsp;at {new Date(post.createdAt).toLocaleString()}</Text>
        </Flex>
        {post.poster.id === data?.me?.id ? (
          <>
            <Button mr={2} onClick={() => router.push(`/post/edit/${post.id}`)}>
              <EditIcon />
            </Button>
            <Button onClick={() => deletePost({ id: post.id })}>
              <DeleteIcon />
            </Button>
          </>
        ) : null}
      </Flex>
    </Box>
  );
};
