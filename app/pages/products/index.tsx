import { IconButton, Button } from "@chakra-ui/button"
import { Flex, List, ListIcon, ListItem, Text, Link as ChakraLink, Spacer } from "@chakra-ui/layout"
import { PlusIcon } from "@heroicons/react/outline"
import { StarIcon } from "@heroicons/react/solid"
import Layout from "app/core/layouts/Layout"
import getProducts from "app/products/queries/getProducts"
import { BlitzPage, Head, Routes, usePaginatedQuery, useRouter, Link } from "blitz"
import { Suspense } from "react"
import { Loader } from "../../core/components/Loader"

const ITEMS_PER_PAGE = 100

export const ProductsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ products, hasMore }] = usePaginatedQuery(getProducts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <List experimental_spaceY={2}>
        {products.map((product) => (
          <ListItem
            key={product.id}
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
              router.push(Routes.ShowProductPage({ productId: product.id }))
            }}
          >
            <ListIcon as={StarIcon} color="white" />
            <Text color="white">{product.modelname}</Text>
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

const ProductsPage: BlitzPage = () => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>Products</title>
      </Head>

      <Flex flexDirection="column" experimental_spaceY={2} py={4} w="100%">
        <Suspense fallback={<Loader />}>
          <ProductsList />
        </Suspense>
        <IconButton
          aria-label="Create Product"
          colorScheme="green"
          icon={<PlusIcon width="24px" height="24px" />}
          onClick={() => {
            router.push(Routes.NewProductPage())
          }}
        />
        <Flex>
          <Link href={Routes.Home()} passHref>
            <ChakraLink textDecoration="none !important">
              <Button>Back</Button>
            </ChakraLink>
          </Link>
          <Spacer />
        </Flex>
      </Flex>
    </>
  )
}

ProductsPage.authenticate = true

ProductsPage.getLayout = (page) => <Layout>{page}</Layout>

export default ProductsPage
