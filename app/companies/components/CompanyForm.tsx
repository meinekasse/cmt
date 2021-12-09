import { Button } from "@chakra-ui/button"
import { Flex, Spacer, Link as ChakraLink, Text } from "@chakra-ui/layout"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { CompanyType, Country } from "db"
import { z } from "zod"
import { Link, Routes, useParam } from "blitz"
import LabeledPhoneField from "../../core/components/LabeledPhoneField"
import LabeledSelectField from "../../core/components/LabeledSelectField"
export { FORM_ERROR } from "app/core/components/Form"

export function CompanyForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const companyId = useParam("companyId", "number")
  return (
    <Flex w="100%" flexDirection="column">
      <Form<S> style={{ width: "100%" }} {...props}>
        <Text fontSize="3xl" fontWeight="bold">
          Unternehmen
        </Text>
        <LabeledTextField
          labelProps={{ fontWeight: "bold" }}
          w="100%"
          name="name"
          label="Name"
          placeholder="Name"
          required
        />
        <LabeledSelectField
          w="100%"
          values={[CompanyType.GmbH, CompanyType.Einzelfirma]}
          defaultValue={CompanyType.GmbH}
          name="type"
          labelProps={{ fontWeight: "bold" }}
          label="Unternehmenstyp"
          placeholder="Unternehmenstyp"
          variant="filled"
          required
        />
        <LabeledPhoneField
          labelProps={{ fontWeight: "bold" }}
          w="100%"
          name="phone"
          label="Telefon"
          placeholder="Telefon"
          required
        />
        <LabeledTextField
          labelProps={{ fontWeight: "bold" }}
          w="100%"
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          required
        />
        <LabeledTextField
          labelProps={{ fontWeight: "bold" }}
          w="100%"
          name="webpage"
          label="Webseite"
          placeholder="Webseite"
        />
        <Text fontSize="3xl" fontWeight="bold">
          Adresse
        </Text>
        <Flex experimental_spaceX={2} w="100%">
          <LabeledTextField
            labelProps={{ fontWeight: "bold" }}
            w="100%"
            name="street"
            label="Strasse"
            placeholder="Strasse"
            required
          />
          <LabeledTextField
            labelProps={{ fontWeight: "bold" }}
            w="100%"
            name="streetnumber"
            label="Nummer"
            placeholder="Nummer"
          />
        </Flex>
        <LabeledTextField
          labelProps={{ fontWeight: "bold" }}
          w="100%"
          name="city"
          label="Stadt"
          placeholder="Stadt"
        />
        <LabeledTextField
          labelProps={{ fontWeight: "bold" }}
          w="100%"
          name="postalcode"
          label="PLZ"
          placeholder="PLZ"
        />
        <LabeledSelectField
          w="100%"
          values={[Country.CH, Country.DE]}
          defaultValue={Country.CH}
          name="country"
          labelProps={{ fontWeight: "bold" }}
          label="Land"
          placeholder="Land"
          variant="filled"
          required
        />
        <Flex>
          <Link
            href={Routes.ShowCompanyPage({
              companyId: companyId as number,
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
