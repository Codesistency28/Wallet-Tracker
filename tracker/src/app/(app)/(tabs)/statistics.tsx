import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  BarChart,
} from "react-native-gifted-charts";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import ScreenWrapper from "@/src/components/ScreenWrapper";
import { colors, radius, spacingX, spacingY } from "@/src/constants/theme";
import Header from "@/src/components/Header";
import { scale, verticalScale } from "@/src/utils/styling";
import Typo from "@/src/components/Typo";
import Loading from "@/src/components/Loading";
import { useUser } from "@clerk/clerk-expo";
import { fetchMonthlylyStats, fetchWeeklyStats, fetchYearlyStats } from "@/src/services/transactionService";
import TransactionList from "@/src/components/TransactionList";



const StatisticsScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartLoading, setChartLoading] = useState(false)
  const {user} = useUser()
  const [chartData, setChartData] = useState([])
  const [transaction, setTransaction] = useState([])

  const getWeeklyStats = async()=>{
    setChartLoading(true)
    let res =  await fetchWeeklyStats(user.id as string)
    setChartLoading(false)
    if (res.success) {
      setChartData(res.data?.stats)
      setTransaction(res.data?.transactions)
    }else{
      Alert.alert(res.msg)
    }
  }
  const getMonthlyStats = async()=>{
    setChartLoading(true)
    let res =  await fetchMonthlylyStats(user.id as string)
    setChartLoading(false)
    if (res.success) {
      setChartData(res.data?.stats)
      setTransaction(res.data?.transactions)
    }else{
      Alert.alert(res.msg)
    }
  }
  const getYearlyStats = async()=>{
    setChartLoading(true)
    let res =  await fetchYearlyStats(user.id as string)
    setChartLoading(false)
    if (res.success) {
      setChartData(res.data?.stats)
      setTransaction(res.data?.transactions)
    }else{
      Alert.alert(res.msg)
    }
  }


  useEffect(()=>{
    if (activeIndex==0) {
      getWeeklyStats()
    }
    if (activeIndex==1) {
      getMonthlyStats()
    }
    if (activeIndex==2) {
      getYearlyStats()
    }
  },[activeIndex])

  return (
    <ScreenWrapper>
      <View
        style={{
          paddingHorizontal: spacingX._20,
          paddingVertical: spacingY._5,
          gap: spacingY._10,
        }}
      >
        <View>
          <Header title="Statistics" />
        </View>
        <ScrollView
          contentContainerStyle={{
            gap: spacingY._20,
            paddingTop: spacingY._5,
            paddingBottom: verticalScale(100),
          }}
          showsVerticalScrollIndicator={false}
        >
          <SegmentedControl
            values={["Weekly", "Monthly", "Yearly"]}
            selectedIndex={activeIndex}
            onChange={(event) => {
              setActiveIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            tintColor={colors.neutral200}
            backgroundColor={colors.neutral800}
            appearance="dark"
            activeFontStyle={{fontSize: verticalScale(12), fontWeight: "bold", color: colors.black}}
            style={{height:scale(37)}}
            fontStyle={{fontSize: verticalScale(12), fontWeight: "bold", color:colors.white }}
          />
          <View className="relative justify-center items-center">
            {
              chartData.length >0 ? (
                <BarChart
                  data={chartData}
                  barWidth={scale(14)}
                  spacing={[1,2].includes(activeIndex)?scale(25): scale(16)}
                  roundedTop
                  roundedBottom
                  hideRules
                  yAxisLabelPrefix="₹"
                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisLabelWidth={[1,2].includes(activeIndex)?scale(38): scale(35)}
                  yAxisTextStyle={{color:colors.neutral350}}
                  xAxisLabelTextStyle={{
                    color:colors.neutral350,
                    fontSize: verticalScale(8),
                    // alignItems: 'center',
                    // justifyContent: 'center'
                  }}
                  noOfSections={3}
                  minHeight={5}
                  // isAnimated={true}
                  // animationDuration={1000}
                  // maxValue={100}
                />
              ) :(
                <View style={{backgroundColor: "rgba(0,0,0,0.6", height: verticalScale(210)}} />
              )
            }

            {
              chartLoading && (
                <View className="absolute w-[100%] h-[100%]" style={{borderRadius: radius._12, backgroundColor: "rgba(0,0,0,0.6"}}>
                  <Loading color={colors.white} />
                </View>
              )
            }
          </View>
          {/* transactions */}

          <View>
            <TransactionList data={transaction} emptyListMessage="No Transaction Found" title="Transactions" />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default StatisticsScreen;
