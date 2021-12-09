import { Select, SelectField } from "@chakra-ui/select"
import { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Text } from "@chakra-ui/layout"

export interface LabeledObjectSelectFieldProps
  extends ComponentPropsWithoutRef<typeof SelectField> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  values: Array<{ value: any; label: string }>
  defaultValue?: Array<any>
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledObjectSelectField = forwardRef<
  HTMLSelectElement,
  LabeledObjectSelectFieldProps
>(({ name, label, outerProps, fieldProps, labelProps, values, defaultValue, ...props }, ref) => {
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
        flexDirection="column"
        marginInlineEnd={0}
        experimental_spaceY={4}
        display="flex"
      >
        <Text fontSize="lg">{label}</Text>

        <Select disabled={submitting} {...input} {...props} ref={ref} height="auto">
          {values?.map((v, index) => (
            <option key={index} value={v.value}>
              {v.label}
            </option>
          ))}
        </Select>
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

export default LabeledObjectSelectField
