import { Button, IconButton } from "@chakra-ui/button"
import { Flex, Grid, GridItem, Link as ChakraLink, Spacer } from "@chakra-ui/layout"
import { PlusIcon, TrashIcon } from "@heroicons/react/outline"
import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import getProducts from "app/products/queries/getProducts"
import { Link, Routes, useParam, useQuery } from "blitz"
import { TaskType } from "db"
import { useState } from "react"
import { z } from "zod"
import LabeledObjectSelectField from "../../core/components/LabeledObjectSelectField"
import LabeledSelectField from "../../core/components/LabeledSelectField"
export { FORM_ERROR } from "app/core/components/Form"

export function RaportForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const companyId = useParam("companyId", "number")
  const [{ products }] = useQuery(getProducts, {
    orderBy: { modelname: "asc" },
  })
  const [rapProducts, setRapProducts] = useState<{ list: Array<any> }>({
    list: props?.initialValues?.products ?? [],
  })
  const removeProduct = (i: number) => {
    const newPs = rapProducts.list
    newPs.splice(i, 1)
    setRapProducts((ps) => ({ list: newPs }))
  }
  const addProduct = () => {
    const newPs = rapProducts.list
    newPs.push({})
    setRapProducts((ps) => ({ list: newPs }))
  }
  return (
    <Form<S> style={{ width: "100%" }} {...props}>
      <LabeledTextField name="taskname" label="Aufgabe" placeholder="Aufgabe" />
      <LabeledSelectField
        name="tasktype"
        label="Aufgabentyp"
        placeholder="Aufgabentyp"
        values={Object.values(TaskType)}
        defaultValue={TaskType.Installation}
      />
      <LabeledTextField
        name="taskdescription"
        label="Aufgabenbeschreibung"
        placeholder="Aufgabenbeschreibung"
      />
      {rapProducts.list &&
        rapProducts.list.map((aP, i) => (
          <Grid w="100%" columns={2} columnGap={2} key={i} templateColumns="repeat(8, 1fr)">
            <GridItem colSpan={7}>
              <LabeledObjectSelectField
                name={`products.${i}.id`}
                label={`Produkt ${i + 1}`}
                h="40px"
                placeholder="Wählen Sie ein Produkt"
                defaultValue={`${aP.id}`}
                values={
                  products.map((p) => ({
                    value: `${p.id}`,
                    label: `${p.modelname} (${p.price} ${p.currency})`,
                  })) ?? []
                }
              />
            </GridItem>
            <GridItem colSpan={1}>
              <IconButton
                aria-label="Produkt entfernen"
                icon={<TrashIcon width="24px" height="24px" />}
                colorScheme="red"
                variant="ghost"
                onClick={() => removeProduct(i)}
              ></IconButton>
            </GridItem>
          </Grid>
        ))}
      <IconButton
        aria-label="Produkt hinzufügen"
        icon={<PlusIcon width="24px" height="24px" />}
        onClick={() => {
          addProduct()
        }}
        colorScheme="blue"
        width="100%"
      />
      <Flex>
        <Link
          href={Routes.RaportsPage({
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
    </Form>
  )
}
