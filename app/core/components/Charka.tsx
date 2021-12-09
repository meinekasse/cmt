import { ChakraProvider, cookieStorageManager, localStorageManager } from "@chakra-ui/react"
import { useCurrentUser } from "../hooks/useCurrentUser"

export function Chakra({ cookies, children }) {
  const user = useCurrentUser()
  const colorModeManager =
    typeof cookies === "string" ? cookieStorageManager(cookies) : localStorageManager
  colorModeManager.set(user?.colorMode ?? "light")
  return <ChakraProvider colorModeManager={colorModeManager}>{children}</ChakraProvider>
}

// also export a reusable function getServerSideProps
export function getServerSideProps({ req }) {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  }
}
