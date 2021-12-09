import { Box, Container, Flex } from "@chakra-ui/layout"
import { SimpleGrid, css } from "@chakra-ui/react"
import { Role } from "db"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Link, Routes, RouteUrlObject } from "blitz"
import { useCurrentUser } from "../core/hooks/useCurrentUser"
import { PropsWithChildren, Suspense } from "react"
import { FlexLoader } from "../core/components/FlexLoader"

const HomeLinkBox: React.FC<
  PropsWithChildren<{ href: RouteUrlObject; bgColor?: string; color?: string }>
> = ({ children, href, bgColor = "transparent", color = "black" }) => {
  const cubeBox = 200
  return (
    <Link href={href}>
      <Flex
        alignItems="center"
        justifyContent="center"
        w="100%"
        h={cubeBox}
        bgColor={bgColor}
        color={color}
        cursor="pointer"
        rounded="md"
        fontWeight="bold"
        fontSize="3xl"
        shadow="md"
      >
        {children}
      </Flex>
    </Link>
  )
}

const HomeComponent = () => {
  const currentUser = useCurrentUser()
  return (
    <Container px={0} py={10}>
      <SimpleGrid
        gap={4}
        columns={
          (currentUser && currentUser.roles.includes(Role.ADMIN)) ||
          currentUser?.roles.includes(Role.WORKER)
            ? 2
            : 1
        }
      >
        {currentUser ? (
          <>
            <HomeLinkBox href={Routes.CompaniesPage()} bgColor="green.400" color="white">
              Firmen
            </HomeLinkBox>
            {currentUser.roles.includes(Role.ADMIN) && (
              <>
                <HomeLinkBox href={Routes.ProductsPage()} bgColor="blue.400" color="white">
                  Produkte
                </HomeLinkBox>
                <HomeLinkBox href={Routes.UsersPage()} bgColor="yellow.400">
                  Benutzer
                </HomeLinkBox>
                <HomeLinkBox href={Routes.SettingsPage()} bgColor="gray.600" color="white">
                  Einstellungen
                </HomeLinkBox>
              </>
            )}
          </>
        ) : (
          <HomeLinkBox href={Routes.LoginPage()} bgColor="green.400" color="white">
            Login
          </HomeLinkBox>
        )}
      </SimpleGrid>
    </Container>
  )
}
const Home: BlitzPage = () => {
  return (
    <Suspense fallback={<FlexLoader />}>
      <HomeComponent />
    </Suspense>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
