import { View, Text, StyleSheet } from "react-native";
import { Color } from "../constants/theme";
import { Transaction } from "../interface/interfaceTransaction";
import { formatQuantity } from "../helpers";
import { DateTime } from "luxon";
import React, { memo } from 'react';

type Prop = {
  item: Transaction;
};

const ListItemTransactions = ({ item }: Prop) => {
  const { description, money, transactionType, date } = item;
  // const dateTime = DateTime.fromJSDate(new Date(item.date));
  // item.date = dateTime.setLocale("pt-BR").toFormat("cccc, d LLL y");

  // const expensesForMonth = item.date === new Date().toISOString();

  return (
    <View style={styles.container}>
      <View style={styles.containerItem}>
        <View style={styles.wrapItemLeft}>
          <View
            style={[
              styles.circleItem,
              {
                backgroundColor:
                  transactionType === "Income" ? Color.income : Color.expense,
              },
            ]}
          >
            <Text style={styles.textCircle}>{description.charAt(0)}</Text>
          </View>
          <View style={styles.wrapTitleEndDate}>
            <Text numberOfLines={1} style={styles.title}>
              {description}
            </Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <View>
          <Text
            style={[
              styles.money,
              {
                color:
                  transactionType === "Income" ? Color.income : Color.expense,
              },
            ]}
          >
            {transactionType === "Income" ? "+" : "-"}
            {formatQuantity(Number(money))}
          </Text>
        </View>
      </View>
    </View>
  );

}
const MemoizedMyComponent = memo(ListItemTransactions);

export default MemoizedMyComponent;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  containerItem: {
    backgroundColor: "#fff",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  circleItem: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapItemLeft: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  textCircle: {
    textTransform: "uppercase",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 20,
  },
  wrapTitleEndDate: {
    flex: 1,
    height: 40,
  },
  title: {
    color: "#000",
    fontWeight: "500",
    letterSpacing: 0.4,
    fontSize: 15,
    textTransform: "capitalize",
  },
  date: {
    color: Color.fontColorPrimary,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.4,
    opacity: 0.8,
    textTransform: "capitalize",
  },
  money: {
    fontWeight: "bold",
    fontSize: 15,
  },
});
