import React from 'react';
import { Button, StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';

    export const showToast = (teste: string) => {
        ToastAndroid.show(teste, ToastAndroid.SHORT);
    };

    export const showToastWithGravity = (content: string) => {
        ToastAndroid.showWithGravity(
            content,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        );
    };

    export const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
            'A wild toast appeared!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    };




