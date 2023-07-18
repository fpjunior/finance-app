import React, { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, TextInput, View } from 'react-native';

export default function AnimatedTextInput() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <AnimatedInput value={name} onChange={setName} placeholder="Name" />
            <AnimatedInput value={email} onChange={setEmail} placeholder="Email" />
            <AnimatedInput
                value={address}
                onChange={setAddress}
                placeholder="Address"
                multiline
            />
        </ScrollView>
    );
}

export function AnimatedInput({ value, onChange, placeholder, multiline }: any) {
    const [inputHeight, setHeight] = useState(0);
    const [placeholderWidth, setWidth] = useState(0);
    const animation = useRef(new Animated.Value(0)).current;
    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -inputHeight / 2],
    });
    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -placeholderWidth / 4],
    });
    const scale = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.5],
    });
    const onFocus = () => animate(1);
    const onBlur = () => !value && animate(0);
    const animate = (val: any) => {
        Animated.spring(animation, {
            toValue: val,
            bounciness: 0,
            useNativeDriver: true,
        }).start();
    };
    return (
        <View
            style={styles.inputContainer}
            onLayout={(e: any) => !inputHeight && setHeight(e.nativeEvent.layout.height)}>
            <View style={{ height: inputHeight, ...styles.placeholderContainer }}>
                <Animated.Text
                    style={[
                        styles.placeholder,
                        { transform: [{ translateY }, { translateX }, { scale }] },
                    ]}
                    onTextLayout={(e: any) =>
                        !placeholderWidth && setWidth(e.nativeEvent.lines[0]?.width || 0)
                    }>
                    {placeholder}
                </Animated.Text>
            </View>
            <TextInput
                style={[
                    styles.input,
                    multiline && { height: 100, textAlignVertical: 'top' },
                ]}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChange}
                multiline={multiline}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    inputContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#999',
        marginBottom: 25,
    },
    input: {
        paddingHorizontal: 10,
        fontSize: 18,
    },
    placeholderContainer: {
        position: 'absolute',
        backgroundColor: 'red',
        justifyContent: 'center',
    },
    placeholder: {
        fontSize: 22,
        position: 'absolute',
        marginHorizontal: 5,
        paddingHorizontal: 5,
        backgroundColor: '#fff',
        color: '#999',
    },
});