import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useVoteMutation, StandardPostFragment } from "../generated/graphql";

interface UpvoteSectionProps {
  post: StandardPostFragment;
}

const UpvoteSection: React.FC<UpvoteSectionProps> = ({ post }) => {
  const [{ fetching }, vote] = useVoteMutation();

  const onVote = (postId: string, value: number) => {
    vote({ postId, value });
  };

  return (
    <Flex pos={"absolute"} align="center" right={2} top={1} direction="row">
      <Text
        p={4}
        color={
          post.points > 0
            ? "green.400"
            : post.points === 0
            ? "white"
            : "red.400"
        }
      >
        {post.points} points
      </Text>
      <Flex direction="column">
        <ChevronUpIcon
          aria-label="upvote"
          h={6}
          w={6}
          _hover={{ color: fetching ? "grey" : "green.400" }}
          onClick={() => (!fetching ? onVote(post.id, 1) : null)}
          cursor="pointer"
        />
        <ChevronDownIcon
          aria-label="downvote"
          h={6}
          w={6}
          _hover={{ color: fetching ? "grey" : "red.400" }}
          onClick={() => (!fetching ? onVote(post.id, -1) : null)}
          cursor="pointer"
        />
      </Flex>
    </Flex>
  );
};

export default UpvoteSection;
