import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Weather from '../components/Weather';
import { Header } from "../header/Header";

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>        
        <Header/>
        <ScrollView>
            <Weather/>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
