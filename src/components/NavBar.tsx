import { Button, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { LinkFlexPadded } from "./LinkFlexPadded";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { UilPlus } from "@iconscout/react-unicons";
import ColorModeSwitch from "./ColorModeSwitch";
import { isServer } from "../utils/isServer";
import Link from "next/link";

export const NavBar: React.FC = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();

  let body = null;
  const createPostButton = (
    <Flex mr={4}>
      <Button
        onClick={() => {
          router.push("/create-post");
        }}
      >
        <UilPlus />
      </Button>
    </Flex>
  );

  if (fetching) {
    body = <>loading</>;
  } else if (!data?.me) {
    body = (
      <>
        {createPostButton}
        <LinkFlexPadded href="/login" label="login" />
        <LinkFlexPadded href="/register" label="register" />
      </>
    );
  } else {
    body = (
      <>
        <LinkFlexPadded href="/" label={`Logged in as ${data.me.username}`} />
        {createPostButton}
        <Flex>
          <Button
            isLoading={logoutFetching}
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Logout
          </Button>
        </Flex>
      </>
    );
  }
  return (
    <Flex
      bg="teal"
      p={4}
      position="sticky"
      alignItems="center"
      top={0}
      zIndex={10}
    >
      <Heading fontSize={"3xl"}>
        <Link href="/" as="/">
          JTReddit
        </Link>
      </Heading>
      <Flex ml="auto" flexDirection={"row"} placeItems="center">
        <ColorModeSwitch />
        {body}
      </Flex>
    </Flex>
  );
};
