import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCompany from "app/companies/queries/getCompany"
import updateCompany from "app/companies/mutations/updateCompany"
import { CompanyForm, FORM_ERROR } from "app/companies/components/CompanyForm"
import { Flex, Text } from "@chakra-ui/layout"
import { css } from "@chakra-ui/styled-system"
import { FlexLoader } from "../../../core/components/FlexLoader"

export const EditCompany = () => {
  const router = useRouter()
  const companyId = useParam("companyId", "number")
  const [company, { setQueryData }] = useQuery(
    getCompany,
    { id: companyId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateCompanyMutation] = useMutation(updateCompany)

  return (
    <>
      <Head>
        <title>Edit Company {company && company.id}</title>
      </Head>
      {company && (
        <Flex w="100%">
          <CompanyForm
            // schema={UpdateCompany}
            initialValues={company}
            style={{ width: "100%", maxWidth: "500px" }}
            onSubmit={async (values) => {
              try {
                const updated = await updateCompanyMutation({
                  id: company!.id,
                  ...values,
                })
                await setQueryData(updated)
                router.push(Routes.ShowCompanyPage({ companyId: updated.id }))
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Flex>
      )}
    </>
  )
}

const EditCompanyPage: BlitzPage = () => {
  return (
    <Flex w="100%" p={2}>
      <Suspense fallback={<FlexLoader />}>
        <EditCompany />
      </Suspense>
    </Flex>
  )
}

EditCompanyPage.authenticate = true

EditCompanyPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditCompanyPage
