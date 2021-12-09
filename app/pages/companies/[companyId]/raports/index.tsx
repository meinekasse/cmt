import { Button } from "@chakra-ui/button"
import { StarIcon } from "@chakra-ui/icons"
import { Flex, Link as ChakraLink, List, ListIcon, ListItem, Text, Spacer } from "@chakra-ui/layout"
import { PlusIcon } from "@heroicons/react/outline"
import Layout from "app/core/layouts/Layout"
import getRaports from "app/raports/queries/getRaports"
import { BlitzPage, Head, Link, Routes, usePaginatedQuery, useParam, useRouter } from "blitz"
import { Role } from "db"
import { Suspense } from "react"
import { FlexLoader } from "../../../../core/components/FlexLoader"
import { useCurrentUser } from "../../../../core/hooks/useCurrentUser"

const ITEMS_PER_PAGE = 100

export const RaportsList = () => {
  const router = useRouter()
  const companyId = useParam("companyId", "number")
  const page = Number(router.query.page) || 0
  const [{ raports, hasMore }] = usePaginatedQuery(getRaports, {
    where: { companyRaportConnection: { every: { companyId } } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  const user = useCurrentUser()
  return (
    <>
      <List experimental_spaceY={2}>
        {raports.map((raport) => (
          <ListItem
            key={raport.id}
            bgColor="blue.500"
            p={2}
            px={4}
            flexDirection="row"
            display="flex"
            alignItems="center"
            experimental_spaceX={2}
            rounded="md"
            cursor="pointer"
            onClick={() => {
              router.push(
                Routes.ShowRaportPage({ raportId: raport.id, companyId: companyId as number })
              )
            }}
          >
            <Link
              href={Routes.ShowRaportPage({ raportId: raport.id, companyId: companyId as number })}
              passHref
            >
              <ChakraLink textDecoration="none !important" w="100%">
                <ListIcon as={StarIcon} color="white" />
                <Text color="white" fontWeight="bold">
                  {raport.taskname}
                </Text>
                <Text color="white">{raport.tasktype}</Text>
              </ChakraLink>
            </Link>
          </ListItem>
        ))}
      </List>
      {raports.length === 0 &&
        !(user?.roles.includes(Role.ADMIN) || user?.roles.includes(Role.WORKER)) && (
          <Text align="center" fontWeight="semibold" fontSize="xl">
            Sie haben keine Raports, bitte wenden sie sich an einen Administrator
          </Text>
        )}

      {page !== 0 && hasMore && (
        <Flex flexDirection="row" experimental_spaceX={2}>
          <Button disabled={page === 0} onClick={goToPreviousPage}>
            Previous
          </Button>
          <Button disabled={!hasMore} onClick={goToNextPage}>
            Next
          </Button>
        </Flex>
      )}
      {user && (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.WORKER)) && (
        <Link href={Routes.NewRaportPage({ companyId: companyId as number })} passHref>
          <ChakraLink w="100%" textDecoration="none !important">
            <Button w="100%" experimental_spaceX={2} colorScheme="green">
              <PlusIcon width="20px" height="20px" />
              <Text>Raport Erstellen</Text>
            </Button>
          </ChakraLink>
        </Link>
      )}
      <Flex>
        <Link href={Routes.ShowCompanyPage({ companyId: companyId as number })} passHref>
          <ChakraLink textDecoration="none !important">
            <Button>Back</Button>
          </ChakraLink>
        </Link>
        <Spacer />
      </Flex>
    </>
  )
}

const RaportsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Raports</title>
      </Head>

      <Flex flexDirection="column" experimental_spaceY={2} py={4} w="100%">
        <Suspense fallback={<FlexLoader />}>
          <RaportsList />
        </Suspense>
      </Flex>
    </>
  )
}

RaportsPage.authenticate = true

RaportsPage.getLayout = (page) => <Layout>{page}</Layout>

export default RaportsPage
