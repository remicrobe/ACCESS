import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = '842519d667854c8388d101146242707';
    const location = 'Metz';
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no&lang=fr`;

    axios.get(url)
      .then(response => {
        setWeatherData(response.data);
      })
      .catch(error => {
        setError(`Erreur: Impossible de récupérer les données (${error.response?.status})`);
      });
  }, []);

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!weatherData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Chargement des données météo...</Text>
      </SafeAreaView>
    );
  }

  const { name, region, country } = weatherData.location;
  const { temp_c, condition, wind_kph, humidity } = weatherData.current;

  return (
    <View style={styles.weatherContainer}>
        <Text style={styles.title}>Météo à {name}, {region}, {country}:</Text>
        <Text style={styles.text}>Température: {temp_c}°C</Text>
        <Text style={styles.text}>Condition: {condition.text}</Text>
        <Text style={styles.text}>Vent: {wind_kph} km/h</Text>
        <Text style={styles.text}>Humidité: {humidity}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherContainer: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default Weather;
