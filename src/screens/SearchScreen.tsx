import React, { useCallback, useEffect, useState } from "react";
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { orderDateByMoreOldRecorded, orderDateByMoreRecentRecorded } from "../util/orderRecordByDate.util";
import RNDateTimePicker from '@react-native-community/datetimepicker';

type TransactionsScreenProp = NativeStackNavigationProp<
  RootStackParamsList,
  "SearchScreen"
>;

type Prop = {
  navigation: TransactionsScreenProp;
};

export default function SearchScreen() {
  const [textInput, setTextInput] = useState("");
  const [displayeData, setdisplayeData] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [endDate, setEndDate2] = useState('');
  const [startDate, setStartDate] = useState('');
  const { data } = useStoreTransaction();
  const { eyeShow, setEyeShow, order, setOrder } = useTransactionContext();
  const [loading, setLoading] = useState(true);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateAux, setDateAux] = useState("");

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
    const handleSearch = () => {
      const listResult = data.filter((item) =>
        item.description.toLowerCase().includes(textInput.toLowerCase())
      );
      const last30Records = listResult.slice(0, 30);

      setdisplayeData(last30Records);
      genericFunction(listResult)

    };

    handleSearch();
  }, [textInput, loading]);

  const genericFunction = (listResult: any) => {
    const filterIncome = listResult.filter((item: any) => item.transactionType === "Income");
    const filterExpense = listResult.filter((item: any) => item.transactionType === "Expenses");
    const totalExpenseDynamic = filterExpense.reduce(
      (accumulador: any, currentValue: any) => accumulador + Number(currentValue.money),
      0
    );
    const totalIncomeDynamic = filterIncome.reduce(
      (accumulador: any, currentValue: any) => accumulador + Number(currentValue.money),
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
  }

  const convertDate = (dataString: any, action: string) => {
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

    const partesData = dataString.split(" ");
    const dia = parseInt(partesData[1]);
    const mes = meses[partesData[2]?.toLowerCase()];
    const ano = parseInt(partesData[3]);

    const date = new Date(ano, mes, dia);
    if (action == 'mes') {
      return mes;
    } if (action == 'data') {
      return date
    }
  }

  const filterByMonth = () => {
    const mesAtual = new Date().getMonth();
    const listResult = data.filter((e: Transaction) => {
      const mesRegistro = convertDate(e.date, 'mes');
      return mesRegistro === mesAtual;
    });

    setdisplayeData(listResult)
    genericFunction(listResult)
  };

  const resetFilter = () => {
    setdisplayeData(data)
  };

  const filterByExpenses = () => {
    const filteredExpenses = data.filter((e: Transaction) => e.transactionType === 'Expenses');
    setdisplayeData(filteredExpenses);
    genericFunction(filteredExpenses)
  };

  const filterByIncomes = () => {
    const filteredIncomes = data.filter((e: Transaction) => e.transactionType === 'Income');
    setdisplayeData(filteredIncomes);
    genericFunction(filteredIncomes)
  };

  const getWeekNumber = (dateString: any) => {
    const date: any = new Date(dateString);
    date.setHours(0, 0, 0, 0); // Define as horas, minutos, segundos e milissegundos para zero

    const dayOfWeek = date.getDay(); // 0 (Domingo) a 6 (Sábado)

    const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = Math.floor((date - firstDayOfYear) / 86400000); // Milissegundos em um dia: 24 * 60 * 60 * 1000 = 86400000

    let weekNumber;

    if (dayOfWeek === 0) {
      // Se for um Domingo, atribua à semana anterior
      weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7) - 1;
    } else {
      weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    return weekNumber;
  };


  const filterByWeek = () => {
    const semanaAtual = getWeekNumber(new Date().toString());
    const filterData = data.filter((registro) => {
      const semanaRegistro = getWeekNumber(convertDate(registro.date, 'data'));
      return semanaRegistro === semanaAtual;
    });
    setdisplayeData(filterData)
    genericFunction(filterData)

  }

  const orderByRecent2 = () => {

    setOrder(!order)
    let filterData;
    let mensage;
    if (order) {
      mensage = 'Ordenado por data mais recente'
      filterData = displayeData.sort(orderDateByMoreRecentRecorded)
    } else {
      mensage = 'Ordenado por data mais antiga'
      filterData = displayeData.sort(orderDateByMoreOldRecorded)
    }
    setdisplayeData(filterData)
  }

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const closeDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  const handleDateChange = useCallback((date: any) => {
    closeDatePicker();
    setSelectedDate(date);
    setDateAux(date.toLocaleDateString('pt-BR'));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>

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


      </View>
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerHeader2}>
        <TouchableOpacity
            style={styles.mes}
            activeOpacity={0.8}
            onPress={openDatePicker}
          >
            <Text>Período</Text>
          </TouchableOpacity>

          <View>
            
                {isDatePickerOpen && (
                  <RNDateTimePicker
                  display="spinner"
                    mode="date"
                    value={selectedDate || new Date()}
                    onChange={(event, date: any) => {
                      // setDateAux(date.toLocaleDateString('pt-BR'))
                      handleDateChange(date);
                    }}
                  />
                )}
              </View>

          <TouchableOpacity
            style={styles.mes}
            activeOpacity={0.8}
            onPress={() => filterByExpenses()}
          >
            <Text>Despesas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mes}
            activeOpacity={0.8}
            onPress={() => filterByIncomes()}
          >
            <Text>Receitas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mes}
            activeOpacity={0.8}
            onPress={() => resetFilter()}
          >
            <Text>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mes}
            activeOpacity={0.8}
            onPress={() => filterByMonth()}
          >
            <Text>Mês</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mes}
            activeOpacity={0.8}
            onPress={() => filterByWeek()}
          >
            <Text>Semana</Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.centeredView}>

          {textInput !== '' && (
            <Text style={styles.textSmall}>
              Exibindo {displayeData.length} registros com '{textInput}' de {endDate} a {startDate}
            </Text>
          )}
        </View>
        <View style={styles.centerComponents}>
  <Text style={styles.titleDataEmpty2}>Histórico</Text>

  <View style={styles.row}>
    <View style={{ width: 16 }} />

    <TouchableOpacity
      activeOpacity={1}
      style={styles.order}
      onPress={() => orderByRecent2()}
    >
      <MaterialCommunityIcons name={order ? "sort-calendar-descending" : "sort-calendar-ascending"} size={24} color="black" />
    </TouchableOpacity>
  </View>
</View>


        {
          displayeData.length > 0 ? (
            displayeData.map((item, index) => (
              <ListItemTransactions key={index} item={item} />
            ))
          ) : (
            <View style={styles.dataEmpty}>
              <Text style={styles.titleDataEmpty}>Sem nenhuma entrada</Text>
            </View>
          )
        }


      </KeyboardAwareScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  order: {
    marginHorizontal: 30,
  },
  centerComponents: {
    flexDirection: 'row', // Componentes centro alinhados lado a lado
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerHeader2: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 14,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  titleDataEmpty2: {
    fontWeight: "bold",
    color: Color.fontColorPrimary,
    fontSize: 15,
    paddingLeft: 25
  },
  textSmall: {
    color: 'navy', 
    fontStyle: 'italic',
    fontSize: 12,
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
    paddingTop: 3,
    marginLeft: 8,
    marginRight: 8,
    borderRadius: 12
  },
  containerInput: {
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.icon,
    marginBottom: 10,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
