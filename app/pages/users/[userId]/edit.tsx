import Layout from "app/core/layouts/Layout"
import { FORM_ERROR, UserForm } from "app/users/components/UserForm"
import updateUser from "app/users/mutations/updateUser"
import getUser from "app/users/queries/getUser"
import { BlitzPage, Head, Routes, useMutation, useParam, useQuery, useRouter } from "blitz"
import { Suspense } from "react"
import { FlexLoader } from "../../../core/components/FlexLoader"
import { UpdateUser } from "../../../users/mutations/updateUser"

export const EditUser = () => {
  const router = useRouter()
  const userId = useParam("userId", "number")
  const [user, { setQueryData }] = useQuery(
    getUser,
    { id: userId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateUserMutation] = useMutation(updateUser)
  return (
    <>
      <Head>
        <title>Edit User</title>
      </Head>
      {user && (
        <UserForm
          initialValues={{
            email: user.email,
            name: user.name,
            surname: user.surname,
            roles: user.roles,
            colormode: user.colorMode,
          }}
          schema={UpdateUser}
          onSubmit={async (values) => {
            try {
              const updated = await updateUserMutation({
                ...values,
                id: user.id,
              })
              await setQueryData(updated)
              updated && router.push(Routes.ShowUserPage({ userId: updated.id }))
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
  )
}

const EditUserPage: BlitzPage = () => {
  return (
    <>
      <Suspense fallback={<FlexLoader />}>
        <EditUser />
      </Suspense>
    </>
  )
}

EditUserPage.authenticate = true

EditUserPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditUserPage
