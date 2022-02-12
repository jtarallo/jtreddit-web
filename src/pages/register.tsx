import React from "react";
import { Field, Form, Formik } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Box,
} from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useMutation } from "urql";

interface registerProps {}

const REGISTER_MUT = `
mutation Register($username:String!, $password:String!){
  register(options:{username: $username, password: $password}) {
    errors {
      field
      message
    }
    user {
      id
    }
  }
}`;

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUT);

  const validatePassword = (value: string) => {
    let error;
    if (!value) {
      error = "Password is required";
    } else if (value.length < 6) {
      error = "Password must have at least 6 characters";
    }
    return error;
  };

  const validateUsername = (value: string) => {
    let error;
    if (!value) {
      error = "Name is required";
    }
    return error;
  };

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => register(values)}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="username" validate={validateUsername}>
              {({ field, form }) => (
                <InputField
                  label="User name:"
                  name="username"
                  placeholder="Choose a username..."
                />
              )}
            </Field>
            <Field name="password" validate={validatePassword}>
              {({ field, form }) => (
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

export default Register;
