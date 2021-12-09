import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { useRef, useState } from "react"
import { z } from "zod"
import LabeledSelectField from "../../core/components/LabeledSelectField"
import LabeledCheckboxField from "../../core/components/LabeledCheckboxField"
import { Flex, Spacer } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/button"
export { FORM_ERROR } from "app/core/components/Form"

export function ProductForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [worktime, setWorktime] = useState<boolean>(
    (props.initialValues?.worktimehours !== null || props.initialValues?.worktimehours !== null) ??
      false
  )
  return (
    <Form<S> style={{ width: "100%" }} {...props}>
      <LabeledTextField
        name="modelname"
        label="Name"
        outerProps={{ marginTop: 3 }}
        placeholder="Name"
        required
      />
      <LabeledTextField name="modelserial" label="Serial" placeholder="Serial" />
      <LabeledTextField
        type="number"
        step={0.01}
        name="price"
        label="Preis"
        placeholder="Preis"
        required
      />
      <LabeledSelectField
        values={["EUR", "CHF"]}
        defaultValue="CHF"
        name="currency"
        label="Währung"
        placeholder="Währung"
        required
      />
      <LabeledCheckboxField
        name="worktimeexists"
        type="checkbox"
        label="Arbeitszeit hinzufügen"
        defaultChecked={worktime}
        onChangeCapture={(event) => {
          setWorktime(event.target.checked)
        }}
      />
      {worktime && (
        <>
          <LabeledTextField
            type="number"
            step={1}
            name="worktimehours"
            label="Arbeitszeit Stunden"
            placeholder="Arbeitszeit Stunden"
            required
          />
          <LabeledTextField
            type="number"
            step={1}
            name="worktimeminutes"
            label="Arbeitszeit Minuten"
            placeholder="Arbeitszeit Minuten"
            required
          />
        </>
      )}
      <Flex>
        <Spacer />
        <Button type="submit" colorScheme="blue">
          Speichern
        </Button>
      </Flex>
    </Form>
  )
}
