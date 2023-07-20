import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={60} color="#c661eb" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
