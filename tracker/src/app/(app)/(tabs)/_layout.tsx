import { Platform, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import {
  UserCircleDashedIcon,
  WalletIcon,
  ChartDonutIcon,
  HouseLineIcon,
  HouseIcon,
} from "phosphor-react-native";
import { colors } from "@/src/constants/theme";
import { PlatformPressable } from "@react-navigation/elements";
import { verticalScale } from "@/src/utils/styling";

const TabLayout = () => {
  const { user } = useUser();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // 🚀 remove labels
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neutral500,
        tabBarStyle: {
          backgroundColor: colors.neutral800,
          borderTopWidth: 1,
          width: '100%',
          height: Platform.OS == 'ios'? verticalScale(73): verticalScale(55),
          paddingTop: 10,
          borderColor: colors.neutral700
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <HouseIcon size={35} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          tabBarIcon: ({ color, size }) => (
            <ChartDonutIcon size={35} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ color, size }) => (
            <WalletIcon size={35}  color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <UserCircleDashedIcon size={35} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
