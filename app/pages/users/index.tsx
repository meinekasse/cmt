import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import { Role } from "db"
import Layout from "app/core/layouts/Layout"
import getUsers from "app/users/queries/getUsers"
import { FlexLoader } from "../../core/components/FlexLoader"
import { useCurrentUser } from "../../core/hooks/useCurrentUser"
import { List, ListItem, Link as ChakraLink, Flex } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/button"

const ITEMS_PER_PAGE = 100

export const UsersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ users, hasMore }] = usePaginatedQuery(getUsers, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const currentUser = useCurrentUser()
  currentUser &&
    !currentUser.roles.includes(Role.ADMIN) &&
    router.push(Routes.ShowUserPage({ userId: currentUser.id }))

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <List experimental_spaceY={2}>
        {users &&
          users.map((user) => (
            <ListItem key={user.id}>
              <Link href={Routes.ShowUserPage({ userId: user.id })} passHref>
                <ChakraLink textDecoration="none !important">
                  <Flex
                    px={4}
                    py={3}
                    color="black"
                    fontSize="xl"
                    fontWeight="bold"
                    bgColor={
                      user.roles.includes(Role.ADMIN)
                        ? user.roles.includes(Role.WORKER)
                          ? "blue.300"
                          : "orange.300"
                        : "green.300"
                    }
                    rounded="xl"
                  >
                    {user.name} {user.surname} ({user.email})
                  </Flex>
                </ChakraLink>
              </Link>
            </ListItem>
          ))}
      </List>

      {users && users.length > 0 && page !== 0 && hasMore && (
        <Flex flexDirection="row" experimental_spaceX={2}>
          <Button disabled={page === 0} onClick={goToPreviousPage}>
            Previous
          </Button>
          <Button disabled={!hasMore} onClick={goToNextPage}>
            Next
          </Button>
        </Flex>
      )}
    </>
  )
}

const UsersPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Users</title>
      </Head>

      <Suspense fallback={<FlexLoader />}>
        <UsersList />
      </Suspense>
    </>
  )
}

UsersPage.authenticate = true

UsersPage.getLayout = (page) => <Layout>{page}</Layout>

export default UsersPage
