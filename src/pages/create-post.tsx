import { Box, Button } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useEffect } from "react";
import { InputField } from "../components/InputField";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { Layout } from "../components/Layout";
import { useRouter } from "next/router";

const CreatePost: React.FC<{}> = ({}) => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!data?.me && !fetching) {
      router.replace("/login");
    }
  }, [data, router]);
  const [, createPost] = useCreatePostMutation();
  return (
    <>
      <Layout variant="small">
        <Formik
          initialValues={{ text: "", title: "" }}
          onSubmit={async (values) => {
            const { error } = await createPost({ input: values });
            if (!error) {
              router.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="title">
                {() => (
                  <InputField
                    label="Post title:"
                    name="title"
                    placeholder="Input post title..."
                  />
                )}
              </Field>
              <Field name="text">
                {() => (
                  <Box mt={4}>
                    <InputField
                      isTextarea
                      label="Post text:"
                      name="text"
                      placeholder="Input post text..."
                    />
                  </Box>
                )}
              </Field>
              <Button
                colorScheme="teal"
                isLoading={isSubmitting}
                mt={4}
                type="submit"
              >
                Create post
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
