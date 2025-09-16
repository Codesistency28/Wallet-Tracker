import { View, Text, ScrollView, Pressable, Platform, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { colors, radius, spacingX, spacingY } from "@/src/constants/theme";
import Header from "@/src/components/Header";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import BackButton from "@/src/components/BackButton";
import { Image } from "expo-image";
import { scale, verticalScale } from "@/src/utils/styling";
import { useUser } from "@clerk/clerk-expo";
import { TrashIcon } from "phosphor-react-native";
import Typo from "@/src/components/Typo";
import Input from "@/src/components/Input";
import { TransactionType, UserDataType, WalletType } from "@/types";
import Button from "@/src/components/Button";
import { router, useLocalSearchParams } from "expo-router";
import ImageUpload from "@/src/components/ImageUpload";
import { Dropdown } from "react-native-element-dropdown";
import useFetchData from "@/src/hooks/useFetchData";
import { expenseCategories, transactionTypes } from "@/src/constants/data";
import { orderBy, where } from "firebase/firestore";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createOrUpdateTransaction, deleteTransaction } from "@/src/services/transactionService";

const TransactionModal = () => {
  const { user } = useUser();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: "expense",
    amount: 0,
    category: "",
    description: "",
    date: new Date(),
    walletId: "",
    image: null,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    data: wallets,
    loading: walletLoading,
    error: walletError,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.id),
    orderBy("created", "desc"),
  ]);

  const [loading, setLoading] = useState(false);


  type paramType = {
    id: string,
    type: string,
    amount: string,
    category: string,
    date: string,
    description: string,
    image?: any,
    uid: string,
    walletId: string
  }
  const oldTransaction: paramType =
    useLocalSearchParams();

    useEffect(()=>{
      if (oldTransaction?.id) {
        setTransaction({
          type: oldTransaction.type,
          amount: Number(oldTransaction.amount),
          description: oldTransaction.description || "",
          category: oldTransaction.category || "",
          date: new Date(oldTransaction.date),
          walletId: oldTransaction.walletId,
          image: oldTransaction?.image
        })
      }
    },[])


    const onDelete = async() =>{
      if (!oldTransaction?.id) return
    
      setLoading(true)
      const res = await deleteTransaction(oldTransaction?.id, oldTransaction.walletId)
      setLoading(false)
      if (res.success) {
        router.back()
      }else{
        Alert.alert("Transaction", res.msg)
      }
    }
    
    const showDeleteAlert =()=>{
      Alert.alert("Confirm", "Are you sure you want to delete this transaction?",[
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

  const onSubmit = async () => {
    const {type, amount, description, category, date, walletId, image} = transaction
    if (!walletId || !date || !amount || (type =='expense' && !category)) {
        Alert.alert("Transactions", "lease fill all the feilds")
        return
    }

    let transactionData: TransactionType = {
        type,
        amount,
        description,
        category,
        date,
        walletId,
        image,
        uid: user?.id
    }

    //todo later 
    if (oldTransaction?.id) {
      transactionData.id = oldTransaction.id
    }



    setLoading(true)
    const res = await createOrUpdateTransaction(transactionData)
    if (res.success) {
      router.back()
    }else{
      Alert.alert("Transactions", res.msg)
      setLoading(false)
    }
  };


  const onDateCHange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(false);
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacingY._20,
        }}
      >
        <Header
          style={{ marginBottom: spacingY._10 }}
          leftIcon={<BackButton />}
          title={
            oldTransaction?.id ? "Update Transactions" : "New Transactions"
          }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: spacingY._20,
            marginTop: spacingY._15,
            paddingBottom: spacingY._30
          }}
        >
          <View style={{ gap: spacingY._5 }}>
            <Typo size={14} color={colors.neutral200}>
              Type
            </Typo>
            {/* //dropdown here */}

            <Dropdown
              style={[
                {
                  height: verticalScale(54),
                  borderWidth: 1,
                  borderColor: colors.neutral300,
                  paddingHorizontal: spacingX._15,
                  borderRadius: radius._15,
                  borderCurve: "continuous",
                },
              ]}
              placeholderStyle={{ color: colors.white }}
              selectedTextStyle={{
                color: colors.white,
                fontSize: verticalScale(14),
              }}
              iconStyle={{
                height: verticalScale(30),
                tintColor: colors.neutral300,
              }}
              data={transactionTypes}
              maxHeight={300}
              itemTextStyle={{ color: colors.white }}
              itemContainerStyle={{
                borderRadius: radius._15,
                marginHorizontal: spacingX._7,
              }}
              containerStyle={{
                backgroundColor: colors.neutral900,
                borderRadius: radius._15,
                borderCurve: "continuous",
                paddingVertical: spacingY._7,
                top: 5,
                borderColor: colors.neutral500,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 15,
                elevation: 5,
              }}
              labelField="label"
              valueField="value"
              value={transaction.type}
              onChange={(item) => {
                setTransaction({ ...transaction, type: item.value });
              }}
              activeColor={colors.neutral700}
            />
          </View>

          {/* wallet */}

          <View style={{ gap: spacingY._5 }}>
            <Typo size={14} color={colors.neutral200}>
              Wallet
            </Typo>
            {/* //dropdown here */}

            <Dropdown
              style={[
                {
                  height: verticalScale(54),
                  borderWidth: 1,
                  borderColor: colors.neutral300,
                  paddingHorizontal: spacingX._15,
                  borderRadius: radius._15,
                  borderCurve: "continuous",
                },
              ]}
              placeholderStyle={{ color: colors.white }}
              selectedTextStyle={{
                color: colors.white,
                fontSize: verticalScale(14),
              }}
              iconStyle={{
                height: verticalScale(30),
                tintColor: colors.neutral300,
              }}
              data={wallets.map((wallet) => ({
                label: `${wallet?.name} ( ₹ ${wallet.amount} )`,
                value: wallet?.id,
              }))}
              maxHeight={300}
              itemTextStyle={{ color: colors.white }}
              itemContainerStyle={{
                borderRadius: radius._15,
                marginHorizontal: spacingX._7,
              }}
              containerStyle={{
                backgroundColor: colors.neutral900,
                borderRadius: radius._15,
                borderCurve: "continuous",
                paddingVertical: spacingY._7,
                top: 5,
                borderColor: colors.neutral500,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 15,
                elevation: 5,
              }}
              labelField="label"
              valueField="value"
              value={transaction.walletId}
              placeholder={"Select Wallet"}
              onChange={(item) => {
                setTransaction({ ...transaction, walletId: item.value || "" });
              }}
              activeColor={colors.neutral700}
            />
          </View>

          {/* expeense Category */}

          {transaction.type == "expense" && (
            <View style={{ gap: spacingY._5 }}>
              <Typo size={14} color={colors.neutral200}>
                Expense Category
              </Typo>
              {/* //dropdown here */}

              <Dropdown
                style={[
                  {
                    height: verticalScale(54),
                    borderWidth: 1,
                    borderColor: colors.neutral300,
                    paddingHorizontal: spacingX._15,
                    borderRadius: radius._15,
                    borderCurve: "continuous",
                  },
                ]}
                placeholderStyle={{ color: colors.white }}
                selectedTextStyle={{
                  color: colors.white,
                  fontSize: verticalScale(14),
                }}
                iconStyle={{
                  height: verticalScale(30),
                  tintColor: colors.neutral300,
                }}
                data={Object.values(expenseCategories)}
                maxHeight={300}
                itemTextStyle={{ color: colors.white }}
                itemContainerStyle={{
                  borderRadius: radius._15,
                  marginHorizontal: spacingX._7,
                }}
                containerStyle={{
                  backgroundColor: colors.neutral900,
                  borderRadius: radius._15,
                  borderCurve: "continuous",
                  paddingVertical: spacingY._7,
                  top: 5,
                  borderColor: colors.neutral500,
                  shadowColor: colors.black,
                  shadowOffset: { width: 0, height: 5 },
                  shadowOpacity: 1,
                  shadowRadius: 15,
                  elevation: 5,
                }}
                labelField="label"
                valueField="value"
                value={transaction.category}
                placeholder={"Select Category"}
                onChange={(item) => {
                  setTransaction({
                    ...transaction,
                    category: item.value || "",
                  });
                }}
                activeColor={colors.neutral700}
              />
            </View>
          )}

          {/* date picker  */}

          <View style={{ gap: spacingY._5 }}>
            <Typo size={14} color={colors.neutral200}>
              Date
            </Typo>
            {!showDatePicker && (
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={{
                  flexDirection: "row",
                  height: verticalScale(54),
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.neutral300,
                  borderRadius: radius._17,
                  borderCurve: "continuous",
                  paddingHorizontal: spacingX._15,
                }}
              >
                <Typo size={13}>
                  {(transaction.date as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}

            {showDatePicker && (
              <View style={Platform.OS == "ios" ? "" : {}}>
                <DateTimePicker
                  themeVariant="dark"
                  value={transaction.date as Date}
                  textColor={colors.white}
                  mode="date"
                  display="default"
                  onChange={onDateCHange}
                />
              </View>
            )}
          </View>

          {/* amount */}
          <View style={{ gap: spacingY._5 }}>
            <Typo size={14} color={colors.neutral200}>
              Amount
            </Typo>
            <Input
              //   placeholder="Salary"
              keyboardType="numeric"
              value={transaction.amount?.toString()}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  amount: Number(value.replace(/[^0-9]/g, "")),
                })
              }
            />
          </View>

          {/* description */}

          <View style={{ gap: spacingY._5 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: spacingX._5,
              }}
            >
              <Typo size={14} color={colors.neutral200}>
                Description
              </Typo>
              <Typo size={13} color={colors.neutral500}>
                ( optional )
              </Typo>
            </View>
            <Input
              //   placeholder="Salary"
              value={transaction.description}
              multiline
              containerStyle={{
                flexDirection:'row',
                height: verticalScale(100),
                alignItems:"flex-start",
                paddingVertical: 15
              }}
              onChangeText={(value) =>
                setTransaction({
                  ...transaction,
                  description: value,
                })
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
        {oldTransaction?.id && !loading && (
          <Button
          onPress={showDeleteAlert}
            style={{
              backgroundColor: colors.rose,
              paddingHorizontal: spacingX._15,
            }}
          >
            <TrashIcon
              color={colors.white}
              size={verticalScale(24)}
              weight="bold"
            />
          </Button>
        )}
        <Button
          loading={loading}
          style={{ flex: 1 }}
          onPress={() => onSubmit()}
        >
          <Typo size={18} color={colors.black} fontWeight={"700"}>
            {oldTransaction?.id ? "Update" : "Submit"}
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default TransactionModal;
