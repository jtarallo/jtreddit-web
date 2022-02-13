import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import { LinkFlexPadded } from "./LinkFlexPadded";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { isServer } from "../utils/isServer";

export const NavBar: React.FC = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();

  let body = null;

  if (fetching) {
    body = <>loading</>;
  } else if (!data?.me) {
    body = (
      <>
        <LinkFlexPadded href="/login" label="login" />
        <LinkFlexPadded href="/register" label="register" />
      </>
    );
  } else {
    body = (
      <>
        <LinkFlexPadded href="/" label={`Logged in as ${data.me.username}`} />
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
    <Flex bg="teal" p={4}>
      <Flex ml="auto" flexDirection={"row"} placeItems="center">
        {body}
      </Flex>
    </Flex>
  );
};
