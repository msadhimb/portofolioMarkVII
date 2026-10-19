"use client"

import SquishSwitch from "@/components/ui/switch"

interface FormSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  ariaLabel?: string
  id?: string
  disabled?: boolean
}

const FormSwitch = ({
  checked,
  onChange,
  label,
  ariaLabel,
  id,
  disabled = false,
}: FormSwitchProps) => {
  return (
    <SquishSwitch
      checked={checked}
      onChange={onChange}
      label={label}
      ariaLabel={ariaLabel}
      width={36}
      height={20}
      radius={14}
      speed={50}
      stretch={200}
      hoverScale={1.035}
      colorDuration={320}
      disabled={disabled}
      id={id}
    />
  )
}

export default FormSwitch
