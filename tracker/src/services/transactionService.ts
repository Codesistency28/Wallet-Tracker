import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { uploadFileToCLoudinary } from "./imageService";
import { transactionTypes } from "../constants/data";
import { getLast70Days, getYearRange } from "../utils/getLast70Days";
import { push } from "expo-router/build/global-state/routing";
import { scale } from "../utils/styling";
import { colors } from "../constants/theme";
import { getLast12Months } from "../utils/common";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, image, amount } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid transaction data !" };
    }

    if (id) {
      //later
      const oldTransactionSnapshot = await getDoc(doc(db, "transactions", id));
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;

      const shouldRevertOriginal =
        oldTransaction.type != type ||
        oldTransaction.amount != amount ||
        oldTransaction.walletId != walletId;

      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallet(
          oldTransaction,
          walletId,
          Number(amount),
          type
        );

        if (!res.success) {
          return res;
        }
      }
    } else {
      //update wallet
      let res = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );

      if (!res.success) return res;
    }

    if (image) {
      const imageUplaodRes = await uploadFileToCLoudinary(
        image,
        "transactions"
      );
      if (!imageUplaodRes.success) {
        return {
          success: false,
          msg: imageUplaodRes.msg || "failed to upload receipt",
        };
      }
      transactionData.image = imageUplaodRes.data?.secure_url;
    }

    const transactionRef = id
      ? doc(db, "transactions", id)
      : doc(collection(db, "transactions"));

    const cleanTransactionData = Object.fromEntries(
      Object.entries(transactionData).filter(([_, v]) => v !== undefined)
    );

    await setDoc(transactionRef, cleanTransactionData, { merge: true });

    // await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.log("create/update wallet error: ", error);
    return { success: false, msg: error.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(db, "wallets", walletId);
    const walletSnapShot = await getDoc(walletRef);
    if (!walletSnapShot.exists()) {
      return { success: false, msg: " wallet not found" };
    }
    const walletData = walletSnapShot.data() as WalletType;

    if (type == "expense" && walletData.amount! - amount < 0) {
      return { success: false, msg: "No enough balance" };
    }

    const updateType = type == "income" ? "totalIncome" : "totalExpenses";

    const updatedWalletAmount =
      type == "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type == "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });

    return { success: true };
  } catch (error) {
    console.log("update wallet error: ", error);
    return { success: false, msg: error.message };
  }
};

const revertAndUpdateWallet = async (
  oldTransaction: TransactionType,
  newWalletId: string,
  newTransactionAmount: number,
  newTransactionType: string
) => {
  try {
    // revert old wallet
    const originalWalletRef = doc(db, "wallets", oldTransaction.walletId);
    const originalWalletSnapshot = await getDoc(originalWalletRef);
    const originalWallet = originalWalletSnapshot.data() as WalletType;

    const oldTypeKey =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    const revertAmount =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    await updateDoc(originalWalletRef, {
      amount: Number(originalWallet.amount) + revertAmount,
      [oldTypeKey]:
        Number(originalWallet[oldTypeKey]) - Number(oldTransaction.amount),
    });

    // update new wallet
    const newWalletRef = doc(db, "wallets", newWalletId);
    const newWalletSnapshot = await getDoc(newWalletRef);
    const newWallet = newWalletSnapshot.data() as WalletType;

    if (
      newTransactionType === "expense" &&
      newWallet.amount < newTransactionAmount
    ) {
      return {
        success: false,
        msg: "The selected wallet doesn't have enough balance",
      };
    }

    const newTypeKey =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";

    const deltaAmount =
      newTransactionType === "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    await updateDoc(newWalletRef, {
      amount: Number(newWallet.amount) + deltaAmount,
      [newTypeKey]:
        Number(newWallet[newTypeKey]) + Number(newTransactionAmount),
    });

    return { success: true };
  } catch (error: any) {
    console.log("update wallet error: ", error);
    return { success: false, msg: error.message };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string
): Promise<ResponseType> => {
  try {
    const transactionRef = doc(db, "transactions", transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if (!transactionSnapshot.exists()) {
      return { success: false, msg: "Transaction not found" };
    }

    const transactionData = transactionSnapshot.data() as TransactionType;
    const { type: transactionType, amount: transactionAmount } =
      transactionData;

    const walletRef = doc(db, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists()) {
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    const updateType =
      transactionType === "income" ? "totalIncome" : "totalExpenses";

    // Adjust wallet balance
    const newWalletAmount =
      transactionType === "income"
        ? walletData.amount - transactionAmount
        : walletData.amount + transactionAmount;

    const newIncomeExpenseAmount = walletData[updateType] - transactionAmount;

    if (transactionType === "income" && newWalletAmount < 0) {
      return {
        success: false,
        msg: "You cannot delete this income transaction (negative balance)",
      };
    }

    // ✅ directly update wallet, not via createOrUpdateTransaction
    await updateDoc(walletRef, {
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    // delete the transaction
    await deleteDoc(transactionRef);

    return { success: true, msg: "Transaction deleted successfully" };
  } catch (error: any) {
    console.log("delete wallet error: ", error);
    return { success: false, msg: error.message };
  }
};

export const fetchWeeklyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const firestore = db;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(firestore, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);

    const weeklyData = getLast70Days();

    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date == transactionDate);

      if (dayData) {
        if (transaction.type == "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labeWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: day.expense,
        frontColor: colors.rose,
      },
    ]);
    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.log("error fetching weekly data:  ", error);
    return { success: false, msg: error.message };
  }
};

export const fetchMonthlylyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const firestore = db;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    const transactionQuery = query(
      collection(firestore, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);

    const monthlyData = getLast12Months();

    const transactions: TransactionType[] = [];

    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
      const monthName = transactionDate.toLocaleString("default",{
        month: "short"
      })
      const shortYear = transactionDate.getFullYear().toString().slice(-2)


      const monthData = monthlyData.find((month) => month.month == `${monthName} ${shortYear}`);

      if (monthData) {
        if (transaction.type == "income") {
          monthData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          monthData.expense += transaction.amount;
        }
      }
    });

    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        label: month.month,
        spacing: scale(4),
        labeWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: month.expense,
        frontColor: colors.rose,
      },
    ]);
    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.log("error fetching weekly data:  ", error);
    return { success: false, msg: error.message };
  }
};

export const fetchYearlyStats = async (uid: string): Promise<ResponseType> => {
  try {
    const firestore = db;


    const transactionQuery = query(
      collection(firestore, "transactions"),
      orderBy("date", "desc"),
      where("uid", "==", uid)
    );

    const querySnapshot = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];

    const firstTransaction = querySnapshot.docs.reduce((earliest, doc)=>{
      const transactionDate = doc.data().date.toDate()
      return transactionDate < earliest ? transactionDate : earliest
    }, new Date())


    const firstYear = firstTransaction.getFullYear()
    const currentYear = new Date().getFullYear()

    const yearlyData = getYearRange(firstYear, currentYear)


    querySnapshot.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionYear = (transaction.date as Timestamp)
        .toDate().getFullYear()

      const yearData = yearlyData.find((year: any) => year.year == transactionYear.toString());




      if (yearData) {
        if (transaction.type == "income") {
          yearData.income += transaction.amount;
        } else if (transaction.type == "expense") {
          yearData.expense += transaction.amount;
        }
      }
    });

    const stats = yearlyData.flatMap((year:any) => [
      {
        value: year.income,
        label: year.year,
        spacing: scale(4),
        labeWidth: scale(30),
        frontColor: colors.primary,
      },
      {
        value: year.expense,
        frontColor: colors.rose,
      },
    ]);
    return {
      success: true,
      data: {
        stats,
        transactions,
      },
    };
  } catch (error: any) {
    console.log("error fetching weekly data:  ", error);
    return { success: false, msg: error.message };
  }
};