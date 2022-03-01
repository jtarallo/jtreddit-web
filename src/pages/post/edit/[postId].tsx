import React from "react";
import { useRouter } from "next/router";
import { Box, Button } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { withUrqlClient } from "next-urql";
import { InputField } from "../../../components/InputField";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { Layout } from "../../../components/Layout";
import { useIsAuth } from "../../../utils/useIsAuth";

const EditPost: React.FC<{}> = ({}) => {
  useIsAuth();
  const router = useRouter();
  const [{ data, error, fetching }] = usePostQuery({
    variables: { postId: router.query.postId as string },
  });
  const [, updatePost] = useUpdatePostMutation();

  if (fetching) {
    return <Layout>Fetching post...</Layout>;
  }

  if (error) {
    return <Layout>There was an error.</Layout>;
  }

  if (!data || !data.post) {
    return <Layout>Couldn't fetch post.</Layout>;
  }

  const { text, title } = data?.post;

  return (
    <>
      <Layout variant="small">
        <Formik
          initialValues={{ text, title }}
          onSubmit={async (values) => {
            const { error } = await updatePost({
              id: data.post?.id!,
              input: values,
            });
            if (!error) {
              router.back();
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="title">
                {() => <InputField label="Post title:" name="title" />}
              </Field>
              <Field name="text">
                {() => (
                  <Box mt={4}>
                    <InputField isTextarea label="Post text:" name="text" />
                  </Box>
                )}
              </Field>
              <Button
                colorScheme="teal"
                isLoading={isSubmitting}
                mt={4}
                type="submit"
              >
                Update post
              </Button>
            </Form>
          )}
        </Formik>
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
