import { View, Text } from 'react-native'
import React from 'react'
import { HeaderProps } from '@/types'
import Typo from './Typo'

const Header = ({
    title="",
    leftIcon,
    style
}: HeaderProps) => {
  return (
    <View style={[{width: '100%', alignItems: 'center', flexDirection: 'row'},style]}>
      {leftIcon && <View style={{alignSelf: 'flex-start',}}>{leftIcon}</View>}
      {
        title && (
            <Typo size={22} style={{textAlign:'center', width: leftIcon? '82%': '100%'}} fontWeight={"600"}>
                {title}
            </Typo>
        )
      }
    </View>
  )
}

export default Header