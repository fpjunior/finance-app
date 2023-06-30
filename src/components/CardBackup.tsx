import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Color } from "../constants/theme";
import { formatQuantity } from "../helpers";
import { useTransactionContext } from "../context/AppContext";
import { useStoreTransaction } from "../store/store";

type Prop = {
  titleList?: string;
  cardObj?: any;
};

export default function CardBackup({ titleList, cardObj }: Prop) {
  const { data } = useStoreTransaction();
  const { totalIncome, totalExpenses, total } = useTransactionContext();
  const { dataSalvo, nomeArquivo, quantidadeRegistros, isBackup, rangeDateBackup } = cardObj || {};
  const { dataRestore, nomeArquivoRestore, quantidadeRegistrosRestore, isRestore, rangeDateRestore } = cardObj || {};

  let indiceComa = data[0]?.date.indexOf(",");
  let newDate = data[0]?.date.substring(indiceComa + 1);

  let indiceComa2 = data[data.length - 1]?.date.indexOf(",");
  let newDate2 = data[data.length - 1]?.date.substring(indiceComa2 + 1);

  let indiceComaRestore = data[0]?.date.indexOf(",");
  let newDateRestore = data[0]?.date.substring(indiceComa + 1);

  let indiceComaRestore2 = data[data.length - 1]?.date.indexOf(",");
  let newDateRestore2 = data[data.length - 1]?.date.substring(indiceComa2 + 1);

  return (
    <>
      <LinearGradient
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1.2 }}
        colors={["#4f80c3", "#c661eb", "#ee8183"]}
        style={styles.container}
      >
        <Text style={styles.dataEmpty}>
          {isBackup == 1 ? 'Informações do último backup realizado' : 'Informações do último restore realizado'}
        </Text>
        {data.length > 0 ? (
          <Text style={styles.dates}>
            Registros {isBackup == 1 ? rangeDateBackup : rangeDateRestore}
          </Text>
        ) : (
          <Text style={styles.dates}> Registros {rangeDateRestore}</Text>
        )}
        <View style={styles.containerFooter}>
          <View style={styles.wrapContentLeftEndRight}>
            <View style={[styles.wrapArrow]}>
              {
              isBackup == 1 
              ? <Ionicons name="cloud-upload" size={35} color={Color.icon} /> 
              : <Ionicons name="cloud-download" size={35} color={Color.icon} />
              }
            </View>
            <View>
              {
                isBackup == 1
                  ? <Text style={styles.title}>Nome do arquivo salvo: {nomeArquivo}</Text>
                  : <Text style={styles.title}>Nome do arquivo restaurado: {nomeArquivoRestore}</Text>
              }

              {
                isBackup == 1
                  ? <Text style={styles.title}>Quantidade de registros: {quantidadeRegistros}</Text>
                  : <Text style={styles.title}>Quantidade de registros: {quantidadeRegistrosRestore}</Text>
              }

              {
                isBackup == 1
                  ? <Text style={styles.money}>Data do backup: {dataSalvo}</Text>
                  : <Text style={styles.money}>Data da Restauração: {dataRestore}</Text>
              }

            </View>
          </View>
        </View>
      </LinearGradient>
      {titleList && <Text style={styles.titleList}>{titleList}</Text>}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 10,
    marginTop: 12,
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
  dataEmpty: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
  },
  total: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 10,
    textAlign: "center",
  },
  containerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 14,
    paddingHorizontal: 7,
  },
  wrapContentLeftEndRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  wrapArrow: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26 / 1,
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
});
