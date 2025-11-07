import React from "react"
import { Switch as RNSwitch, SwitchProps } from "react-native"

// Simple wrapper for consistent usage
export function Switch(props: SwitchProps) {
  return <RNSwitch {...props} />
}
