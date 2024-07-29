import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Weather from '../components/Weather';
import { Header } from "../header/Header";
import { COLORS } from "../color";
import NextAbscence from "../components/Nextabsences";


const Home = () => {
  return (
    <SafeAreaView style={styles.container}>        
        <Header/>
        <ScrollView>
            <Weather style={styles.weather}/>
            <NextAbscence/>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.base,
  },
});

export default Home;
