import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Typo from "@/src/components/Typo";
import { colors, spacingY } from "@/src/constants/theme";
import { spacingX } from "@/src/constants/theme";
import { verticalScale } from "@/src/utils/styling";
import Button from "@/src/components/Button";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";

const WelcomeScreen = () => {
  return (
    <ScreenWrapper>
      <View
        style={{ paddingTop: spacingY._7 }}
        className="flex-1 justify-between"
      >
        {/* login button and image */}
        <View>
          <TouchableOpacity
            onPress={()=>router.push("/(app)/login")}
            style={{ marginRight: spacingX._20 }}
            className="self-end"
          >
            <Typo fontWeight={"500"}>Sign-In</Typo>
          </TouchableOpacity>
          <Animated.Image
            entering={FadeIn.duration(2000)}
            className="w-[100%] self-center"
            style={{
              height: verticalScale(300),
              marginTop: verticalScale(100),
            }}
            source={require("@/src/assets/images/welcome.png")}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            paddingTop: verticalScale(30),
            paddingBottom: verticalScale(45),
            gap: spacingY._20,
            shadowColor: "white",
            shadowOffset: { width: 0, height: -10 },
            elevation: 10,
            shadowRadius: 25,
            shadowOpacity: 0.15,
            backgroundColor: colors.neutral900,
          }}
          className="items-center"
        >
          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(500)
              .springify()
              .damping(12)}
            className="items-center"
          >
            <Typo size={25} fontWeight={"800"}>
              Always take control
            </Typo>
            <Typo size={25} fontWeight={"800"}>
              of your finances
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(600)
              .springify()
              .damping(12)}
            className="items-center gap-2"
          >
            <Typo color={colors.textLight} size={13}>
              Finances must be arranged to set a better
            </Typo>
            <Typo color={colors.textLight} size={13}>
              lifestyle in future
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
            style={{ paddingHorizontal: spacingX._25 }}
            className="w-[100%]"
          >
            {/* button */}
            <Button onPress={()=>router.push("/(app)/register")}>
              <Typo size={18} color={colors.black} fontWeight={"600"}>
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default WelcomeScreen;
