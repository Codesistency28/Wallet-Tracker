import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { scale, verticalScale } from "../utils/styling";
import { colors, spacingX, spacingY } from "../constants/theme";
import Typo from "./Typo";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsThreeOutlineIcon,
} from "phosphor-react-native";
import { useUser } from "@clerk/clerk-expo";
import useFetchData from "../hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";

const HomeCard = () => {
  const { user } = useUser();
  
    const {
      data: wallets,
      loading: walletLoading,
      error:walletError
    } = useFetchData<WalletType>("wallets", [
      where("uid", "==", user?.id),
      orderBy("created", "desc"),
    ]);


    const getTotals = ()=>{
      return wallets.reduce((totals: any,item: WalletType)=>{
        totals.balance = totals.balance + Number(item.amount)
        totals.income = totals.income + Number(item.totalIncome)
        totals.expenses = totals.expenses + Number(item.totalExpenses)
        return totals
      },{balance: 0, income:0, expenses:0})
    }
    
  return (
    <ImageBackground
      source={require("@/src/assets/images/card.png")}
      resizeMode="stretch"
      style={{ height: scale(210), width: "100%", marginTop: spacingY._15 }}
    >
      <View
        style={{
          padding: spacingX._20,
          paddingHorizontal: scale(23),
          height: "87%",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: spacingY._5,
            }}
          >
            <Typo size={17} fontWeight={"500"} color={colors.neutral800}>
              Total Balance
            </Typo>
            <DotsThreeOutlineIcon
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typo color={colors.black} size={30} fontWeight={"bold"}>
            ₹ {walletLoading ? " --- " : getTotals()?.balance?.toFixed(2)}
          </Typo>
        </View>

        {/* expense or income */}
        <View className="flex-row justify-between items-center">
          {/* income */}
          <View style={{ gap: verticalScale(5) }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacingY._7,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.neutral350,
                  padding: spacingY._5,
                  borderRadius: 50,
                }}
              >
                <ArrowUpIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo fontWeight={"500"} color={colors.neutral700} size={16}>
                Income
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo fontWeight={"600"} size={14} color={colors.green}>
                ₹ {walletLoading ? " --- " : getTotals()?.income?.toFixed(2)}
              </Typo>
            </View>
          </View>
          <View style={{ gap: verticalScale(5) }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacingY._7,
              }}
            >
              <View
                style={{
                  backgroundColor: colors.neutral350,
                  padding: spacingY._5,
                  borderRadius: 50,
                }}
              >
                <ArrowDownIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typo fontWeight={"500"} color={colors.neutral700} size={16}>
                Expense
              </Typo>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typo fontWeight={"600"} size={14} color={colors.rose}>
                ₹ {walletLoading ? " --- " : getTotals()?.expenses?.toFixed(2)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;
