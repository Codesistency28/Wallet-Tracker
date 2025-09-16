import { View, Text } from 'react-native'
import React from 'react'
import { colors, spacingY } from '../constants/theme'
import { ModalWrapperProps } from '@/types'
import { Platform } from 'react-native'

const isIos = Platform.OS == 'ios'

const ModalWrapper = ({
    style,
    children,
    bg = colors.neutral900
}: ModalWrapperProps) => {
  return (
    <View style={[style&&style, {
        backgroundColor: bg,
        flex: 1,
        paddingTop: isIos ? spacingY._15: spacingY._10,
        paddingBottom: isIos? spacingY._15: spacingY._10
    }]}>
      {children}
    </View>
  )
}

export default ModalWrapper