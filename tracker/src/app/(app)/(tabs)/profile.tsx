import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/src/constants/theme";
import Header from "@/src/components/Header";
import { verticalScale } from "@/src/utils/styling";
import Typo from "@/src/components/Typo";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { accountOptionType } from "@/types";
import { CaretRightIcon, CookieIcon, GearFineIcon, PowerIcon, UserCircleIcon } from "phosphor-react-native";
import Animated, { FadeInDown } from 'react-native-reanimated'
import { router } from "expo-router";

const ProfileScreen = () => {
  const { user } = useUser();
    const  {signOut} = useAuth()
  
  const accountOptions : accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: (<UserCircleIcon size={26} color={colors.white} />),
      routeName: '/(modals)/profileModal',
      bgColor: '#6366f1'
    },
    {
      title: "Settings",
      icon: (<GearFineIcon size={26} color={colors.white} />),
      // routeName: '/(modals)/profileModal',
      bgColor: '#059669'
    },
    {
      title: "Privacy & Policy",
      icon: (<CookieIcon size={26} color={colors.white} />),
      // routeName: '/(modals)/profileModal',
      bgColor: colors.neutral600
    },
    {
      title: "Logout",
      icon: (<PowerIcon size={26} color={colors.white} />),
      // routeName: '/(modals)/profileModal',
      bgColor: '#e11d48'
    },
  ]

  const showLogout = ()=>{
    Alert.alert("Confirm", "Are you sure you wnt to logout",[
      {
        text: 'Cancel',
        onPress: ()=> console.log('cancel logout'),
        style: 'cancel'
      },
      {
        text: 'Logout',
        onPress: ()=> signOut(),
        style: 'destructive'
      },

    ])
  }

  const handlePress = async(item: accountOptionType) =>{
    if (item.title=='Logout') {
      showLogout()
    }

    if (item.routeName) {
      router.push(item.routeName)
    }
  }
  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingHorizontal: spacingX._20 }}>
        {/* header */}
        <Header style={{ marginVertical: spacingY._10 }} title="Profile" />
        <View
          style={{
            marginTop: verticalScale(30),
            alignItems: "center",
            gap: spacingY._15,
          }}
        >
          <View>
            {/* userImage */}
            <Image
              contentFit="cover"
              transition={100}
              source={user.imageUrl}
              style={{
                alignSelf: "center",
                backgroundColor: colors.neutral300,
                width: verticalScale(135),
                height: verticalScale(135),
                borderRadius: 200,
              }}
            />
          </View>
          <View style={{ gap: verticalScale(4), alignItems: "center" }}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user.username}
            </Typo>
          </View>
          <Typo size={13} color={colors.neutral400}>
            {user?.primaryEmailAddress?.emailAddress}
          </Typo>
        </View>


        <View style={{
          marginTop: spacingY._35
        }}>
          {
            accountOptions.map((item,index)=>{
              return(
                <Animated.View entering={FadeInDown.delay(index*5).springify().damping(14)}
                key={index.toString()}
                style={{
                  marginBottom: verticalScale(17)
                }}>
                  <TouchableOpacity onPress={()=>handlePress(item)} style={{flexDirection: 'row', alignItems: 'center', gap: spacingX._10}}>
                    <View style={{
                      height:verticalScale(44),
                      width: verticalScale(44),
                      backgroundColor: item.bgColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: radius._15,
                    }}>
                      {item.icon}
                    </View>
                    <Typo style={{flex:1}} fontWeight={'500'} size={17}>{item.title}</Typo>
                    <CaretRightIcon size={verticalScale(20)} weight="bold" color={colors.white} />
                  </TouchableOpacity>
                </Animated.View>
              )
            })
          }
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;
