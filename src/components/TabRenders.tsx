import React from 'react';
import { LinearGradient } from 'expo-linear-gradient'; // Certifique-se de importar corretamente
import { TouchableOpacity, Text, ViewStyle, TextStyle,  StyleSheet } from 'react-native'; // Certifique-se de importar corretamente
import { Color } from "../constants/theme";

interface TabRendererProps {
  item: {
    name: string;
    type: string;
  };
  selectedTab: string;
  handleRestaurarTabPress: (event: string) => void;
}

const TabRenderer: React.FC<TabRendererProps> = ({
  item,
  selectedTab,
  handleRestaurarTabPress,
}) => {
  const isSelected = item.type === selectedTab;

  return (
    <LinearGradient
      start={{ x: 0.1, y: 0 }}
      end={{ x: 1, y: 1.2 }}
      colors={[
        isSelected ? "#4f80c3" : "#fff",
        isSelected ? "#c661eb" : "#fff",
        isSelected ? "#ee8183" : "#fff",
      ]}
      style={styles.tabGradient} // Certifique-se de importar os estilos corretamente
    >
      <TouchableOpacity
        activeOpacity={1}
        style={styles.wrapTab} // Certifique-se de importar os estilos corretamente
        onPress={() => handleRestaurarTabPress(item.type)}
      >
        <Text
          style={[
            styles.titleTab, // Certifique-se de importar os estilos corretamente
            {
              color: isSelected ? "#fff" : Color.fontColorPrimary, // Certifique-se de importar corretamente
            },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default TabRenderer;
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
})