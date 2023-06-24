import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Button, Platform
} from "react-native";
import Card from "../components/Card";
import { Color } from "../constants/theme";
import FloatingButton from "../components/FloatingButton";
import ListItemTransactions from "../components/ListItemTransactions";
import { backupData, useStoreTransaction } from "../store/store";
import { SwipeListView } from "react-native-swipe-list-view";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useTransactionContext } from "../context/AppContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../navigation/Navigation";
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamsList,
  "HomeScreen"
>;

type Prop = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Prop) {
  const { data, deleteTransaction } = useStoreTransaction();
  const { handleEditTransaction } = useTransactionContext();

  const handleDeleteTransaction = (description: string, id: string) => {
    Alert.alert("Tem certeza que deseja deletar?", `${description}`, [
      {
        text: "Cancelar",
        style: "cancel",
      },
      { text: "OK", onPress: () => deleteTransaction(id) },
    ]);
  };

  const downloadFromUrl = async () => {
    const filename = "data.json";
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
          const cacheDirectory = FileSystem.cacheDirectory || FileSystem.documentDirectory; // Use documentDirectory se cacheDirectory não estiver disponível
          const cacheFilePath = cacheDirectory + 'uploads/' + file.name;
          await FileSystem.copyAsync({ from: file.uri, to: cacheFilePath });
  
          const fileContent = await FileSystem.readAsStringAsync(cacheFilePath);
          const importedData = JSON.parse(fileContent);
  
          // Aqui você pode atualizar o estado ou fazer qualquer outra manipulação dos dados importados
  
          console.log(importedData);
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
        <TouchableOpacity
          style={styles.wrapIcon}
          activeOpacity={0.8}
          onPress={downloadFromUrl}
        >
          <Ionicons name="cloud-upload-outline" size={18} color={Color.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.wrapIcon}
          activeOpacity={0.8}
          onPress={importData}
        >
          <Ionicons name="archive-outline" size={18} color={Color.icon} />
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
        <TouchableOpacity style={styles.wrapIcon} activeOpacity={0.8}>
          <Ionicons name="settings" size={15} color={Color.icon} />
        </TouchableOpacity>
      </View>
      <SwipeListView
        data={data}
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
