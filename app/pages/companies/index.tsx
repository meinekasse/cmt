import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCompanies from "app/companies/queries/getCompanies"
import { Button, IconButton } from "@chakra-ui/button"
import {
  Flex,
  ListIcon,
  ListItem,
  UnorderedList,
  Box,
  List,
  Text,
  Spacer,
  Link as ChakraLink,
} from "@chakra-ui/layout"
import { StarIcon } from "@chakra-ui/icons"
import { PlusIcon } from "@heroicons/react/outline"
import { FlexLoader } from "../../core/components/FlexLoader"

const ITEMS_PER_PAGE = 100

export const CompaniesList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ companies, hasMore }] = usePaginatedQuery(getCompanies, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <List experimental_spaceY={2}>
        {companies &&
          companies.map((company) => (
            <ListItem
              key={company.id}
              bgColor="blue.500"
              py={4}
              px={6}
              fontSize="xl"
              fontWeight="bold"
              flexDirection="row"
              display="flex"
              alignItems="center"
              experimental_spaceX={2}
              rounded="md"
              cursor="pointer"
              onClick={() => router.push(Routes.ShowCompanyPage({ companyId: company.id }))}
            >
              <ListIcon as={StarIcon} color="white" />
              <Text color="white">{company.name}</Text>
            </ListItem>
          ))}
      </List>
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
    </>
  )
}

const CompaniesPage: BlitzPage = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Companies</title>
      </Head>

      <Flex flexDirection="column" experimental_spaceY={2} py={4} w="100%">
        <Suspense fallback={<FlexLoader />}>
          <CompaniesList />
        </Suspense>
        <IconButton
          aria-label="Create Company"
          colorScheme="green"
          icon={<PlusIcon width="24px" height="24px" />}
          onClick={() => {
            router.push(Routes.NewCompanyPage())
          }}
        />
      </Flex>
      <Flex>
        <Link href={Routes.Home()} passHref>
          <ChakraLink textDecoration="none !important">
            <Button>Back</Button>
          </ChakraLink>
        </Link>
        <Spacer />
      </Flex>
    </>
  )
}

CompaniesPage.authenticate = true

CompaniesPage.getLayout = (page) => <Layout>{page}</Layout>

export default CompaniesPage
