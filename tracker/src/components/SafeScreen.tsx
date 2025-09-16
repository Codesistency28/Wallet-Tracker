import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '@/src/constants/colors'

const SafeScreen = ({children}:any) => {
    
  return (
    <SafeAreaView className='flex-1' style={{ backgroundColor:COLORS.background}}>
        {children}
    </SafeAreaView>
  )
}

export default SafeScreen