import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { UserContext } from '../_layout';
import { collection, query, where, getDocs, DocumentData, deleteDoc, doc } from "firebase/firestore";
import { db } from '../_layout';


export default function HomeScreen() {

  
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    getBookedTours().then(data => setUserData(data || []));
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const userContextValue = useContext(UserContext);
  console.log('User context value:', userContextValue);

  //Add new booked tour to Firestore
  const getBookedTours = async () => {
    try {
      if (userContextValue) {
        const q = query(collection(db, "BookedTours"), where("userUID", "==",userContextValue));
        const userData = await getDocs(q);
        console.log("Booked Tours:", userData.docs.map((doc) => doc.data()));
        return userData.docs.map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data() // Spread document data
        }));
      } else {
        console.error("User context value is null or undefined");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDocument = async (docId, TourName, TourDate) => {
    try {
      
      await deleteDoc(doc(db, "BookedTours", docId));
      onRefresh();
      Alert.alert('Cancelled: ' + TourName + ' on ' + TourDate);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const [userData, setUserData] = useState<DocumentData[]>([]);
  useEffect(() => {
    getBookedTours().then(data => setUserData(data || []));
  }, []);



  return (

      <SafeAreaView>
            <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/3276/3276535.png" }} style={styles.accountImage} />
        <TouchableOpacity style={styles.accountButton}>
          <Text style={styles.accountButtonText}>Change Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountButton}>
          <Text style={styles.accountButtonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountButton}>
          <Text style={styles.accountButtonText}>Change Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountButton}>
          <Text style={styles.accountButtonText}>Delete Account</Text>
        </TouchableOpacity>
          <Text style={styles.title}>Your Booked Tours</Text>
          {userData.map((item, index) => (
          <View key={index} style={styles.tourCard}>
            <Text style={styles.tourTitle}>{item.TourName}</Text>
            <Text style={styles.tourDescription}>{item.TourDescription}</Text>
            <Text style={styles.tourDescription}>Booked For: {item.TourDate}</Text>
            <View style={styles.tourDetails}>
              <Text style={styles.tourPrice}>Price: £{item.TourPrice}</Text>
              <TouchableOpacity style={styles.button} onPress={() => deleteDocument(item.id, item.TourName, item.TourDate)}>
                <Text style={styles.buttonText}>
                  Cancel Booking
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
         </ScrollView>
      </SafeAreaView>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 0,
    padding: 10,
    width: '100%',
    borderTopColor: 'rgb(100, 123, 130)',
    borderTopWidth: 1,
  },
  SearchBar: {
    backgroundColor: 'rgb(151, 223, 241)',
    margin: 10,
    borderRadius: 8,
    color: 'black',
  },
  searchBarContainer: {
    marginTop:  0,
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
  accountButton: {
    backgroundColor: 'rgb(151, 223, 241)',
    width: '70%',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  accountButtonText: {
    color: 'black',
    fontSize: 16,
  },
  accountImage: {
    width: 150,
    height: 150,
    borderRadius: 50,
    alignSelf: 'center',
    margin: 20,
    marginTop: -20,
  },
});

