import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, StyleSheet, Text, View } from "react-native";
import messaging from "@react-native-firebase/messaging";
import firebase from "@react-native-firebase/app";


if (!firebase.apps.length) {
  firebase.initializeApp({
    databaseURL:"<database_url.com>",
    projectId:"<project-id",
    appId:"<appId>",
    apiKey:"<api-key>",
    messagingSenderId:"messageSenderId",
    storageBucket: "storage_bucket_url.com"
  });
}

export default function App() {

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    if (requestUserPermission()) {
      messaging().getToken().then((token) => {
        console.log(token);
      })
    } else {
      console.log("Failed token status", authStatus);
    }

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;

  }, []);


  return (
    <View style={styles.container}>
      <Text>FCM Tutorial Using React Native and Expo!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
