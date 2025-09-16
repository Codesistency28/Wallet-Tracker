import { View, Text, Pressable, Alert } from "react-native";
import React, { useRef, useState } from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { colors, spacingX, spacingY } from "@/src/constants/theme";
import BackButton from "@/src/components/BackButton";
import Typo from "@/src/components/Typo";
import Input from "@/src/components/Input";
import * as Icons from "phosphor-react-native";
import { verticalScale } from "@/src/utils/styling";
import Button from "@/src/components/Button";
import { router } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

const LoginScreen = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, seIisLoading] = useState(false);
    const { signIn, setActive, isLoaded } = useSignIn()


  const handleSubmit = async () => {
    const password= passwordRef.current
    const emailAddress = emailRef.current
    
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "please fill all the details")
      return
    }
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  };
  return (
    <ScreenWrapper>
      <View
        style={{ gap: spacingY._30, paddingHorizontal: spacingX._20 }}
        className="flex-1"
      >
        {/* back button */}
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcom back
          </Typo>
        </View>


        {/* login form */}
        <View style={{ gap: spacingY._20 }}>
          <Typo size={16} color={colors.textLighter}>
            Login now to track all your expenses
          </Typo>
          <Input
            onChangeText={(value) => (emailRef.current = value)}
            placeholder="Enter your email"
            icon={
              <Icons.AtIcon
                size={verticalScale(26)}
                color={colors.neutral300}
              />
            }
          />

          <Input
            secureTextEntry
            onChangeText={(value) => (passwordRef.current = value)}
            placeholder="Enter your password"
            icon={
              <Icons.LockIcon
                size={verticalScale(26)}
                color={colors.neutral300}
              />
            }
          />

          <Typo style={{ alignSelf: "flex-end" }} size={12} color={colors.text}>
            Fogort Password?
          </Typo>
          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo size={18} color={colors.black} fontWeight={"700"}>
              Login
            </Typo>
          </Button>
        </View>

        {/* footer */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Typo size={15}>Dont have a account?</Typo>
          <Pressable onPress={() => router.navigate("/(app)/register")}>
            <Typo fontWeight={"700"} color={colors.primary} size={15}>
              Sign up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;
