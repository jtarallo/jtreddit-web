import React from "react";
import { Field, Form, Formik } from "formik";
import { Button, Box } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

const Register: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="username">
              {() => (
                <InputField
                  label="User name:"
                  name="username"
                  placeholder="Choose a username..."
                />
              )}
            </Field>
            <Field name="email">
              {() => (
                <InputField
                  label="Email:"
                  name="email"
                  placeholder="Type your email address..."
                  type="email"
                />
              )}
            </Field>
            <Field name="password">
              {() => (
                <Box mt={4}>
                  <InputField
                    label="Password:"
                    name="password"
                    placeholder="Choose a password..."
                    type="password"
                  />
                </Box>
              )}
            </Field>
            <Button
              colorScheme="teal"
              isLoading={isSubmitting}
              mt={4}
              type="submit"
              value="Register"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Register);
