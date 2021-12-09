import { IconButton } from "@chakra-ui/button"
import { Container, Link as ChakraLink, Spacer, Flex } from "@chakra-ui/layout"
import { useColorModeValue } from "@chakra-ui/react"
import { LoginIcon, LogoutIcon } from "@heroicons/react/outline"
import { HomeIcon, UserIcon } from "@heroicons/react/solid"
import { Link, Routes, useMutation, useRouter } from "blitz"
import React, { Suspense } from "react"
import logout from "../../auth/mutations/logout"
import { useCurrentUser } from "../hooks/useCurrentUser"
import { Loader } from "./Loader"

const LoginLogoutArea = () => {
  const router = useRouter()
  const [logoutMutation] = useMutation(logout)
  const currentUser = useCurrentUser()
  return (
    <Flex flexDirection="row" experimental_spaceX={2}>
      {currentUser ? (
        <>
          <Link href={Routes.UsersPage()} passHref>
            <ChakraLink>
              <IconButton aria-label="" icon={<UserIcon width="24px" />} />
            </ChakraLink>
          </Link>
          <IconButton
            aria-label=""
            onClick={async () => {
              await logoutMutation()
              router.push(Routes.Home())
            }}
            icon={<LogoutIcon width="24px" />}
          />
        </>
      ) : (
        <Link href={Routes.LoginPage()} passHref>
          <ChakraLink textDecoration="none !important">
            <IconButton aria-label="" icon={<LoginIcon width="24px" />} vairant="filled" />
          </ChakraLink>
        </Link>
      )}
    </Flex>
  )
}
const Header = () => {
  const headerBgColor = useColorModeValue("white", "gray.800")
  return (
    <Container
      display="flex"
      pos="fixed"
      py={2}
      px={2}
      zIndex={1000}
      flexDirection="row"
      alignContent="center"
      alignSelf="center"
      justifyContent="center"
      w="100vw"
      bgColor={headerBgColor}
    >
      <Link href={Routes.Home()} passHref>
        <ChakraLink textDecoration="none !important">
          <IconButton
            vairant="filled"
            icon={<HomeIcon width="24px" height="24px" />}
            aria-label=""
          />
        </ChakraLink>
      </Link>
      <Spacer />
      <Suspense fallback={<Loader />}>
        <LoginLogoutArea />
      </Suspense>
    </Container>
  )
}

export default Header
