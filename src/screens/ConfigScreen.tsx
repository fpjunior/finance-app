import React, { useState, useEffect } from "react";
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
import { dbBackup, restoreDataBackup, saveDataBackup } from "../store/storeBackup";
import CardBackup from '../components/CardBackup';
import { orderDateByMoreRecentRecorded } from "../util/orderRecordByDate.util";


type TransactionsScreenProp = NativeStackNavigationProp<
  RootStackParamsList,
  "TransactionsScreen"
>;

type Prop = {
  navigation: TransactionsScreenProp;
};

interface BackupData {
  dataSalvo: string;
  nomeArquivo: string;
  quantidadeRegistros: number;
  isBackup?: number;
  rangeDateBackup: string;
  pathBackup: string;
}

interface RestoreData {
  dataRestore: string;
  nomeArquivoRestore: string;
  quantidadeRegistrosRestore: number;
  isBackup?: number;
  rangeDateRestore: string;
  pathRestore: string;
}

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
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [restoreData, setRestoreData] = useState<RestoreData | null>(null);
  const [pathBackup, setPathBackup] = useState('')
  const [pathRestore, setPathRestore] = useState('')

  useEffect(() => {
    // Retrieve backup data
    dbBackup.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM backup WHERE id = 1',
        [],
        (_, resultSet) => {
          if (resultSet.rows.length > 0) {
            const data = resultSet.rows.item(0);
            setBackupData(data);
          } else {
            // No backup data found
            setBackupData(null);
          }
        },
        (_, error) => {
          console.log('Error fetching backup data:', error);
          return false
        }
      );
    });

    // Retrieve restore data
    dbBackup.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM restore WHERE id = 1',
        [],
        (_, resultSet) => {
          if (resultSet.rows.length > 0) {
            const data = resultSet.rows.item(0);
            setRestoreData(data);
          } else {
            // No restore data found
            setRestoreData(null);
          }
        },
        (_, error) => {
          console.log('Error fetching restore data:', error);
          return false
        }
      );
    });
  }, []);

  const handleRestaurarTabPress = (event: any) => {
    // Função para a tab "Restaurar"
    if (event === "Restaurar") {
      setSelectedTab("Restaurar")
      importData()
      console.log(event)
    } else {
      downloadFromUrl()
      setSelectedTab("Salvar")
      console.log(event)
    }
  };

  const getDateAndFillOriginalDateToISOString = (data: any) => {
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

    data.map((e: any) => {
      const partesData = e.date.split(" ");
      const dia = parseInt(partesData[1]);
      const mes = meses[partesData[2]?.toLowerCase()];
      const ano = parseInt(partesData[3]);
      const dateFormatted = new Date(ano, mes, dia).toISOString();
      e.originalDate = dateFormatted
      return
    })

    return data
  }


  // function orderDateByMoreRecentRecorded(a: any, b: any) {
  //   const dataA: any = new Date(a.originalDate);
  //   const dataB: any = new Date(b.originalDate);
  //   return dataB - dataA; // Ordem decrescente para que os registros mais recentes fiquem no início
  // }


  const downloadFromUrl = async () => {
    let dataModified = data.sort(orderDateByMoreRecentRecorded)
    const dataSalvo = new Date().toLocaleString('pt-br').split("/").join('-').split(' ').join('-');
    const nomeArquivo = 'bkp-finance-app-' + dataSalvo + '.json';
    const jsonData = JSON.stringify(dataModified);

    const quantidadeRegistros = dataModified.length
    const indiceComaBackup = dataModified[0]?.date.indexOf(",");
    const newDateBackup = dataModified[0]?.date.substring(indiceComaBackup + 1);
    const indiceComaBackup2 = dataModified[dataModified.length - 1]?.date.indexOf(",");
    const newDateBackup2 = dataModified[dataModified.length - 1]?.date.substring(indiceComaBackup2 + 1);
    const rangeDateBackup = `De${newDateBackup2} a ${newDateBackup}`

    const result = await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + nomeArquivo,
      jsonData,
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
    console.log(result);
    saveDataBackup(dataSalvo, nomeArquivo, quantidadeRegistros, 1, rangeDateBackup, pathBackup);
    setBackupData({ dataSalvo, nomeArquivo, quantidadeRegistros, isBackup: 1, rangeDateBackup, pathBackup }),
      save(FileSystem.documentDirectory + nomeArquivo, nomeArquivo, "application/json");
  };

  const save = async (uri: any, filename: any, mimetype: any) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            const lastSlashIndex = uri.lastIndexOf("%2F");
            const dotJsonIndex = uri.lastIndexOf(".json");
            const extractedValue = uri.substring(lastSlashIndex + 3, dotJsonIndex);
            setPathBackup(extractedValue)
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
          const dataRestore = new Date().toLocaleString('pt-br').split("/").join('-').split(' ').join('-');
          const response = await fetch(file.uri);
          const fileContent = await response.text();
          const nomeArquivoRestore = file.name
          const importedData = JSON.parse(fileContent);
          const quantidadeRegistrosRestore = importedData.length
          const indiceComaRestore = importedData[0]?.date.indexOf(",");
          const newDateRestore = importedData[0]?.date.substring(indiceComaRestore + 1);
          const indiceComaRestore2 = importedData[importedData.length - 1]?.date.indexOf(",");
          const newDateRestore2 = importedData[importedData.length - 1]?.date.substring(indiceComaRestore2 + 1);
          const rangeDateRestore = `De${newDateRestore2} a ${newDateRestore}`

          updateData(importedData);
          restoreDataBackup(dataRestore, nomeArquivoRestore, quantidadeRegistrosRestore, 0, rangeDateRestore, pathBackup);
          setRestoreData({ dataRestore, nomeArquivoRestore, quantidadeRegistrosRestore, isBackup: 0, rangeDateRestore, pathRestore }),
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
        {/* <Card/> */}
        <CardBackup cardObj={restoreData} />
        <CardBackup cardObj={backupData} />
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