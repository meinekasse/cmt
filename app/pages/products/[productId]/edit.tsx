import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getProduct from "app/products/queries/getProduct"
import updateProduct from "app/products/mutations/updateProduct"
import { ProductForm, FORM_ERROR } from "app/products/components/ProductForm"
import { Button } from "@chakra-ui/button"
import { Box, Center, HStack, VStack } from "@chakra-ui/layout"
import { FlexLoader } from "../../../core/components/FlexLoader"

export const EditProduct = () => {
  const router = useRouter()
  const productId = useParam("productId", "number")
  const [product, { setQueryData }] = useQuery(
    getProduct,
    { id: productId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateProductMutation] = useMutation(updateProduct)

  return (
    <>
      <Head>
        <title>Edit Product {product.id}</title>
      </Head>

      <>
        <ProductForm
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateProduct}
          initialValues={product}
          onSubmit={async (values) => {
            try {
              const updated = await updateProductMutation({
                id: product.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowProductPage({ productId: updated.id }))
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </>
    </>
  )
}

const EditProductPage: BlitzPage = () => {
  return (
    <>
      <Suspense fallback={<FlexLoader />}>
        <EditProduct />
      </Suspense>
    </>
  )
}

EditProductPage.authenticate = true

EditProductPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditProductPage
