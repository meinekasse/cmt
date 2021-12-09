import { Select, SelectField } from "@chakra-ui/select"

import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Text } from "@chakra-ui/layout"

export interface LabeledSelectFieldProps extends ComponentPropsWithoutRef<typeof SelectField> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  values: Array<string>
  defaultValue?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, values, defaultValue, ...props }, ref) => {
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
          marginInlineEnd={0}
          experimental_spaceY={4}
          display="flex"
          flexDirection="column"
        >
          <Text fontSize="lg">{label}</Text>
          <Select {...input} disabled={submitting} {...props} ref={ref}>
            {values.map((v, index) => (
              <option key={index} value={v}>
                {v}
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
  }
)

export default LabeledSelectField
