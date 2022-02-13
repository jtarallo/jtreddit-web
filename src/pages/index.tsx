import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Wrapper } from "../components/Wrapper";
import { Flex } from "@chakra-ui/react";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <Wrapper>
        {!data ? (
          <div>loading...</div>
        ) : (
          data.posts.map((p) => (
            <Flex key={p.id} p={4}>
              {p.title}
            </Flex>
          ))
        )}
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
