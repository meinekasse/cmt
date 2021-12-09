import { Button } from "@chakra-ui/button"
import { useColorMode } from "@chakra-ui/color-mode"
import { Flex, Link as ChakraLink, Spacer, Stack } from "@chakra-ui/layout"
import { Radio, RadioGroup } from "@chakra-ui/radio"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Link, Routes } from "blitz"
import { Role } from "db"
import { useState } from "react"
import { z } from "zod"
import LabeledSelectField from "../../core/components/LabeledSelectField"
import { useCurrentUser } from "../../core/hooks/useCurrentUser"
import { Input } from "@chakra-ui/input"
import LabeledCheckboxGroupField from "../../core/components/LabeledCheckboxGroupField"
export { FORM_ERROR } from "app/core/components/Form"

export function UserForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const userId = props.initialValues!.id!
  const currentUser = useCurrentUser()
  const { setColorMode } = useColorMode()
  const coloModeOnChange = (value) => {
    currentUser && userId === currentUser.id && setColorMode(value)
  }

  const [colorModeValue, setColorModeValue] = useState<"light" | "dark">(
    props.initialValues!.colormode! as "light" | "dark"
  )
  return (
    <Flex w="100%" flexDirection="column">
      <Form<S> style={{ width: "100%" }} {...props}>
        <LabeledTextField name="name" label="Name" placeholder="Name" />
        <LabeledTextField name="surname" label="Nachname" placeholder="Name" />
        <LabeledTextField type="email" name="email" label="Email" placeholder="Email" />
        <LabeledTextField
          name="colormode"
          value={colorModeValue}
          label="Farb Modus"
          placeholder="Farb Modus"
          hidden
        />
        <RadioGroup
          onChange={(value) => {
            setColorModeValue(value as "light" | "dark")
          }}
          defaultValue={colorModeValue}
        >
          <Stack spacing={5} direction="row">
            <Radio value="light">Hell</Radio>
            <Radio value="dark">Dunkel</Radio>
          </Stack>
        </RadioGroup>
        {(props.initialValues!.roles!.includes(Role.ADMIN) ||
          (currentUser?.roles.includes(Role.ADMIN) ?? false)) && (
          <LabeledCheckboxGroupField
            name="roles"
            outerProps={{
              display: "flex",
              flexDirection: "column",
              w: "100%",
              experimental_spaceX: 2,
            }}
            label="Rollen"
            multiple
            defaultValues={props.initialValues!.roles}
            values={Object.values(Role)}
          />
        )}
        <Flex>
          <Link
            href={Routes.ShowUserPage({
              userId: userId as number,
            })}
            passHref
          >
            <ChakraLink textDecoration="none !important">
              <Button>Back</Button>
            </ChakraLink>
          </Link>
          <Spacer />
          <Button type="submit" colorScheme="blue">
            Speichern
          </Button>
        </Flex>
        <Spacer h={40} />
      </Form>
    </Flex>
  )
}
