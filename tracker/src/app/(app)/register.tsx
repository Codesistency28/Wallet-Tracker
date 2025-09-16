import {
  View,
  Text,
  Pressable,
} from "react-native";
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
import { useSignUp } from "@clerk/clerk-expo";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/src/config/firebase";

const RegisterScreen = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");
  const codeRef = useRef("");
  const nameRef = useRef("");

  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateFields = () => {
    let newErrors = { name: "", email: "", password: "", confirmPassword: "", code: "" };


    if (!nameRef.current) newErrors.name = "Name is required.";
    if (!emailRef.current) newErrors.email = "Email is required.";
    if (!passwordRef.current) newErrors.password = "Password is required.";
    if (!confirmPasswordRef.current)
      newErrors.confirmPassword = "Confirm password is required.";
    if (
      passwordRef.current &&
      confirmPasswordRef.current &&
      passwordRef.current !== confirmPasswordRef.current
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => msg === "");
  };

  const handleSubmit = async () => {
    if (!isLoaded) return;
    if (!validateFields()) return;

    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: emailRef.current,
        password: passwordRef.current,
        username: nameRef.current,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err) {
      if (err?.errors?.length) {
        const clerkError = err.errors[0];

        switch (clerkError.code) {
          case "form_identifier_exists":
            setErrors((prev) => ({
              ...prev,
              email: "This email is already registered.",
            }));
            break;
          case "form_password_pwned":
            setErrors((prev) => ({
              ...prev,
              password: "This password is too weak. Try a stronger one.",
            }));
            break;
          case "form_password_too_short":
            setErrors((prev) => ({
              ...prev,
              password: "Password is too short.",
            }));
            break;
          case "form_password_too_long":
            setErrors((prev) => ({
              ...prev,
              password: "Password is too long.",
            }));
            break;
          case "form_identifier_invalid":
            setErrors((prev) => ({
              ...prev,
              email: "Invalid email format.",
            }));
            break;
            default: 
                null

        }
      } 
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: codeRef.current,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        const userId = signUpAttempt.createdUserId; 

        console.log(userId)
        await setDoc(doc(db, "users",userId),{
          uuid: userId,
          name:nameRef.current,
          email: emailRef.current,
          password: passwordRef.current,
          createdAt: new Date().toISOString()
        })
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <ScreenWrapper>
        <View
          style={{ gap: spacingY._30, paddingHorizontal: spacingX._20 }}
          className="flex-1"
        >
          <BackButton iconSize={28} />
          <View style={{ gap: 5, marginTop: spacingY._20 }}>
            <Typo size={30} fontWeight={"800"}>
              Let's
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              Get you verified
            </Typo>
          </View>

          <View style={{ gap: spacingY._20 }}>
            <Typo size={16} color={colors.textLighter}>
              Please check the code sent to you on email
            </Typo>

            <Input
              onChangeText={(value) => (codeRef.current = value)}
              placeholder="Enter the code"
              icon={
                <Icons.HashStraightIcon
                  size={verticalScale(26)}
                  color={colors.neutral300}
                />
              }
            />
            {errors.code ? (
              <Text style={{ color: "red", fontSize: 13, marginTop: 2 }}>
                {errors.code}
              </Text>
            ) : null}

            <Button onPress={onVerifyPress} loading={isLoading}>
              <Typo size={18} color={colors.black} fontWeight={"700"}>
                Verify
              </Typo>
            </Button>
          </View>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View
        style={{ gap: spacingY._30, paddingHorizontal: spacingX._20 }}
        className="flex-1"
      >
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Let's,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>

        <View style={{ gap: spacingY._20 }}>
          <Typo size={16} color={colors.textLighter}>
            Create an account to track all your expenses
          </Typo>

          {/* Name */}
          <Input
            onChangeText={(value) => (nameRef.current = value)}
            placeholder="Enter your name"
            icon={
              <Icons.UserCircleDashedIcon
                size={verticalScale(26)}
                color={colors.neutral300}
              />
            }
          />

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
          <Input
            secureTextEntry
            onChangeText={(value) => (confirmPasswordRef.current = value)}
            placeholder="Confirm your password"
            icon={
              <Icons.LockIcon
                size={verticalScale(26)}
                color={colors.neutral300}
              />
            }
          />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo size={18} color={colors.black} fontWeight={"700"}>
              Sign Up
            </Typo>
          </Button>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(app)/login")}>
            <Typo fontWeight={"700"} color={colors.primary} size={15}>
              Login
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default RegisterScreen;
