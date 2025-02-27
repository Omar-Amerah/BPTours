import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { UserContext } from '../_layout';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../_layout';

const API_KEY = '50dbba07708435153998adee02d4a24e';

export default function HomeScreen() {

  const cardData = [
    {
      id: 1,
      title: "Blackpool Illuminations Night Tour",
      description: "Experience the magical Blackpool Illuminations from the comfort of our open-top bus. A guided evening tour showcasing the dazzling light displays along the famous promenade.",
      availableDates: ["2025-03-10", "2025-03-15", "2025-03-20"],
      price: 25
    },
    {
      id: 2,
      title: "Blackpool Tower & Heritage Walk",
      description: "Discover the rich history of Blackpool with a guided walking tour, including a visit to the iconic Blackpool Tower and other historic landmarks.",
      availableDates: ["2025-03-05", "2025-03-12", "2025-03-19"],
      price: 30
    },
    {
      id: 3,
      title: "Pleasure Beach VIP Experience",
      description: "Enjoy a thrilling day at Blackpool Pleasure Beach with fast-track access to rides, exclusive behind-the-scenes insights, and a delicious lunch included.",
      availableDates: ["2025-03-08", "2025-03-14", "2025-03-22"],
      price: 60
    },
    {
      id: 4,
      title: "Coastal Tram Ride & Fish and Chips",
      description: "Take a relaxing tram ride along the Blackpool coastline, enjoying stunning sea views and ending the tour with a traditional fish and chips meal.",
      availableDates: ["2025-03-06", "2025-03-13", "2025-03-21"],
      price: 20
    },
    {
      id: 5,
      title: "Blackpool Zoo & Nature Walk",
      description: "A family-friendly tour exploring Blackpool Zoo, where you’ll get up close with a variety of animals before enjoying a scenic nature walk.",
      availableDates: ["2025-03-07", "2025-03-14", "2025-03-21"],
      price: 35
    }
  ];
  

    const [weatherData, setWeatherData] = useState(null);
    const [openDates, setOpenDates] = useState(Array(cardData.length).fill(false));

    const userContextValue = useContext(UserContext);


  const toggleOpen = (index) => {
    setOpenDates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

    //Add new booked tour to Firestore
  const addBookedTour = async (tourData) => {
    try {
      const newTour = await addDoc(collection(db, "BookedTours"), tourData);
      alert('Tour booked successfully for ' + tourData.TourDate + '!');
      console.log(newTour.id);
    } catch (error) {
      console.error(error);
    }
  };

  //Get Weather Data from OpenWeather API
	const getWeatherFromApi = async () => {
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


  //Return Loading Screen if no weather data
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

  //Data for Weather and Cards
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
              <Text style={styles.todayTemp}>{weatherToday.main.temp.toFixed(0)}°C</Text>
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
          {cardData.map((item, index) => (
            <View key={index} style={styles.tourCard}>
              <Text style={styles.tourTitle}>{item.title}</Text>
              <Text style={styles.tourDescription}>{item.description}</Text>
              <View style={styles.tourDetails}>
                <Text style={styles.tourPrice}>Price: £{item.price}</Text>
                <TouchableOpacity style={styles.button} onPress={() => toggleOpen(index)}>
                  <Text style={styles.buttonText}>
                    {openDates[index] ? 'Hide Tour Dates' : 'View Tour Dates'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ display: openDates[index] ? 'flex' : 'none' }}>
                <Text>Available Dates:</Text>
                {item.availableDates.map((date, index) => (
                  <TouchableOpacity key={index} style={styles.dateButton} onPress={() => addBookedTour({ userUID: userContextValue, TourID: item.id, TourName:item.title, TourDescription:item.description, TourPrice:item.price, TourDate: date })}>
                    <Text style={styles.dateButtonText} key={index}>Book for: {date}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
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
  tourCard: {
    backgroundColor: 'rgb(151, 223, 241)',
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor:'rgb(90, 157, 224)',
    padding: 10,
    borderRadius: 5,
    width: '50%', 
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  tourTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tourDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  tourPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  tourDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateButton: {
    backgroundColor: 'rgb(90, 157, 224)', 
    margin: 5,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: 'auto',
  },
  dateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});

