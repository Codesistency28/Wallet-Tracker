import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { CustomButtonProps } from '@/types'
import Typo from './Typo'
import { colors, radius } from '../constants/theme'
import { verticalScale } from '../utils/styling'
import Loading from './Loading'



const Button = ({
    style,
    onPress,
    loading= false,
    children
}:CustomButtonProps ) => {

    if (loading) {
        return(
            <View style={[{backgroundColor: 'transparent',borderRadius: radius._17, borderCurve: 'continuous', height: verticalScale(52)}, style]}>
                {/* loadding */}
                <Loading/>
            </View>
        )
    }

  return (
    <TouchableOpacity className='justify-center items-center' style={[{backgroundColor: colors.primary, borderRadius: radius._17, borderCurve: 'continuous', height: verticalScale(52)},style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  )
}

export default Button