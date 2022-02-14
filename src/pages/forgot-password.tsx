import { Button } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { withUrqlClient } from "next-urql";
import Link from "next/link";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

export const ForgotPassword: React.FC<{}> = ({}) => {
  const [submitted, setSubmitted] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();

  return !submitted ? (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgotPassword({ email: values.email });
          setSubmitted(true);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="email">
              {() => (
                <InputField
                  label="Email:"
                  name="email"
                  placeholder="Input your email..."
                />
              )}
            </Field>
            <Button
              colorScheme="teal"
              isLoading={isSubmitting}
              mt={4}
              type="submit"
            >
              Send reset link
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  ) : (
    <Wrapper>
      <p>An email has been sent to your inbox if the email was valid.</p>
      <Link href="/">Go to home</Link>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPassword);
