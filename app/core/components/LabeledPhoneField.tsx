import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { Input } from "@chakra-ui/input"
import { Text } from "@chakra-ui/layout"
import { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef } from "react"
import { useField, UseFieldConfig } from "react-final-form"

export interface LabeledPhoneFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
  fieldProps?: UseFieldConfig<string>
}

export const LabeledPhoneField = forwardRef<HTMLInputElement, LabeledPhoneFieldProps>(
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
          marginInlineEnd={0}
          experimental_spaceY={4}
          display="flex"
          flexDirection="column"
        >
          <Text fontSize="lg">{label}</Text>
          <Input {...input} type="tel" disabled={submitting} {...props} ref={ref} />
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

export default LabeledPhoneField
