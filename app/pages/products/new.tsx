import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createProduct from "app/products/mutations/createProduct"
import { ProductForm, FORM_ERROR } from "app/products/components/ProductForm"
import { Text } from "@chakra-ui/layout"

const NewProductPage: BlitzPage = () => {
  const router = useRouter()
  const [createProductMutation] = useMutation(createProduct)

  return (
    <>
      <Text fontSize="2xl">Create New Product</Text>
      <ProductForm
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateProduct}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const product = await createProductMutation(values)
            router.push(Routes.ShowProductPage({ productId: product.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </>
  )
}

NewProductPage.authenticate = true

NewProductPage.getLayout = (page) => <Layout title={"Create New Product"}>{page}</Layout>

export default NewProductPage
