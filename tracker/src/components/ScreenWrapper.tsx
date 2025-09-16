import { View, Text, Platform, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import { colors } from '../constants/theme'
import { ScreenWrapperProps } from '@/types'

const { height } = Dimensions.get('window')


const ScreenWrapper = ({style,children}:ScreenWrapperProps) => {
    let paddingTop = Platform.OS == 'ios' ? height * 0.06 : 50
  return (
    <View style={[{paddingTop, backgroundColor:colors.neutral900},style]} className='flex-1'>
        <StatusBar barStyle='light-content' />
      {children}
    </View>
  )
}

export default ScreenWrapper