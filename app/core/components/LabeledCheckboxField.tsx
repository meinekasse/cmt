import { Checkbox } from "@chakra-ui/checkbox"
import { forwardRef, ComponentPropsWithoutRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"
import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Text } from "@chakra-ui/layout"

export interface LabeledCheckboxFieldProps extends ComponentPropsWithoutRef<typeof Checkbox> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledCheckboxField = forwardRef<HTMLInputElement, LabeledCheckboxFieldProps>(
  ({ name, label, outerProps, fieldProps, labelProps, ...props }, ref) => {
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
          <Text fontSize="lg" w="100%">
            {label}
          </Text>
          <Checkbox
            size="lg"
            type="checkbox"
            {...input}
            disabled={submitting}
            {...props}
            ref={ref}
          />
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

export default LabeledCheckboxField
