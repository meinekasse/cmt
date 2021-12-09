import { Checkbox, CheckboxGroup } from "@chakra-ui/checkbox"
import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Text, Stack } from "@chakra-ui/layout"

export interface LabeledCheckboxGroupFieldProps extends ComponentPropsWithoutRef<typeof Checkbox> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  values: Array<string | number>
  defaultValues: Array<string | number>
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledCheckboxGroupField = forwardRef<
  HTMLInputElement,
  LabeledCheckboxGroupFieldProps
>(({ name, label, outerProps, fieldProps, labelProps, defaultValues, values, ...props }, ref) => {
  const {
    input,
    meta: { touched, error, submitError, submitting },
  } = useField(name, {
    ...fieldProps,
  })

  const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError

  return (
    <FormControl {...outerProps}>
      <FormLabel
        {...labelProps}
        experimental_spaceX={2}
        marginInlineEnd={0}
        experimental_spaceY={4}
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Text fontSize="lg">{label}</Text>
        <CheckboxGroup {...input}>
          <Stack direction="row">
            {values.map((v, index) => (
              <Checkbox
                key={index}
                size="lg"
                type="checkbox"
                disabled={submitting}
                {...props}
                defaultChecked={defaultValues.includes(v)}
                ref={ref}
              >
                {v}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormLabel>

      {touched && normalizedError && (
        <div role="alert" style={{ color: "red" }}>
          {normalizedError}
        </div>
      )}

      <style jsx>{`
        label {
          display: flex;
          flex-direction: column;
          align-items: start;
          font-size: 1rem;
        }
        input {
          font-size: 1rem;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          border: 1px solid purple;
          appearance: none;
          margin-top: 0.5rem;
        }
      `}</style>
    </FormControl>
  )
})

export default LabeledCheckboxGroupField
