import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/src/constants/theme";
import Header from "@/src/components/Header";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import BackButton from "@/src/components/BackButton";
import { Image } from "expo-image";
import { scale, verticalScale } from "@/src/utils/styling";
import { useUser } from "@clerk/clerk-expo";
import { PencilSimpleIcon } from "phosphor-react-native";
import Typo from "@/src/components/Typo";
import Input from "@/src/components/Input";
import { UserDataType } from "@/types";
import Button from "@/src/components/Button";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const ProfileModalScreen = () => {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserData({
      name: user?.username || "",
      image: user?.imageUrl || null,
    });
  }, [user]);

  // 📸 Pick image from gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "We need access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUserData({ ...userData, image: uri });
    }
  };

  // ✅ Update profile (name + image)
  const onSubmit = async () => {
    let { name, image } = userData;

    if (!name.trim()) {
      Alert.alert("User", "Please fill all details");
      return;
    }

    try {
      setLoading(true);

      // update username
      await user?.update({ username: name });

      // update profile image if changed
      if (image && image !== user?.imageUrl) {
        const response = await fetch(image);
        const blob = await response.blob();

        await user?.setProfileImage({
          file: new File([blob], "profile.jpg", { type: "image/jpeg" }),
        });
      }

      Alert.alert("Success", "Profile updated successfully ✅");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingHorizontal: spacingY._20,
        }}
      >
        <Header
          style={{ marginBottom: spacingY._10 }}
          leftIcon={<BackButton />}
          title="Update Profile"
        />

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._30,
            marginTop: spacingY._15,
          }}
        >
          <View
            style={{
              position: "relative",
              alignSelf: "center",
            }}
          >
            <Image
              style={{
                alignSelf: "center",
                backgroundColor: colors.neutral300,
                height: verticalScale(135),
                width: verticalScale(135),
                borderRadius: 200,
                borderWidth: 1,
                borderColor: colors.neutral500,
              }}
              source={{ uri: userData.image || user?.imageUrl }}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity
              onPress={pickImage}
              style={{
                position: "absolute",
                bottom: spacingY._5,
                right: spacingY._7,
                borderRadius: 100,
                backgroundColor: colors.neutral100,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 4,
                padding: spacingY._7,
              }}
            >
              <PencilSimpleIcon
                size={verticalScale(20)}
                color={colors.neutral800}
              />
            </TouchableOpacity>
          </View>

          <View style={{ gap: spacingY._10 }}>
            <Typo color={colors.neutral200}>Name</Typo>
            <Input
              placeholder="Name"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: spacingX._20,
          gap: scale(12),
          paddingTop: spacingY._15,
          borderTopColor: colors.neutral700,
          marginBottom: spacingY._40,
          borderTopWidth: 1,
        }}
      >
        <Button loading={loading} style={{ flex: 1 }} onPress={onSubmit}>
          <Typo size={18} color={colors.black} fontWeight={"700"}>
            Update
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileModalScreen;
