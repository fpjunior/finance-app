import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Transaction } from "../interface/interfaceTransaction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { DateTime } from "luxon";
import { useState } from "react";
interface ValueInput {
  money: string;
  description: string;
  date: string;
}

type State = {
  data: Transaction[];
};

type Action = {
  addTransaction: (
    value: ValueInput,
    transactionType: string,
    id: string,
    date: string,
    currentMonth: string,
    originalDate: string,
  ) => void;
  deleteTransaction: (id: string) => void;
  updateData: (newData: Transaction[]) => void;
  filterData: (newData: Transaction[]) => void;
  updateTransaction: (
    newItem: ValueInput | undefined,
    itemId: string | null,
    transactionType: string,
    originalData: string,
  ) => void;
};

export const useStoreTransaction = create(

  persist<State & Action>(
    (set) => ({
      data: [],
      //agregar un elemento
      addTransaction: (
        value: ValueInput,
        transactionType: string,
        id: string,
        date: string,
        currentMonth: string,
        originalDate: string
      ) =>
        set((state) => ({
          ...state,
          data: [
            { ...value, transactionType, id, date, currentMonth, originalDate },
            ...state.data,
          ],
        })),

      //eliminar un elemento
      deleteTransaction: (id: string) =>
        set((state) => ({
          ...state,
          data: state.data.filter((item) => item.id !== id),
        })),

        updateData: (newData: Transaction[]) =>
        set((state) => ({
          ...state,
          data: newData,
        })),

        filterData: (newData: Transaction[]) =>
        set((state) => ({
          ...state,
          data: newData,
        })),


      //editar un elemento
      updateTransaction: (
        newItem: ValueInput | undefined,
        itemId: string | null,
        transactionType: string,
        originalDate: string,
      ) =>
        set((state) => ({
          data: state.data.map((item) =>
            item.id === itemId ? { ...item, ...newItem, transactionType, originalDate } : item
          ),
        })),
    }),
    { name: "transaction-list", storage: createJSONStorage(() => AsyncStorage) }
  )
);