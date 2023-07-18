import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Color } from "../constants/theme";
import { Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CheckBoxForm from "./CheckBoxForm";
import { useStoreTransaction } from "../store/store";
import { currentMonth, getCurrentTimestamp } from "../helpers";
import { useTransactionContext } from "../context/AppContext";
import { useValidate } from "../helpers/validateForm";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { DateTime } from "luxon";

export default function ModalForm() {
  const [sent, setSent] = useState(false);
  const { addTransaction, updateTransaction } = useStoreTransaction();
  const { itemId, objectToEdit, modalVisible, closeModal } =
    useTransactionContext();
  const [checkSelected, setCheckSelected] = useState("");
  const [inputValue, setInputValue] = useState({
    money: "",
    description: "",
    date: "",
  });
  const moneyValue = inputValue.money.replace(/[^0-9.]/g, "");
  const errors = useValidate(inputValue, checkSelected);
  const handleChange = (valueName: string, textValue: string) => {
    setInputValue({ ...inputValue, [valueName]: textValue });
  };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Expenses");

  const tabs = [
    {
      name: "Entrada",
      type: "Income",
    },
    {
      name: "Saída",
      type: "Expenses",
    },
  ];

  const handleRestaurarTabPress = (event: any) => {
    // Função para a tab "Restaurar"
    if (event === "Income") {
      setSelectedTab("Income")
      setCheckSelected("Income");
      console.log(event)
    } else {
      setSelectedTab("Expenses")
      setCheckSelected("Expenses");
      console.log(event)
    }
  };

  const handleDateChange = (date: any) => {
    closeDatePicker();
    setSelectedDate(date);
  };

  const openDatePicker = () => {
    setIsDatePickerOpen(true);
  };

  const closeDatePicker = () => {
    setIsDatePickerOpen(false);
  };

  useEffect(() => {
    if (objectToEdit !== null) {
      setInputValue({
        money: objectToEdit.money,
        description: objectToEdit.description,
        date: objectToEdit.date,
      });
      setCheckSelected(objectToEdit.transactionType);
      setSelectedTab(objectToEdit.transactionType)
    }
    if (!modalVisible) {
      setInputValue({ money: "", description: "", date: "" });
      setSelectedTab("Income")
      setCheckSelected("Income");
      setSent(false);
    }
  }, [modalVisible, selectedDate]);

  const handleSubmit = () => {
    setSent(true);

    if (
      !inputValue.description ||
      !inputValue.money ||
      !checkSelected ||
      inputValue.money !== moneyValue
    )
      return;

    const dateTime = DateTime.fromJSDate(selectedDate);
    const formattedDate2 = dateTime.setLocale("pt-BR").toFormat("cccc, d LLL y");
    if (objectToEdit !== null) {

      updateTransaction({ ...inputValue, date: new Date(selectedDate).toISOString() }, itemId, checkSelected);
    } else {
      addTransaction(
        { ...inputValue, date: new Date(selectedDate).toISOString() },
        checkSelected,
        getCurrentTimestamp(),
        formattedDate2,
        currentMonth,
      );
    }

    setInputValue({ money: "", description: "", date: "", });
    setCheckSelected("");
    closeModal();
  };

  const handleCheckBox = (value: string) => {
    console.log(value)
    setCheckSelected(value);
  };

  return (
    <Modal visible={modalVisible} animationType="slide">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <View style={styles.closeModal}>
            <Entypo
              name="cross"
              size={30}
              color={Color.icon}
              onPress={closeModal}
            />
          </View>
          <View style={styles.containerContent}>
            <View>
              <Text style={styles.title}>
                {objectToEdit !== null
                  ? "Editar Movimentação"
                  : "Adicionar Movimentação"}
              </Text>
              <View>
                <TextInput
                  style={styles.inputAmountMoney}
                  placeholder="R$10.000.00"
                  selectionColor="#4f80c3"
                  keyboardType="numeric"
                  value={inputValue.money}
                  onChangeText={(textValue) => handleChange("money", textValue)}
                />
                {sent && <Text style={styles.errorMoney}>{errors.money}</Text>}
              </View>
              <View>
                <TouchableOpacity onPress={openDatePicker}>
                  <TextInput
                    style={styles.inputAmountMoney}
                    placeholder="Selecionar Data"
                    value={selectedDate ? selectedDate.toLocaleString() : ''}
                    editable={false}
                    onChangeText={(textValue) => handleChange("date", textValue)}
                  />
                </TouchableOpacity>
                {isDatePickerOpen && (
                  <RNDateTimePicker
                    mode="date"
                    value={selectedDate || new Date()}
                    onChange={(event, date: any) => {
                      handleDateChange(date);
                    }}
                  />
                )}
              </View>
              <View>
                <View>
                  <TextInput
                    style={styles.input}
                    placeholder="Combustível, Almoço..."
                    selectionColor="#4f80c3"
                    value={inputValue.description}
                    onChangeText={(textValue) =>
                      handleChange("description", textValue)
                    }
                  />
                  <Entypo
                    name="list"
                    size={18}
                    color={Color.icon}
                    style={styles.iconListInput}
                  />
                </View>
                {sent && (
                  <Text style={styles.errorDescription}>
                    {errors.description}
                  </Text>
                )}
              </View>
              {/* <View>
                <CheckBoxForm
                  handleCheckBox={handleCheckBox}
                  checkSelected={checkSelected}
                />
                {sent && <Text style={styles.errorCheck}>{errors.check}</Text>}
              </View> */}
                <View style={styles.containerTab}>
                  {tabs.map((item) => {
                    return (
                      <LinearGradient
                        key={item.name}
                        start={{ x: 0.1, y: 0 }}
                        end={{ x: 1, y: 1.2 }}
                        colors={[
                          item.type === selectedTab ? "#4f80c3" : "#fff",
                          item.type === selectedTab ? "#c661eb" : "#fff",
                          item.type === selectedTab ? "#ee8183" : "#fff",
                        ]}
                        style={styles.tabGradient}
                      >
                        <TouchableOpacity
                          activeOpacity={1}
                          style={styles.wrapTab}
                          onPress={() => handleRestaurarTabPress(item.type)}
                        >
                          <Text
                            style={[
                              styles.titleTab,
                              {
                                color:
                                  item.type === selectedTab
                                    ? "#fff"
                                    : Color.fontColorPrimary,
                              },
                            ]}
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    );
                  })}
                </View>
                {sent && <Text style={styles.errorCheck}>{errors.check}</Text>}
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={handleSubmit}>
              <LinearGradient
                start={{ x: 0.1, y: 0 }}
                end={{ x: 1, y: 1.2 }}
                colors={["#4f80c3", "#c661eb", "#ee8183"]}
                style={styles.button}
              >
                <Text style={styles.titleButton}>Salvar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapTab: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tabGradient: {
    flex: 1,
    borderRadius: 10,
    margin: 3,
  },
  titleTab: {
    fontWeight: "bold",
    letterSpacing: 0.4,
    fontSize: 13,
    lineHeight: 15,
  },
  containerTab: {
    backgroundColor: "#fff",
    marginTop: 20,
    marginHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: Color.primary,
  },
  closeModal: {
    paddingHorizontal: 24,
    alignItems: "flex-end",
    paddingTop: 10,
    marginBottom: 50,
  },
  containerContent: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0.5,
    marginBottom: 20,
    textAlign: "center",
    color: Color.fontColorPrimary,
    opacity: 0.8,
  },
  inputAmountMoney: {
    height: 40,
    backgroundColor: "#fff",
    width: "70%",
    marginBottom: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#fff",
    height: 40,
    marginBottom: 22,
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 20,
  },
  iconListInput: {
    position: "absolute",
    top: 12,
    left: 8,
  },
  button: {
    height: 40,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  titleButton: {
    textTransform: "capitalize",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.4,
  },
  errorMoney: {
    position: "absolute",
    bottom: 22,
    fontSize: 12,
    width: "70%",
    alignSelf: "center",
    fontStyle: "italic",
    color: Color.expense,
  },
  errorDescription: {
    position: "absolute",
    bottom: 7,
    fontSize: 12,
    fontStyle: "italic",
    color: Color.expense,
  },
  errorCheck: {
    position: "absolute",
    bottom: 0,
    fontSize: 12,
    fontStyle: "italic",
    color: Color.expense,
  },
});