import { useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { SignupForm } from "app/auth/components/SignupForm"
import { Center } from "@chakra-ui/layout"

const SignupPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Center h="100%" w="100%">
      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </Center>
  )
}

SignupPage.redirectAuthenticatedTo = "/"
SignupPage.getLayout = (page) => <Layout title="Sign Up">{page}</Layout>

export default SignupPage
