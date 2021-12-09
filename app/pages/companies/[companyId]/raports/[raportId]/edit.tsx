import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getRaport from "app/raports/queries/getRaport"
import updateRaport from "app/raports/mutations/updateRaport"
import { RaportForm, FORM_ERROR } from "app/raports/components/RaportForm"
import { FlexLoader } from "../../../../../core/components/FlexLoader"
import { useCurrentUser } from "../../../../../core/hooks/useCurrentUser"

export const EditRaport = () => {
  const router = useRouter()
  const raportId = useParam("raportId", "number")
  const companyId = useParam("companyId", "number")
  const user = useCurrentUser()
  const [raport, { setQueryData }] = useQuery(
    getRaport,
    { id: raportId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateRaportMutation] = useMutation(updateRaport)

  return (
    <>
      <Head>
        <title>Edit Raport {raport.id}</title>
      </Head>

      <>
        {user && (
          <RaportForm
            // TODO use a zod schema for form validation
            //  - Tip: extract mutation's schema into a shared `validations.ts` file and
            //         then import and use it here
            // schema={UpdateRaport}
            initialValues={raport}
            onSubmit={async (values) => {
              try {
                const updated = await updateRaportMutation({
                  id: raport.id,
                  ...values,
                  userId: user.id,
                })
                if (updated !== null) {
                  await setQueryData(updated)
                  router.push(
                    Routes.ShowRaportPage({ raportId: updated.id, companyId: companyId as number })
                  )
                } else {
                  console.log("Couldnt update raport")
                }
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        )}
      </>
    </>
  )
}

const EditRaportPage: BlitzPage = () => {
  const router = useRouter()
  const companyId = useParam("companyId", "number")
  return (
    <>
      <Suspense fallback={<FlexLoader />}>
        <EditRaport />
      </Suspense>
    </>
  )
}

EditRaportPage.authenticate = true

EditRaportPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditRaportPage
