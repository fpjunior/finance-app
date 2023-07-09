import { create } from "zustand";
import * as SQLite from "expo-sqlite";
import { Transaction } from "../interface/interfaceTransaction";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ValueInput {
  money: string;
  description: string;
  date: string;
}

type State = {
  data: Transaction[];
};

type Action = {
  deleteAllTransactions: () => void;
  addTransaction: (
    value: ValueInput,
    transactionType: string,
    id: string,
    date: string,
    currentMonth: string
  ) => void;
  deleteTransaction: (id: string) => void;
  updateData: (newData: Transaction[]) => void;
  setDataFromBackup: (data: Transaction[]) => void;
  updateTransaction: (
    newItem: ValueInput | undefined,
    itemId: string | null,
    transactionType: string
  ) => void;
};

export const db = SQLite.openDatabase("mydatabase.db");

db.transaction((tx) => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      money TEXT,
      description TEXT,
      date TEXT,
      transactionType TEXT,
      currentMonth TEXT
    );`
  );
});

export const updateData2 = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM transactions",
      [],
      (_, resultSet) => {
        const { rows } = resultSet;
        const data: any = [];
        for (let i = 0; i < rows.length; i++) {
          const {
            money,
            description,
            date,
            transactionType,
            id,
            currentMonth,
          } = rows.item(i);
          data.push({
            money,
            description,
            date,
            transactionType,
            id,
            currentMonth,
          });
        }
        console.log("Dados atualizados");
       return data
      },
      (_, error) => {
        console.log("Erro ao buscar dados:", error);
        return false
      }
    );
  });
};


export const useStoreTransaction = create<State & Action>((set) => ({
  data: [],

  setDataFromBackup: (transactions: Array<any>) =>{
    db.transaction((tx) => {
      transactions.forEach((transaction) => {
        tx.executeSql(
          "INSERT INTO transactions (money, description, date, transactionType, currentMonth) VALUES (?, ?, ?, ?, ?)",
          [
            transaction.money,
            transaction.description,
            transaction.date,
            transaction.transactionType,
            transaction.currentMonth,
          ],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              console.log("Registro salvo com sucesso");
            }
          },
          (_, error) => {
            console.log("Erro ao inserir transação:", error);
            return false;
          }
        );
      });
    });
  },

  deleteAllTransactions: () => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM transactions", [], (_, { rowsAffected }) => {
        if (rowsAffected > 0) {
          set((state) => ({
            ...state,
            data: [],
          }));
          console.log("Todos os registros foram deletados com sucesso");
        }
      },
      (_, error) => {
        console.log("Erro ao deletar todos os registros:", error);
        return false;
      });
    });
  },

  addTransaction: (
    value: ValueInput,
    transactionType: string,
    id: string,
    date: string,
    currentMonth: string
  ) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO transactions (money, description, date, transactionType, id, currentMonth) VALUES (?, ?, ?, ?, ?, ?)",
        [value.money, value.description, date, transactionType, id, currentMonth],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            set((state) => ({
              ...state,
              data: [
                { ...value, transactionType, id, date, currentMonth },
                ...state.data,
              ],
            }));
            console.log("Registro salvo com sucesso");
          }
        },
        (_, error) => {
          console.log("Error inserting transaction:", error);
          return false
        }
      );
    });
  },

  deleteTransaction: (id: string) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM transactions WHERE id = ?",
        [id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            set((state) => ({
              ...state,
              data: state.data.filter((item) => item.id !== id),
            }));
            console.log("Registro deletado com sucesso");

          }
        },
        (_, error) => {
          console.log("Error deleting transaction:", error);
          return false
        }
      );
    });
  },

  updateData: (newData: Transaction[]) => {
    set((state) => ({
      ...state,
      data: newData,

    }));
    console.log("Registro atualizado com sucesso");
  },

  updateTransaction: (
    newItem: ValueInput | undefined,
    itemId: string | null,
    transactionType: string
  ) => {
    if (!itemId || !newItem) return;

    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE transactions SET money = ?, description = ?, date = ?, transactionType = ? WHERE id = ?",
        [
          newItem.money,
          newItem.description,
          newItem.date,
          transactionType,
          itemId,
        ],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            set((state) => ({
              ...state,
              data: state.data.map((item) =>
                item.id === itemId
                  ? { ...item, ...newItem, transactionType }
                  : item
              ),
            }));
            console.log("Registro atualizado com sucesso2");

          }
        },
        (_, error) => {
          console.log("Error updating transaction:", error);
          return false
        }
      );
    });
  },
}));
