import { Flex, Text } from "@chakra-ui/layout"
import { color } from "@chakra-ui/styled-system"
import { OfficeBuildingIcon } from "@heroicons/react/solid"
import { CompanyForm, FORM_ERROR } from "app/companies/components/CompanyForm"
import createCompany from "app/companies/mutations/createCompany"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Routes, useMutation, useRouter } from "blitz"

const NewCompanyPage: BlitzPage = () => {
  const router = useRouter()
  const [createCompanyMutation] = useMutation(createCompany)

  return (
    <Flex flexDirection="column" w="100%" experimental_spaceY={2} paddingTop={4}>
      <Flex flexDirection="row" alignItems="center" experimental_spaceX={4}>
        <OfficeBuildingIcon width="30px" height="30px" />
        <Text fontSize="4xl" fontWeight="bold">
          Neuer Firmeneintrag
        </Text>
      </Flex>
      <CompanyForm
        onSubmit={async (values) => {
          try {
            const company = await createCompanyMutation(values)
            router.push(Routes.ShowCompanyPage({ companyId: company!.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />
    </Flex>
  )
}

NewCompanyPage.authenticate = true

NewCompanyPage.getLayout = (page) => <Layout title="Create New Company">{page}</Layout>

export default NewCompanyPage
