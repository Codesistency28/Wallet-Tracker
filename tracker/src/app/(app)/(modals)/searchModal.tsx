import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, spacingX, spacingY } from "@/src/constants/theme";
import Header from "@/src/components/Header";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import BackButton from "@/src/components/BackButton";
import { Image } from "expo-image";
import { scale, verticalScale } from "@/src/utils/styling";
import { useUser } from "@clerk/clerk-expo";

import Typo from "@/src/components/Typo";
import Input from "@/src/components/Input";
import { limit, orderBy, where } from "firebase/firestore";
import useFetchData from "@/src/hooks/useFetchData";
import { TransactionType } from "@/types";
import TransactionList from "@/src/components/TransactionList";



const SearchModal = () => {
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("")

  const constraints = [
      where("uid","==", user?.id),
      orderBy("date", "desc"),
      limit(30)
    ]
  
  
    const {
        data: allTransactions,
        loading:transactionLoading,
        error,
      } = useFetchData<TransactionType>("transactions", constraints);

    const filteredTransactions = allTransactions.filter((item)=>{
      if (search.length>1) {
      if (item.category?.toLowerCase()?.includes(search?.toLowerCase())|| item.type?.toLowerCase()?.includes(search?.toLowerCase())|| item.description?.toLowerCase()?.includes(search?.toLowerCase())) {
          return true
        }
        return false
      }
      return true
    })

  return (
    <ScreenWrapper style={{backgroundColor: colors.neutral900}}>
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
          title={"Search"}
        />

        <ScrollView
          contentContainerStyle={{
            gap: spacingY._30,
            marginTop: spacingY._15,
          }}
        >

          <View style={{ gap: spacingY._10 }}>
            <Input
              placeholder="shoes..."
              value={search}
              onChangeText={(value) =>
                setSearch(value)
              }
              placeholderTextColor={colors.neutral400}
              containerStyle={{backgroundColor: colors.neutral800}}
            />
          </View>
          <View>
            <TransactionList emptyListMessage="No Transaction matched your search keywords" loading={transactionLoading} data={filteredTransactions} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default SearchModal;
