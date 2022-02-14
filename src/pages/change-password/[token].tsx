import { Box, Button } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import router from "next/router";
import { NextPage } from "next/types";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import { useChangePasswordMutation } from "../../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";

export const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ password: "", token }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const response = await changePassword({
            token: values.token,
            password: values.password,
          });
          if (response.data?.changePassword.errors) {
            setErrors(toErrorMap(response.data.changePassword.errors));
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="password">
              {() => (
                <Box mt={4}>
                  <InputField
                    label="New password:"
                    name="password"
                    placeholder="Input your password..."
                    type="password"
                  />
                </Box>
              )}
            </Field>
            <Field name="token">
              {() => <InputField type="hidden" name="token" value={token} />}
            </Field>
            <Button
              colorScheme="teal"
              isLoading={isSubmitting}
              mt={4}
              type="submit"
            >
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
