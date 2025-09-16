import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Button from "@/src/components/Button";
import { colors, radius, spacingX, spacingY } from "@/src/constants/theme";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import Typo from "@/src/components/Typo";
import { verticalScale } from "@/src/utils/styling";
import { MagnifyingGlassIcon, PlugIcon, PlusIcon } from "phosphor-react-native";
import HomeCard from "@/src/components/HomeCard";
import TransactionList from "@/src/components/TransactionList";
import { router } from "expo-router";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/src/hooks/useFetchData";
import { TransactionType, WalletType } from "@/types";

const TabsIndex = () => {
  const { user } = useUser();
  const constraints = [
    where("uid","==", user?.id),
    orderBy("date", "desc"),
    limit(30)
  ]


  const {
      data: recentTransactions,
      loading:transactionLoading,
      error,
    } = useFetchData<TransactionType>("transactions", constraints);
  

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacingX._20,
          marginTop: verticalScale(8),
        }}
      >
        {/* header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: spacingY._10,
          }}
        >
          <View style={{ gap: 4 }}>
            <Typo size={16} color={colors.neutral400}>
              Hello,
            </Typo>
            <Typo size={20} fontWeight={"500"}>
              {user.username}
            </Typo>
          </View>
          <TouchableOpacity
            onPress={()=>router.push('/(app)/(modals)/searchModal')}
            style={{
              backgroundColor: colors.neutral700,
              padding: spacingX._10,
              borderRadius: 50,
            }}
          >
            <MagnifyingGlassIcon
              size={verticalScale(22)}
              color={colors.neutral200}
              weight="bold"
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{
            marginTop: spacingY._10,
            paddingBottom: verticalScale(90),
            gap: spacingY._25
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* card */}
          <View>
            <HomeCard />
          </View>
          <TransactionList emptyListMessage="No Transactions added yet" data={recentTransactions} loading={transactionLoading} title="Recent Transactions" />
        </ScrollView>


        <Button onPress={()=>router.push('/(app)/(modals)/transactionModal')} style={{height: verticalScale(50),width: verticalScale(50), borderRadius: 100, position: 'absolute', bottom: verticalScale(30), right:verticalScale(30)}}>
          <PlusIcon weight="bold" size={verticalScale(24)} color={colors.black} />
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default TabsIndex;
