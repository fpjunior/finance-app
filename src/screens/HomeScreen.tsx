import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Text,
  RefreshControl
} from "react-native";
import Card from "../components/Card";
import { Color } from "../constants/theme";
import FloatingButton from "../components/FloatingButton";
import ListItemTransactions from "../components/ListItemTransactions";
import { useStoreTransaction } from "../store/store";
import { SwipeListView } from "react-native-swipe-list-view";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import { useTransactionContext } from "../context/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation/Navigation";
import React, { useState, useEffect } from "react";
import { Transaction } from "../interface/interfaceTransaction";
import { showToast } from "../components/Toast";
import MemoizedMyComponent from "../components/ListItemTransactions";
import { Entypo } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamsList,
  "HomeScreen"
>;

type Prop = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Prop) {
  const { data, deleteTransaction, updateData, filterData } = useStoreTransaction();
  const [filteredData, setFilteredData] = useState<Transaction[]>([]); // Estado para armazenar os dados filtrados
  const [originalData, setOriginalData] = useState<Transaction[]>(data);
  const { handleEditTransaction, isLoading, setIsLoading, order, setOrder } = useTransactionContext();
  const [loading, setLoading] = useState(true);
  const [dateEnd, setDateEnd] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);


  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
    const last30Records = data.slice(0, 30);
    setFilteredData(last30Records);

 
    getEndDateByFilter()
    getStartDateByFilter()
    getTotalIncomeByFilter()
    getTotalExpenseByFilter()

    updateData(data);
    setOriginalData(data);
  }, [loading, data]);

  const getStartDateByFilter = () =>{
    let indiceComa2 = filteredData[0]?.date.indexOf(",");
    let newDate2 = filteredData[0]?.date.substring(indiceComa2 + 1);
    setDateStart(newDate2);
  }

  const getEndDateByFilter = () =>{
    let indiceComa = filteredData[filteredData.length - 1]?.date.indexOf(",");
    let newDate = filteredData[filteredData.length - 1]?.date.substring(indiceComa + 1);
    setDateEnd(newDate);
  }

  const getTotalExpenseByFilter = () => {
    const filterExpenses = filteredData.filter(
      (item) => item.transactionType === "Expenses"
    );
    const totalExpenses = filterExpenses.reduce(
      (accumulador, currentValue) => accumulador + Number(currentValue.money),
      0
    );
    setTotalExpense(totalExpenses)
  }

  const getTotalIncomeByFilter = () => {
    const filterIncome = filteredData.filter((item: any) => item.transactionType === "Income");
    const totalIncome = filterIncome.reduce(
      (accumulador, currentValue) => accumulador + Number(currentValue.money),
      0
    );
    setTotalIncome(totalIncome)
  }

  const handleDeleteTransaction = (description: string, id: string) => {
    Alert.alert("Tem certeza que deseja deletar?", `${description}`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "OK", onPress: () => {
          deleteTransaction(id)
          setIsLoading(true)
        }
      },
    ]);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await updateData(data);
      showToast('Lista Atualizada');
    } catch (error) {
      console.log('Erro ao atualizar os dados:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>

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
        useFlatList={true}
        data={filteredData}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Card dateStart={dateStart}
              dateEnd={dateEnd}
              totalIncomeFiltered={totalIncome}
              totalExpenseFiltered={totalExpense}
              titleList="Últimos 30 registros"
              navigation={navigation} />
            <View style={styles.headerList}>
              <View style={styles.leftComponent}>
                <Text style={styles.titleList}>Últimos 30 registros</Text>
              </View>
              <View style={styles.rightComponent}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.order}
                  onPress={() => { navigation?.navigate("SearchItemScreen") }}
                >
                  <Text style={styles.verMaisText}>MOSTRAR MAIS</Text>
                  <Entypo name="dots-three-vertical" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => {
          return <MemoizedMyComponent item={item} />;
        }}
        renderHiddenItem={({ item }, rowMap) => (

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
              onPress={() => handleDeleteTransaction(item.description, item.id)}
            >
              <AntDesign name="delete" size={16} color={Color.expense} />
            </TouchableOpacity>
          </View>
        )}
        previewRowKey={data[0]?.id}
        rightOpenValue={-120}
        disableRightSwipe
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      />
      <FloatingButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  verMaisText: {
    marginLeft: 1, // Espaço entre o ícone e o texto
    padding: 1, // Adicione algum espaço de toque ao redor do texto
    color: "#355296",//
    fontSize: 18,
    textTransform: "capitalize",
    fontWeight: "bold",
  },
  titleList: {
    fontSize: 17,
    paddingHorizontal: 24,
    marginTop: 20,
    fontWeight: "bold",
    letterSpacing: 0.4,
    marginBottom: 15,
    color: Color.fontColorPrimary,
    textTransform: "capitalize",
  },
  headerList: {
    flexDirection: "row", // Isso alinha os componentes lado a lado
    justifyContent: "space-between", // Isso distribui o espaço entre os componentes
    alignItems: "center",
  },
  leftComponent: {
    flex: 1, // Para ocupar o espaço disponível e colar na extremidade esquerda
  },
  centerComponents: {
    flexDirection: 'row', // Componentes centro alinhados lado a lado
  },
  rightComponent: {
    flex: 1, // Para ocupar o espaço disponível e colar na extremidade direita
    alignItems: 'flex-end', // Para alinhar conteúdo à direita
  },
  container: {
    backgroundColor: Color.primary,
    flex: 1,
    paddingTop: 40,
  },
  order: {
    marginHorizontal: 30,
    flexDirection: "row", // Isso alinha o ícone e o texto lado a lado
    alignItems: "center",
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
  mes: {
    backgroundColor: "#b3b3b33b",
    height: 30,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 7,
    elevation: 12,
  },
});
