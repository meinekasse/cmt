import { useRouter, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import { LoginForm } from "app/auth/components/LoginForm"
import { Center } from "@chakra-ui/layout"

const LoginPage: BlitzPage = () => {
  const router = useRouter()

  return (
    <Center h="100%" w="100%">
      <LoginForm
        onSuccess={(_user) => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/"
          router.push(next)
        }}
      />
    </Center>
  )
}

LoginPage.redirectAuthenticatedTo = "/"
LoginPage.getLayout = (page) => <Layout title="Log In">{page}</Layout>

export default LoginPage
