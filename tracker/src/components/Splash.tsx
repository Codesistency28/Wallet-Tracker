import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '@/src/constants/theme'
import { router } from 'expo-router'

const SplashScreen = () => {
  return (
    <View style={{backgroundColor: colors.neutral900}} className='flex-1 justify-center items-center'>
      <Image
        style={{aspectRatio: 1}}
        className='h-[20%]'
        resizeMode='contain'
        source={require('@/src/assets/images/adaptive-icon.png')}
      />
    </View>
  )
}

export default SplashScreen