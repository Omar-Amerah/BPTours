import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { WEATHER_API_KEY } from '@env';

const API_KEY = '50dbba07708435153998adee02d4a24e';
const LAT = '53.8167';
const LON = '-3.0370';

export default function HomeScreen() {

    const [weatherData, setWeatherData] = useState(null);

	const getWeatherFromApi = async () => {
    console.log("Getting weather");
    try { return await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Blackpool,GB&units=metric&appid=${API_KEY}`)
      .then((response) => response.json())
      .then((json) => {
        
        setWeatherData (json);
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };
  
  useEffect(() => {
    getWeatherFromApi();
  }, []);

  if (!weatherData) {
    console.log('No weather data');
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <Text>Loading weather data...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  const weatherToday = weatherData.list[0];
  const nextDaysData = weatherData.list.slice(1, 6);

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.container}>
        <SafeAreaView style={styles.weatherCard}>
          <View style={styles.todayWeather}>
          <Image source={{ uri: `https://openweathermap.org/img/wn/${weatherToday.weather[0].icon}@2x.png` }} style={{ width: 50, height: 50 }}/>

            <View style={{ marginLeft: 10 }}> 
              <Text style={styles.todayLabel}>Today:</Text>
              <Text style={styles.todayTemp}>{weatherToday.main.temp.toFixed(0)}</Text>
            </View>
          </View>

          <View style={styles.nextDays}>
            <Text style={styles.nextDaysLabel}>Next 5 Days:</Text>
            <View style={styles.nextDaysIcons}>
              {nextDaysData.map((item, index) => (
                <View key={index} style={styles.nextDay}>
                  <Image source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png` }} style={{ width: 50, height: 50 }}/>
                  <Text style={styles.nextDayTemp}>{item.main.temp.toFixed(0)}°C</Text>
                </View>
              ))}
            </View>
          </View>
        </SafeAreaView>
        <SafeAreaView>
          <SearchBar placeholder='Search for Tour...' style={styles.SearchBar} containerStyle={styles.searchBarContainer} inputContainerStyle={styles.searchBarInputContainer}></SearchBar>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  weatherCard: {
    backgroundColor:'rgb(151, 223, 241)',
    margin: 10,
    borderRadius: 8,
    padding: 15,
  },
  todayWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  todayLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 5, 
  },
  todayTemp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  nextDays: {
    marginTop: 10,
  },
  nextDaysLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  nextDaysIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nextDay: {
    alignItems: 'center',
  },
  nextDayTemp: {
    fontSize: 14,
    color: '#555',
    marginTop: 5, 
  },
  SearchBar: {
    backgroundColor: 'rgb(151, 223, 241)',
    margin: 10,
    borderRadius: 8,
    color: 'black',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: 0,
  },
  searchBarInputContainer: {
    backgroundColor: 'rgb(151, 223, 241)',
    borderRadius: 8,
  },
});

