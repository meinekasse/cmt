import { Flex } from "@chakra-ui/layout"
import { Spinner } from "@chakra-ui/spinner"

export const Loader = () => {
  return (
    <Flex alignItems="center" justifyContent="center" h="100%" w="100%">
      <Spinner size="md" color="blue.500" />
    </Flex>
  )
}
