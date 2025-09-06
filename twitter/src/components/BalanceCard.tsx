import { View, Text } from "react-native";
import { styles } from "@/src/assets/styles/home.styles";
import { COLORS } from "@/src/constants/colors";

export const BalanceCard = ({ summary }) => {
  // provide fallback defaults so UI never waits
  const safeSummary = {
    balance: summary?.balance ?? 0,
    income: summary?.income ?? 0,
    expenses: summary?.expenses ?? 0,
  };

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Total Balance</Text>
      <Text style={styles.balanceAmount}>
        ${parseFloat(safeSummary.balance).toFixed(2)}
      </Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
            +${parseFloat(safeSummary.income).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]} />
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Expenses</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
            -${Math.abs(parseFloat(safeSummary.expenses)).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};
