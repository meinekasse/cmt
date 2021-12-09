import { Button, IconButton } from "@chakra-ui/button"
import { Flex, Link as ChakraLink, Spacer, Text } from "@chakra-ui/layout"
import { PencilIcon, TrashIcon, AtSymbolIcon } from "@heroicons/react/solid"
import Layout from "app/core/layouts/Layout"
import deleteUser from "app/users/mutations/deleteUser"
import getUser from "app/users/queries/getUser"
import { BlitzPage, Head, Link, Routes, useMutation, useParam, useQuery, useRouter } from "blitz"
import { Role } from "db"
import { Suspense } from "react"
import { FlexLoader } from "../../core/components/FlexLoader"
import { useCurrentUser } from "../../core/hooks/useCurrentUser"

export const User = () => {
  const router = useRouter()
  const userId = useParam("userId", "number")
  const [deleteUserMutation] = useMutation(deleteUser)
  const [user] = useQuery(getUser, { id: userId })
  const currentUser = useCurrentUser()

  return user && currentUser ? (
    <>
      <Head>
        <title>
          {user.name} {user.surname}
        </title>
      </Head>

      <Flex w="100%" flexDirection="column" experimental_spaceY={2} py={4}>
        <Flex alignItems="center" flexDirection="row" experimental_spaceX={2}>
          <Flex
            flexGrow="1"
            flexDirection="row"
            bgColor="gray"
            rounded="md"
            alignItems="center"
            experimental_spaceX={2}
            px={4}
            height="40px"
          >
            <Text fontSize="xl" fontWeight="bold">
              {user.name} {user.surname}
            </Text>
          </Flex>
          {(user.id === currentUser.id || currentUser.roles.includes(Role.ADMIN)) && (
            <IconButton
              rounded="md"
              aria-label="edit company"
              colorScheme="blue"
              icon={<PencilIcon width="24px" height="24px" />}
              onClick={() => {
                router.push(Routes.EditUserPage({ userId: user.id }))
              }}
            />
          )}
          {user.id === currentUser.id ||
            (currentUser.roles.includes(Role.ADMIN) && (
              <IconButton
                rounded="md"
                aria-label="delete user"
                colorScheme="red"
                icon={<TrashIcon width="24px" height="24px" />}
                type="button"
                onClick={async () => {
                  if (window.confirm("This will be deleted")) {
                    await deleteUserMutation({ id: user.id })
                    router.push(Routes.Home())
                  }
                }}
              />
            ))}
        </Flex>
        <Flex w="100%" flexDirection="column" experimental_spaceY={2} alignItems="flex-start">
          <Flex
            flexGrow="1"
            flexDirection="row"
            bgColor="blue.300"
            color="black"
            rounded="md"
            w="100%"
            alignItems="center"
            experimental_spaceX={2}
            px={4}
            height="40px"
          >
            <AtSymbolIcon width="24px" height="24px" />
            <Text fontSize="xl" fontWeight="bold">
              {user.email}
            </Text>
          </Flex>
          <Flex
            flexGrow="1"
            flexDirection="row"
            bgColor={user.colorMode === "light" ? "white" : "black"}
            color={user.colorMode === "light" ? "black" : "white"}
            rounded="md"
            w="100%"
            alignItems="center"
            experimental_spaceX={2}
            px={4}
            height="40px"
          >
            <Text fontSize="xl" fontWeight="bold">
              Farbmodus:
            </Text>
            <Text fontSize="xl">{user.colorMode}</Text>
          </Flex>
          <Flex
            flexGrow="1"
            flexDirection="row"
            bgColor="green.300"
            color="black"
            rounded="md"
            w="100%"
            alignItems="center"
            experimental_spaceX={2}
            px={4}
            height="40px"
          >
            <Text fontSize="xl" fontWeight="bold">
              Rollen:
            </Text>
            {user.roles.map((role, index) => (
              <Text key={index} fontSize="xl">
                {role.toLowerCase()}
              </Text>
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Flex>
        <Link href={Routes.CompaniesPage()} passHref>
          <ChakraLink textDecoration="none !important">
            <Button>Back</Button>
          </ChakraLink>
        </Link>
        <Spacer />
      </Flex>
    </>
  ) : (
    <>Sorry you have to be logged in to view this page</>
  )
}

const ShowUserPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.UsersPage()}>
          <a>Users</a>
        </Link>
      </p>

      <Suspense fallback={<FlexLoader />}>
        <User />
      </Suspense>
    </div>
  )
}

ShowUserPage.authenticate = true

ShowUserPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowUserPage
