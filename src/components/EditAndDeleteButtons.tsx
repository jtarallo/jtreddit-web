import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface EditAndDeleteButtonsProps {
  postId: string;
  posterId: string;
}

export const EditAndDeleteButtons: React.FC<EditAndDeleteButtonsProps> = ({
  postId,
  posterId,
}) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();

  if (!data || data.me?.id !== posterId) {
    return null;
  }

  return (
    <>
      <Button mr={2} onClick={() => router.push(`/post/edit/${postId}`)}>
        <EditIcon />
      </Button>
      <Button
        onClick={() => {
          deletePost({ id: postId });
          router.back();
        }}
      >
        <DeleteIcon />
      </Button>
    </>
  );
};
