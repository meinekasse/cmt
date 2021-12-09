// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from "@chakra-ui/react"

// 2. Add your color mode config
const config = {
  initialColorMode: "dark", // options are light or dark
  useSystemColorMode: true, // options are true or false
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme
