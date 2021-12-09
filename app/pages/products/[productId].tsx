import { IconButton, Button } from "@chakra-ui/button"
import { Flex, Spacer, Text, Link as ChakraLink } from "@chakra-ui/layout"
import { PencilIcon, TrashIcon } from "@heroicons/react/solid"
import Layout from "app/core/layouts/Layout"
import deleteProduct from "app/products/mutations/deleteProduct"
import getProduct from "app/products/queries/getProduct"
import { BlitzPage, Head, Routes, useMutation, useParam, useQuery, useRouter, Link } from "blitz"
import { TaskType } from "db"
import { Suspense } from "react"
import { FlexLoader } from "../../core/components/FlexLoader"

export const Product = () => {
  const router = useRouter()
  const productId = useParam("productId", "number")
  const [deleteProductMutation] = useMutation(deleteProduct)
  const [product] = useQuery(getProduct, { id: productId })

  return (
    <>
      <Head>
        <title>Product {product.modelname}</title>
      </Head>
      {product && (
        <Flex w="100%" flexDirection="column" experimental_spaceY={2}>
          <Flex w="100%" alignItems="center" flexDirection="row" experimental_spaceX={2}>
            <Flex
              flexGrow="1"
              flexDirection="row"
              bgColor="gray"
              rounded="md"
              alignItems="center"
              experimental_spaceX={2}
              px={4}
              w="100%"
              height="40px"
            >
              <Text fontSize="xl" fontWeight="bold" textOverflow="ellipsis">
                {product.modelname}
              </Text>
            </Flex>
            <IconButton
              rounded="md"
              aria-label="edit company"
              colorScheme="blue"
              icon={<PencilIcon width="24px" height="24px" />}
              onClick={() => {
                router.push(Routes.EditProductPage({ productId: product.id }))
              }}
            >
              Edit
            </IconButton>
            <IconButton
              rounded="md"
              aria-label="delete company"
              colorScheme="red"
              icon={<TrashIcon width="24px" height="24px" />}
              type="button"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteProductMutation({ id: product.id })
                  router.push(Routes.ProductsPage())
                }
              }}
            >
              Delete
            </IconButton>
          </Flex>
          <Flex w="100%" flexDirection="column" experimental_spaceY={2} alignItems="flex-start">
            <Flex p={2} px={3} bgColor="green.200" w="100%" rounded="md" color="black">
              <Text fontSize="xl" fontWeight="semibold">
                Preis:
              </Text>
              <Spacer />
              <Text fontSize="xl" fontWeight="semibold">
                {product.price} {product.currency}
              </Text>
            </Flex>
            <Flex p={2} px={3} bgColor="yellow.200" w="100%" rounded="md" color="black">
              <Text fontSize="xl" fontWeight="semibold">
                Verwendet:
              </Text>
              <Spacer />
              <Text fontSize="xl" fontWeight="semibold">
                {
                  product.raports.filter((raport) => raport.tasktype === TaskType.Installation)
                    .length
                }
                x
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  )
}

const ShowProductPage: BlitzPage = () => {
  return (
    <>
      <Flex flexDirection="column" experimental_spaceY={2} py={4} w="100%">
        <Suspense fallback={<FlexLoader />}>
          <Product />
        </Suspense>
        <Flex>
          <Link href={Routes.ProductsPage()} passHref>
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

ShowProductPage.authenticate = true

ShowProductPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowProductPage
