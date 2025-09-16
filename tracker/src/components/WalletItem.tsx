import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Typo from './Typo'
import { WalletType } from '@/types'
import { Router } from 'expo-router';
import { verticalScale } from '../utils/styling';
import { colors, radius, spacingY } from '../constants/theme';
import { Image } from 'expo-image';
import { CaretRightIcon } from 'phosphor-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const WalletItem = ({
    item,
    index,
    router
}:{
    item: WalletType,
    index: number,
    router: Router
}) => {

  const openWallet =  ()=>{
    router.push({
      pathname: "/(app)/(modals)/walletModal",
      params:{
        id: item?.id,
        name: item?.name,
        image: item?.image
      }
    })
  }
  return (
    <Animated.View entering={FadeInDown.delay(index*80).springify().damping(13)}>
      <TouchableOpacity onPress={openWallet} className='flex-row items-center' style={{marginBottom: verticalScale(17)}}>
        <View style={{
            height: verticalScale(40),
            width: verticalScale(40),
            borderWidth:1,
            borderColor: colors.neutral600,
            borderRadius: radius._12,
            borderCurve: "continuous",
            overflow: 'hidden'
        }}>

            <Image 
                style={{flex:1}}
                source={item?.image}
                contentFit='cover'
                transition={100}
            />
        </View>
        <View style={{flex:1, gap:2, marginLeft: spacingY._10}}>
            <Typo size={15}>{item.name}</Typo>
            <Typo color={colors.neutral400} size={13}>₹ {item.amount}</Typo>
        </View>

        <CaretRightIcon size={verticalScale(20)} weight='bold' color={colors.white} />
      </TouchableOpacity>
    </Animated.View>
  )
}

export default WalletItem