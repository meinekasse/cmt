import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { Center, HStack, Text, VStack, Flex, Stack, Container, Box } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/button"
import Icon from "@chakra-ui/icon"
import { ChevronRightIcon } from "@heroicons/react/outline"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

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
        <Text fontSize="2xl">Login</Text>
        <Form
          style={{ width: "100%" }}
          schema={Login}
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            try {
              const user = await loginMutation(values)
              props.onSuccess?.(user)
            } catch (error: any) {
              if (error instanceof AuthenticationError) {
                return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
              } else {
                return {
                  [FORM_ERROR]:
                    "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
                }
              }
            }
          }}
        >
          <LabeledTextField name="email" label="Email" placeholder="Email" />
          <LabeledTextField
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
          />
          <div>
            <Link href={Routes.ForgotPasswordPage()}>
              <a color="blue">Forgot your password?</a>
            </Link>
          </div>
          <Flex w="100%" experimental_spaceX={2}>
            <Link href={Routes.SignupPage()}>
              <Button marginLeft="auto" colorScheme="gray">
                <Flex experimental_spaceX={2}>
                  <Text>Sign Up</Text>
                </Flex>
              </Button>
            </Link>
            <Button type="submit" marginLeft="auto" colorScheme="blue">
              <Flex experimental_spaceX={2}>
                <Text>Login</Text>
                <ChevronRightIcon width={20} height={20} />
              </Flex>
            </Button>
          </Flex>
        </Form>
      </Stack>
    </Box>
  )
}

export default LoginForm
