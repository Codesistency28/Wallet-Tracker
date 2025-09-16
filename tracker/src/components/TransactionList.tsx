import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { TransactionListType, TransactionItemProps, TransactionType } from "@/types";
import { colors, radius, spacingX, spacingY } from "../constants/theme";
import Typo from "./Typo";
import { FlashList } from "@shopify/flash-list";
import { verticalScale } from "../utils/styling";
import Loading from "./Loading";
import { expenseCategories, incomeCategory } from "../constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Timestamp } from "firebase/firestore";
import { router } from "expo-router";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = async (item:TransactionType) => {
    router.push({
      pathname: "/(app)/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item.category,
        date: (item.date as Timestamp)?.toDate().toISOString(),
        description: item?.description,
        image: item.image,
        uid: item?.id,
        walletId: item.walletId
      }
    })
  };
  return (
    <View style={{ gap: spacingY._17 }}>
      {title && (
        <Typo size={20} fontWeight={"500"}>
          {title}
        </Typo>
      )}
      <View style={{ minHeight: 3 }}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              handleClick={handleClick}
              index={index}
              item={item}
            />
          )}
          estimatedItemSize={60}
        />
      </View>
      {!loading && data.length == 0 && (
        <Typo
          size={14}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
          color={colors.neutral400}
        >
          {emptyListMessage}
        </Typo>
      )}
      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category = item?.type == 'income'? incomeCategory : expenseCategories[item.category]
  const IconComponent = category.icon;
  // console.log(category)

  const date = (item?.date as Timestamp)?.toDate()?.toLocaleDateString("en-GB",{
    day: "numeric",
    month: "short"
  })
  return (
    <Animated.View entering={FadeInDown.delay(index*70).springify().damping(14)}>
      <TouchableOpacity
        onPress={()=>handleClick(item)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: spacingX._12,
          marginBottom: spacingY._12,
          backgroundColor: colors.neutral800,
          padding: spacingY._10,
          paddingHorizontal: spacingY._10,
          borderRadius: radius._17,
        }}
      >
        <View
          style={[
            {
              backgroundColor: category.bgColor,
              height: verticalScale(44),
              aspectRatio: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: radius._12,
              borderCurve: "continuous",
            },
          ]}
        >
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>
        <View style={{ flex: 1, gap: 2.5 }}>
          <Typo size={15}>{category.label}</Typo>
          <Typo
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item?.description}
          </Typo>
        </View>

        <View style={{ alignItems: "flex-end", gap: 3 }}>
          <Typo size={14} color={item?.type == 'income'? colors.primary: colors.rose} fontWeight={"500"}>
            {
              `${item.type == 'income'? "+ ₹" : "- ₹"}${item?.amount}`
            } 
          </Typo>
          <Typo size={10} color={colors.neutral400}>
            {date}
          </Typo>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionList;
