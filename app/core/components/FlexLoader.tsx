import { Flex } from "@chakra-ui/layout"
import { Loader } from "./Loader"
export const FlexLoader: React.FC = () => (
  <Flex w="100%" h="100%" alignContent="center" justifyContent="center">
    <Loader />
  </Flex>
)
