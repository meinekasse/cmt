import Layout from "app/core/layouts/Layout"
import { FORM_ERROR, RaportForm } from "app/raports/components/RaportForm"
import createRaport from "app/raports/mutations/createRaport"
import { BlitzPage, Routes, useMutation, useParam, useRouter } from "blitz"
import { Suspense } from "react"
import { FlexLoader } from "../../../../core/components/FlexLoader"
import { useCurrentUser } from "../../../../core/hooks/useCurrentUser"

const NewRaportPage: BlitzPage = () => {
  const router = useRouter()
  const user = useCurrentUser()
  const [createRaportMutation] = useMutation(createRaport)
  const companyId = useParam("companyId", "number")
  return (
    <>
      <Suspense fallback={<FlexLoader />}>
        {user && (
          <RaportForm
            onSubmit={async (values) => {
              try {
                const raport = await createRaportMutation({ ...values, userId: user.id, companyId })
                raport &&
                  router.push(
                    Routes.ShowRaportPage({ raportId: raport.id, companyId: companyId as number })
                  )
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        )}
      </Suspense>
    </>
  )
}

NewRaportPage.authenticate = true

NewRaportPage.getLayout = (page) => <Layout title="Create New Raport">{page}</Layout>

export default NewRaportPage
