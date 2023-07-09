import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Text
} from "react-native";
import Card from "../components/Card";
import { Color } from "../constants/theme";
import FloatingButton from "../components/FloatingButton";
import ListItemTransactions from "../components/ListItemTransactions";
import { db, useStoreTransaction } from "../store/store";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { useTransactionContext } from "../context/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation/Navigation";
import React, { useState, useEffect } from "react";
import { Transaction } from "../interface/interfaceTransaction";
import * as SQLite from 'expo-sqlite';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamsList,
  "HomeScreen"
>;

type Prop = {
  navigation: HomeScreenNavigationProp;
  atualizarOriginalData: Transaction[];
};

export default function HomeScreen({ navigation, atualizarOriginalData }: Prop) {
  const { data, deleteTransaction, updateData, deleteAllTransactions } = useStoreTransaction();
  const { handleEditTransaction } = useTransactionContext();
  const [importedData, setImportedData] = useState<Transaction[]>([])
  const [originalData, setOriginalData] = useState<Transaction[]>([])
  // const db = SQLite.openDatabase("mydatabase.db");


  const handleDeleteTransaction = (description: string, id: string) => {
    Alert.alert("Tem certeza que deseja deletar2?", `${description}`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteTransaction(id) },
    ]);
  };

  useEffect(() => {
    // deleteAllTransactions()
    selectAllRecord()
  }, []);

  const selectAllRecord = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM transactions",
        [],
        (_, { rows }) => {
          const data: Transaction[] = [];

          for (let i = 0; i < rows.length; i++) {
            const item = rows.item(i);
            data.push({
              id: item.id,
              money: item.money,
              description: item.description,
              date: item.date,
              transactionType: item.transactionType,
              currentMonth: item.currentMonth,
            });
          }
          setOriginalData(data)
          updateData(data);
        },
        (_, error) => {
          console.log("Error retrieving transactions:", error);
          return false
        }
      );
    });
  }

  const filterByExpenses = () => {
    const d = data.filter((e: any) => {
      return e.transactionType === 'Expenses'
    })
    updateData(d)
  }

  const filterByIncome = () => {
    const d = data.filter((e: any) => {
      return e.transactionType === 'Income'
    })
    updateData(d)
  }

  const convertDate = (dataString: any, action: string) => {
    var diasSemana = {
      "Domingo": 0,
      "Segunda-feira": 1,
      "Terça-feira": 2,
      "Quarta-feira": 3,
      "Quinta-feira": 4,
      "Sexta-feira": 5,
      "Sábado": 6
    };

    var meses: any = {
      "jan.": 0,
      "fev.": 1,
      "mar.": 2,
      "abr.": 3,
      "mai.": 4,
      "jun.": 5,
      "jul.": 6,
      "ago.": 7,
      "set.": 8,
      "out.": 9,
      "nov.": 10,
      "dez.": 11
    };

    var partesData = dataString.split(" ");
    var diaSemana = partesData[0];
    var dia = parseInt(partesData[1]);
    var mes = meses[partesData[2]?.toLowerCase()];
    var ano = parseInt(partesData[3]);

    var data = new Date(ano, mes, dia);
    if (action == 'mes') {
      return mes;
    } if (action == 'data') {
      return data
    }
  }

  const getWeekNumber = (dateString: any) => {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (Number(date) - Number(firstDayOfYear)) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()+ 1) / 7);
    return weekNumber;
  };

  const filterByWeek = () => {
    const semanaAtual = getWeekNumber(new Date().toString());
    const filterData = originalData.filter((registro) => {
      const semanaRegistro = getWeekNumber(convertDate(registro.date, 'data'));
      return semanaRegistro === semanaAtual;
    });
    updateData(filterData)
  }

  const filterByMonth = () => {
    const mesAtual = new Date().getMonth(); // O valor retornado varia de 0 a 11 (0 para janeiro, 1 para fevereiro, etc.)
    const filterData = originalData.filter((e: any) => {
      const mesRegistro = convertDate(e.date, 'mes');

      return mesRegistro === mesAtual;
    })
    updateData(filterData)
  }

  const dia = () => {
    const dataAtual = new Date() // O valor retornado varia de 0 a 11 (0 para janeiro, 1 para fevereiro, etc.)
    const filterData = data.filter((e: any) => {
      const dataRegistro = convertDate(e.date, 'data');
      return dataRegistro.toString().split(' ').slice(0, 4).join(' ') === dataAtual.toString().split(' ').slice(0, 4).join(' ');
    })
    updateData(filterData)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity
          style={styles.mes}
          activeOpacity={0.8}
          onPress={() => dia()}
        >
          <Text>Dia</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mes}
          activeOpacity={0.8}
          onPress={() => filterByWeek()}
        >
          <Text>Semanal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mes}
          activeOpacity={0.8}
          onPress={() => filterByMonth()}
        >
          <Text>Mensal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mes}
          activeOpacity={0.8}
          onPress={() => updateData(originalData)}
        >
          <Text>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wrapIcon}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("TransactionsScreen")}
        >
          <Ionicons name="ios-swap-horizontal" size={18} color={Color.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wrapIcon}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("StatisticsScreen")}
        >
          <Ionicons name="stats-chart-outline" size={15} color={Color.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.wrapIcon} activeOpacity={0.8}
          onPress={() => navigation.navigate("ConfigScreen")}>
          <Ionicons name="settings" size={15} color={Color.icon} />
        </TouchableOpacity>
      </View>
      <SwipeListView
        data={importedData.length > 0 ? importedData : data}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Card titleList="transferências" />}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => {
          return <ListItemTransactions item={item} />;
        }}
        renderHiddenItem={({ item }) => {
          return (
            <View style={styles.hiddenItem}>
              <TouchableOpacity
                style={styles.iconHiddenContainer}
                activeOpacity={0.8}
                onPress={() => handleEditTransaction(item.id)}
              >
                <Feather name="edit" size={18} color="#19A7CE" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconHiddenContainer}
                activeOpacity={0.8}
                onPress={() =>
                  handleDeleteTransaction(item.description, item.id)
                }
              >
                <AntDesign name="delete" size={18} color={Color.expense} />
              </TouchableOpacity>
            </View>
          );
        }}
        rightOpenValue={-120}
        disableRightSwipe
      />
      <FloatingButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.primary,
    flex: 1,
    paddingTop: 40,
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
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
  mes: {
    backgroundColor: "#b3b3b33b",
    height: 30,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    elevation: 12,
  },
  hiddenItem: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 24,
    gap: 10,
    height: 60,
  },
  iconHiddenContainer: {
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 10,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
});
