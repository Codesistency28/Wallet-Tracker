import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ImageUploadProps } from '@/types'
import { UploadSimpleIcon, XCircleIcon } from 'phosphor-react-native'
import { colors, radius } from '../constants/theme'
import Typo from './Typo'
import { scale, verticalScale } from '../utils/styling'
import { Image } from 'expo-image'
import { getFilePath } from '../services/userService'
import * as ImagePicker from "expo-image-picker"

const ImageUpload = ({
    file = null,
    onSelect,
    onClear,
    containerStyle,
    imageStyle,
    placeholder =""
}: ImageUploadProps) => {


    const pickImage = async()=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
        onSelect(result.assets[0]
          
        )
    }
    }
  return (
    <View>
      {
        !file && (
            <TouchableOpacity onPress={pickImage} style={[{
                height: verticalScale(54),
                backgroundColor: colors.neutral700,
                borderRadius: radius._15,
                borderWidth: 1,
                borderColor: colors.neutral500,
                flexDirection: 'row',
                justifyContent: 'center',
                gap:10,
                borderStyle: 'dashed',
                alignItems: 'center'
            }, containerStyle && containerStyle]}>
                <UploadSimpleIcon color={colors.neutral200} />
                {placeholder && <Typo size={14}>{placeholder}</Typo>}
            </TouchableOpacity>
        )
      }


      {
        file && (
            <View style={[imageStyle && imageStyle, {
                height: scale(150),
                width: scale(150),
                borderRadius: radius._15,
                borderCurve: 'continuous',
                overflow: 'hidden'
            }]}>
                <Image 
                style={{flex:1}}
                    source={{uri: file}}
                    contentFit='cover'
                    transition={100}
                />
                <TouchableOpacity onPress={onClear} style={{
                    position: 'absolute',
                    top: scale(6),
                    right: scale(6),
                    shadowColor: colors.black,
                    shadowOffset: {width: 0, height:5},
                    shadowOpacity: 1,
                    shadowRadius: 10
                }}>
                    <XCircleIcon weight='fill' color={colors.white} size={verticalScale(24)} />
                </TouchableOpacity>
            </View>
        )
      }
    </View>
  )
}

export default ImageUpload