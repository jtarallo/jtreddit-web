import { Flex } from "@chakra-ui/react";
import Link, { LinkProps } from "next/link";
import React from "react";

type LinkFlexPaddedProps = React.PropsWithChildren<LinkProps> & {
  label: string;
};

export const LinkFlexPadded: React.FC<LinkFlexPaddedProps> = (props) => {
  return (
    <Flex p={4}>
      <Link {...props}>{props.label}</Link>
    </Flex>
  );
};
