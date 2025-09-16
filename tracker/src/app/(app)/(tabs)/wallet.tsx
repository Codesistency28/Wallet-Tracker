import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/src/constants/theme";
import { verticalScale } from "@/src/utils/styling";
import Typo from "@/src/components/Typo";
import { PlusCircleIcon, PlusIcon } from "phosphor-react-native";
import { router } from "expo-router";
import useFetchData from "@/src/hooks/useFetchData";
import { WalletType } from "@/types";
import { useUser } from "@clerk/clerk-expo";
import { orderBy, where } from "firebase/firestore";
import Loading from "@/src/components/Loading";
import WalletItem from "@/src/components/WalletItem";

const WalletScreen = () => {
  const { user } = useUser();

  const {
    data: wallets,
    loading,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.id),
    orderBy("created", "desc"),
  ]);

  // console.log(wallets.length)
  const getTotalBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View
          className="justify-center items-center"
          style={{ height: verticalScale(160), backgroundColor: colors.black }}
        >
          <View className="items-center">
            <Typo size={45} fontWeight={"500"}>
              ₹ {getTotalBalance().toFixed(2)}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Balance
            </Typo>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: colors.neutral900,
            borderTopRightRadius: radius._30,
            borderTopLeftRadius: radius._30,
            padding: spacingX._20,
            paddingTop: spacingX._25,
          }}
        >
          <View
            className="flex-row justify-between items-center"
            style={{ marginTop: spacingY._10 }}
          >
            <Typo size={20} fontWeight={"500"}>
              My Wallets
            </Typo>
            <TouchableOpacity
              onPress={() => router.push("/(app)/(modals)/walletModal")}
            >
              <PlusCircleIcon
                size={verticalScale(33)}
                weight="fill"
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {loading && <Loading />}

          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return <WalletItem item={item} index={index} router={router} />;
            }}
            contentContainerStyle={{
              paddingVertical: spacingY._25,
              paddingTop: spacingY._25,
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default WalletScreen;
