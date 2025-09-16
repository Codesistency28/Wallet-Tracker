import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { BackButtonProps } from '@/types'
import { router } from 'expo-router'
import { CaretLeftIcon } from 'phosphor-react-native'
import { verticalScale } from '../utils/styling'
import { colors, radius } from '../constants/theme'

const BackButton = ({
    style,
    iconSize = 26
}:BackButtonProps) => {
  return (
    <TouchableOpacity className='' onPress={()=>router.back()} style={[{
        backgroundColor: colors.neutral600, borderRadius:radius._12,
        borderCurve: 'continuous', alignSelf: 'flex-start', padding:5
    }, style]}>
        <CaretLeftIcon size={verticalScale(iconSize)} color={colors.white} weight='bold' />
    </TouchableOpacity>
  )
}

export default BackButton