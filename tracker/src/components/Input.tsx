import { View, TextInput } from 'react-native'
import React from 'react'
import { InputProps } from '@/types'
import { colors, radius, spacingX } from '../constants/theme'
import { verticalScale } from '../utils/styling'

const Input = (props: InputProps) => {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "center",
          alignItems: 'center',
          height: verticalScale(50),
          borderWidth: 2,
          borderColor: colors.neutral300,
          borderRadius: radius._17,
          borderCurve: 'continuous',
          paddingHorizontal: spacingX._15,
          gap: spacingX._10,
        },
        props.containerStyle && props.containerStyle
      ]}
    >
      {props.icon && props.icon}

      <TextInput
        style={[
          { flex: 1, color: colors.white, fontSize: verticalScale(14) },
          props.inputStyle,
        ]}
        placeholderTextColor={colors.neutral400}
        ref={props.inputRef && props.inputRef} 
        {...props}
      />
    </View>
  )
}

export default Input
