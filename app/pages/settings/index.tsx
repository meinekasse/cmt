import Layout from "app/core/layouts/Layout"
import { BlitzPage, Head, Routes, useRouter } from "blitz"
import { Country, Role } from "db"
import { Input, InputGroup } from "@chakra-ui/input"
import { Suspense, useEffect, useState } from "react"
import { FlexLoader } from "../../core/components/FlexLoader"
import { useCurrentUser } from "../../core/hooks/useCurrentUser"
import settings from "../../../data/settings.json"
import LabeledTextField from "../../core/components/LabeledTextField"
import { Text } from "@chakra-ui/layout"
import { FormLabel } from "@chakra-ui/form-control"
import axios from "axios"
import { Select } from "@chakra-ui/select"
import { Button } from "@chakra-ui/button"

type SettingsType = {
  bank: {
    account: string
  }
  name: string
  address: {
    street: string
    houseNo: string
    country: Country
    postalCode: string
    city: string
  }
}

export const SettingsForm = () => {
  const router = useRouter()

  const currentUser = useCurrentUser()
  currentUser && !currentUser.roles.includes(Role.ADMIN) && router.push(Routes.Home())
  const [finalSettings, setFinalSettings] = useState<SettingsType>(settings as SettingsType)
  const [locked, setLocked] = useState<boolean>(true)
  useEffect(() => {
    ;(async () => {
      await axios.post("/api/save-settings", finalSettings, {
        headers: { "Content-Type": "application/json" },
      })
    })()
  }, [finalSettings])
  return (
    <>
      <FormLabel marginInlineEnd={0} experimental_spaceY={4} display="flex" flexDirection="column">
        <Text fontSize="lg">Firmenname</Text>
        <Input
          disabled={locked}
          value={finalSettings?.name ?? ""}
          onChange={(event) => {
            setFinalSettings((old) => ({ ...old, name: event.target.value }))
          }}
        />
      </FormLabel>
      <FormLabel marginInlineEnd={0} experimental_spaceY={4} display="flex" flexDirection="column">
        <Text fontSize="lg">Bankdaten</Text>
        <Input
          disabled={locked}
          value={finalSettings?.bank?.account ?? ""}
          onChange={(event) => {
            setFinalSettings((old) => ({ ...old, bank: { account: event.target.value } }))
          }}
        />
      </FormLabel>
      <FormLabel marginInlineEnd={0} experimental_spaceY={4} display="flex" flexDirection="column">
        <Text fontSize="lg">Strasse</Text>
        <Input
          disabled={locked}
          value={finalSettings?.address?.street ?? ""}
          onChange={(event) => {
            setFinalSettings((old) => ({
              ...old,
              address: { ...old.address, street: event.target.value },
            }))
          }}
        />
      </FormLabel>
      <FormLabel marginInlineEnd={0} experimental_spaceY={4} display="flex" flexDirection="column">
        <Text fontSize="lg">Strassennummer</Text>
        <Input
          disabled={locked}
          value={finalSettings?.address?.houseNo ?? ""}
          onChange={(event) => {
            setFinalSettings((old) => ({
              ...old,
              address: { ...old.address, houseNo: event.target.value },
            }))
          }}
        />
      </FormLabel>
      <FormLabel marginInlineEnd={0} experimental_spaceY={4} display="flex" flexDirection="column">
        <Text fontSize="lg">Stadt</Text>
        <Input
          disabled={locked}
          value={finalSettings?.address?.city ?? ""}
          onChange={(event) => {
            setFinalSettings((old) => ({
              ...old,
              address: { ...old.address, city: event.target.value },
            }))
          }}
        />
      </FormLabel>
      <FormLabel marginInlineEnd={0} experimental_spaceY={4} display="flex" flexDirection="column">
        <Text fontSize="lg">Postleitzahl</Text>
        <Input
          disabled={locked}
          value={finalSettings?.address?.postalCode ?? ""}
          onChange={(event) => {
            setFinalSettings((old) => ({
              ...old,
              address: { ...old.address, postalCode: event.target.value },
            }))
          }}
        />
      </FormLabel>
      <FormLabel marginInlineEnd={0} experimental_spaceY={4} display="flex" flexDirection="column">
        <Text fontSize="lg">Land</Text>
        <Select
          disabled={locked}
          value={finalSettings?.address?.country ?? ""}
          onChange={(event) => {
            setFinalSettings((old) => ({
              ...old,
              address: { ...old.address, country: event.target.value as Country },
            }))
          }}
        >
          {Object.values(Country).map((c, index) => (
            <option key={index}>{c}</option>
          ))}
        </Select>
      </FormLabel>
      <Button
        colorScheme="blue"
        onClick={() => {
          setLocked((old) => !old)
        }}
      >
        {locked ? "Unlock" : "Lock"}
      </Button>
    </>
  )
}

const SettingsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <Suspense fallback={<FlexLoader />}>
        <SettingsForm />
      </Suspense>
    </>
  )
}

SettingsPage.authenticate = true

SettingsPage.getLayout = (page) => <Layout>{page}</Layout>

export default SettingsPage
