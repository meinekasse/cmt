import { useMutation, Link, Routes } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import signup from "app/auth/mutations/signup"
import { Signup } from "app/auth/validations"
import { Box, Text, Stack, Flex } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/button"
import { ChevronRightIcon } from "@heroicons/react/outline"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)

  return (
    <Box w="100%" marginTop={20}>
      <Stack
        experimental_spaceY={2}
        marginTop="auto"
        p={4}
        border="1px solid rgba(0,0,0,0.1)"
        shadow="md"
        rounded="md"
      >
        <Text fontSize="2xl">Create an Account</Text>
        <Form
          style={{ width: "100%" }}
          schema={Signup}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            try {
              await signupMutation(values)
              props.onSuccess?.()
            } catch (error: any) {
              if (error.code === "P2002" && error.meta?.target?.includes("email")) {
                // This error comes from Prisma
                return { email: "This email is already being used" }
              } else {
                return { [FORM_ERROR]: error.toString() }
              }
            }
          }}
        >
          <LabeledTextField name="name" label="Name" placeholder="Name" />
          <LabeledTextField name="surname" label="Nachname" placeholder="Nachname" />
          <LabeledTextField type="email" name="email" label="Email" placeholder="Email" />
          <LabeledTextField
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
          />
          <Flex wFull experimental_spaceX={2}>
            <Link href={Routes.LoginPage()}>
              <Button marginLeft="auto" colorScheme="gray">
                <Flex experimental_spaceX={2}>
                  <Text>Login</Text>
                </Flex>
              </Button>
            </Link>
            <Button type="submit" marginLeft="auto" colorScheme="blue">
              <Flex experimental_spaceX={2}>
                <Text>Sign Up</Text>
                <ChevronRightIcon width={20} height={20} />
              </Flex>
            </Button>
          </Flex>
        </Form>
      </Stack>
    </Box>
  )
}

export default SignupForm
