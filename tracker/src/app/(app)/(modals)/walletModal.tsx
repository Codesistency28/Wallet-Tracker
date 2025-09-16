import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/src/constants/theme";
import Header from "@/src/components/Header";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import BackButton from "@/src/components/BackButton";
import { Image } from "expo-image";
import { scale, verticalScale } from "@/src/utils/styling";
import { useUser } from "@clerk/clerk-expo";
import { PencilSimpleIcon, TrashIcon } from "phosphor-react-native";
import Typo from "@/src/components/Typo";
import Input from "@/src/components/Input";
import { UserDataType, WalletType } from "@/types";
import Button from "@/src/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import ImageUpload from "@/src/components/ImageUpload";
import { createOrUpdate, deleteWallet } from "@/src/services/walletService";
import useFetchData from "@/src/hooks/useFetchData";


const WalletModal = () => {
  const { user } = useUser();
  const [wallet, setWallet] = useState<WalletType>({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const oldWallet :{name:string; image: string; id: string;} = useLocalSearchParams()
  // console.log(oldWallet)

  useEffect(()=>{
    //  console.log("oldWallet from params:", oldWallet);
    if (oldWallet?.id) {
      setWallet({
        name: oldWallet.name,
        image: oldWallet?.image
      })
    }
  },[])

const onSubmit = async () => {
  let {name, image} = wallet
  if (!name.trim() || !image) {
    Alert.alert("User", "Please fill all the details")
    return
  }

  const data: WalletType = {
    name,
    image,
    uid:user.id
  }





  if (oldWallet?.id) {
    data.id = oldWallet?.id
  }


  setLoading(true)
  const res = await createOrUpdate(data)
  setLoading(false)
  // console.log(res)
  if (res.success) {
    router.back()
  }
};

const onDelete = async() =>{
  if (!oldWallet?.id) return

  setLoading(true)
  const res = await deleteWallet(oldWallet?.id)
  setLoading(false)
  if (res.success) {
    router.back()
  }else{
    Alert.alert("Wallet", res.msg)
  }
}

const showDeleteAlert =()=>{
  Alert.alert("Confirm", "Are you sure you want to delete this? \nThis action will remove all the transactions realted to this wallet",[
    {
      text:"Cancel",
      onPress: ()=>console.log("back"),
      style:'cancel'
    },{
      text:"Delete",
      onPress: ()=>onDelete(),
      style:'destructive'
    },
  ])
}

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
          title={oldWallet?.id ? "Update Wallet" : "New Wallet"}
        />

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._30,
            marginTop: spacingY._15,
          }}
        >

          <View style={{ gap: spacingY._10 }}>
            <Typo color={colors.neutral200}>Wallet Name</Typo>
            <Input
              placeholder="Salary"
              value={wallet.name}
              onChangeText={(value) =>
                setWallet({ ...wallet, name: value })
              }
            />
          </View>
          <View style={{ gap: spacingY._10 }}>
            <Typo color={colors.neutral200}>Wallet Icon</Typo>
            <ImageUpload onClear={()=>setWallet({...wallet, image: null})} onSelect={file=>setWallet({...wallet, image:file})} file={wallet.image} placeholder="Upload Image" />
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
        {
          oldWallet?.id && !loading && (
            <Button onPress={showDeleteAlert} style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15
            }}>
              <TrashIcon color={colors.white} size={verticalScale(24)} weight="bold" />
            </Button>
          )
        }
        <Button loading={loading} style={{ flex: 1 }} onPress={()=>onSubmit()}>
          <Typo size={18} color={colors.black} fontWeight={"700"}>
            {oldWallet?.id ? "Update Wallet" : "Add Wallet"}
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default WalletModal;
