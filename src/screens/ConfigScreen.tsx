import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Color } from "../constants/theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation/Navigation";
import { LinearGradient } from "expo-linear-gradient";
import Card from "../components/Card";
import { useTransactionContext } from "../context/AppContext";
import { useStoreTransaction } from "../store/store";


import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';


type TransactionsScreenProp = NativeStackNavigationProp<
  RootStackParamsList,
  "TransactionsScreen"
>;

type Prop = {
  navigation: TransactionsScreenProp;
};

const tabs = [
  {
    name: "Salvar Backup",
    type: "Salvar",
  },
  {
    name: "Restaurar",
    type: "Restaurar",
  },
];

export default function TransactionsScreen({ navigation }: Prop) {
  const [selectedTab, setSelectedTab] = useState("Salvar");
  const { data, updateData } = useStoreTransaction();
  
  const handleRestaurarTabPress = (event: any) => {
    // Função para a tab "Restaurar"
    if(event === "Restaurar") {
      setSelectedTab("Restaurar")
      importData()
      console.log(event)
    } else {
      downloadFromUrl()
      setSelectedTab("Salvar")
      console.log(event)
    }
  };

  const downloadFromUrl = async () => {
    const dataAtual = new Date().toLocaleString('pt-br').split("/").join('-').split(' ').join('-');
    const filename = 'bkp-finance-app-' + dataAtual + '.json';
    const jsonData = JSON.stringify(data);

    const result = await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + filename,
      jsonData,
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
    console.log(result);
    save(FileSystem.documentDirectory + filename, filename, "application/json");
  };

  const save = async (uri: any, filename: any, mimetype: any) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
          })
          .catch(e => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };

  const importData = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync();

      if (file.type === 'success' && file.uri) {
        const fileExtension = file.name.split('.').pop();

        if (fileExtension === 'json') {
          const response = await fetch(file.uri);
          const fileContent = await response.text();

          const importedData = JSON.parse(fileContent);

          updateData(importedData);

          console.log(importedData);
          {
            console.log('O arquivo selecionado não é legível');
          }
        } else {
          console.log('Formato de arquivo inválido. Por favor, selecione um arquivo JSON.');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.wrapIcon}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back-circle-sharp"
              size={20}
              color={Color.icon}
            />
          </TouchableOpacity>
          <Text style={styles.titleHeader}>Backup/Restore</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.wrapIcon} activeOpacity={0.8}>
            <Ionicons name="search" size={16} color={Color.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.wrapIcon} activeOpacity={0.8}>
            <Ionicons name="ellipsis-vertical" size={16} color={Color.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card/>
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
        {/* {selectedTab === "Salvar" ? (
          <IncomeListTransactions />
        ) : (
          <ExpensesListTransactions />
        )} */}
      </ScrollView>
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
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerRight: {
    flexDirection: "row",
    gap: 14,
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
  titleHeader: {
    fontWeight: "bold",
    letterSpacing: 0.4,
    fontSize: 16,
    color: Color.fontColorPrimary,
    textTransform: "capitalize",
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
});
