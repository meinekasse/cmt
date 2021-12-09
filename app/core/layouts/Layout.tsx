import { Head, BlitzLayout } from "blitz"
import { Container, Flex } from "@chakra-ui/layout"

const Layout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title || "customer-management-blitz"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container p={0}>
        <Flex flexDirection="column" h="auto">
          {children}
        </Flex>
      </Container>
    </>
  )
}

export default Layout
