import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Color } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useStoreTransaction } from "../store/store";
import { Transaction } from "../interface/interfaceTransaction";
import ListItemTransactions from "../components/ListItemTransactions";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation/Navigation";
import { useTransactionContext } from "../context/AppContext";
import { formatQuantity } from "../helpers";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type TransactionsScreenProp = NativeStackNavigationProp<
  RootStackParamsList,
  "SearchScreen"
>;

type Prop = {
  navigation: TransactionsScreenProp;
};

export default function SearchScreen() {
  const [textInput, setTextInput] = useState("");
  const [newData, setNewData] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [endDate, setEndDate2] = useState('');
  const [startDate, setStartDate] = useState('');
  const { data } = useStoreTransaction();
  const { eyeShow, setEyeShow } = useTransactionContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (textInput.length === 0) {
    //   setNewData([]);
    //   return;
    // }
    setTimeout(() => setLoading(false), 500);
    const handleSearch = () => {
      const listResult = data.filter((item) =>
        item.description.toLowerCase().includes(textInput.toLowerCase())
      );
      setNewData(listResult);

      const filterIncome = listResult.filter((item: any) => item.transactionType === "Income");
      const filterExpense = listResult.filter((item: any) => item.transactionType === "Expenses");
      const totalExpenseDynamic = filterExpense.reduce(
        (accumulador, currentValue) => accumulador + Number(currentValue.money),
        0
      );
      const totalIncomeDynamic = filterIncome.reduce(
        (accumulador, currentValue) => accumulador + Number(currentValue.money),
        0
      );
      
      setTotalIncome(totalIncomeDynamic)
      setTotalExpense(totalExpenseDynamic)

      let indiceComa2 = listResult[listResult.length - 1]?.date.indexOf(",");
      let indiceComa = listResult[0]?.date.indexOf(",");
      let endDate = listResult[listResult.length - 1]?.date.substring(indiceComa2 + 1);
      let startDate = listResult[0]?.date.substring(indiceComa + 1);
      setEndDate2(endDate)
      setStartDate(startDate)
    };

    handleSearch();
  }, [textInput, loading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {newData.length > 0 ? (
          <>
             <LinearGradient
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1.2 }}
        colors={["#4f80c3", "#c661eb", "#ee8183"]}
        style={styles.container}
      >
        {data.length > 0 ? (
          <Text style={styles.dates}>
            {endDate} - {startDate}
          </Text>
        ) : (
          <Text style={styles.dataEmpty}>No hay Ingresos ni Gastos</Text>
        )}
        <TouchableOpacity
          onPress={() => setEyeShow(!eyeShow)}
          activeOpacity={1}
          style={styles.containerTotal}
        >
          {/* <Text style={styles.total}>
            {eyeShow ? formatQuantity(total) : "******"}
          </Text> */}
          <Ionicons
            name={eyeShow ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.containerFooter}>
          <View style={styles.wrapContentLeftEndRight}>
            <View style={[styles.wrapArrow]}>
              <AntDesign name="arrowup" size={15} color={Color.income} />
            </View>
            <View>
              <Text style={styles.title}>Entradas</Text>
              <Text style={styles.money}>
                {eyeShow ? formatQuantity(totalIncome) : "******"}
              </Text>
            </View>
          </View>
          <View style={styles.wrapContentLeftEndRight}>
            <View style={[styles.wrapArrow]}>
              <AntDesign name="arrowdown" size={15} color={Color.expense} />
            </View>
            <View>
              <Text style={styles.title}>Saídas</Text>
              <Text style={styles.money}>
                {eyeShow ? formatQuantity(totalExpense) : "******"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
          </>
        ) : (
          <View style={styles.dataEmpty}>
            <Text style={styles.titleDataEmpty}>Sem nenhuma entrada</Text>
          </View>
        )}
      </View>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerInput}>
          <TextInput
            style={styles.input}
            placeholder="Buscar uma entrada ou saída..."
            onChangeText={(text) => setTextInput(text)}
            value={textInput}
          />
          <Ionicons
            name="search"
            size={18}
            color={Color.icon}
            style={styles.iconSearch}
          />
        </View>
        {newData.map((item, index) => (
          <ListItemTransactions key={index} item={item} />
        ))}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dates: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    textTransform: "capitalize",
    fontSize: 14,
  },

  titleDataEmpty: {
    fontWeight: "bold",
    letterSpacing: 0.4,
    color: Color.fontColorPrimary,
    fontSize: 20,
  },
  // card: {
  //   backgroundColor: "#cccccc",
  //   marginHorizontal: 24,
  //   marginTop: 0,
  //   borderRadius: 10,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   height: 160,
  //   marginBottom: 5,
  // },
  date: {
    fontSize: 19,
    color: Color.fontColorPrimary,
    opacity: 0.8,
    marginBottom: 8,
    textTransform: "capitalize",
  },

  container: {
    backgroundColor: Color.primary,
    flex: 1,
    paddingTop: 10,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 12
  },
  containerInput: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.icon,
    marginBottom: 20,
  },
  input: {
    height: 40,
    paddingHorizontal: 35,
  },
  containerHeader: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  iconSearch: {
    position: "absolute",
    top: 11,
    left: 10,
  },
  wrapIcon: {
    backgroundColor: "#fff",
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    elevation: 12,
  },

  dataEmpty: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
  containerTotal: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  // total: {
  //   color: "#fff",
  //   fontWeight: "bold",
  //   fontSize: 30,
  //   textAlign: "center",
  // },
  containerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 14,
    paddingHorizontal: 17,
  },
  wrapContentLeftEndRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrapArrow: {
    width: 26,
    height: 26,
    backgroundColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26 / 2,
    marginRight: 14,
  },
  title: {
    color: "#fff",
    fontSize: 12,
  },
  money: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // titleList: {
  //   fontSize: 17,
  //   paddingHorizontal: 24,
  //   marginTop: 20,
  //   fontWeight: "bold",
  //   letterSpacing: 0.4,
  //   marginBottom: 15,
  //   color: Color.fontColorPrimary,
  //   textTransform: "capitalize",
  // },
});
