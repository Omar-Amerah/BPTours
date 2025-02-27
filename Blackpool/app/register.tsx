import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

   //Register Function
  const handleRegister = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    setLoading(true);
    const auth = getAuth();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      alert('Registration successful!');
      router.replace('/login');
    } catch (error) {
      if (error instanceof Error) {
        console.error('Registration error:', error.message);
        alert(error.message);
      } else {
        console.error('Registration error:', error);
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  //Login Function
  const handleLoginRedirect = () => {
    router.replace('/login'); 
  };

  return (
    <View style={styles.container}> 
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor='rgb(255, 255, 255)'
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input2}
        placeholder="Password"
        placeholderTextColor='rgb(255, 255, 255)'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Register</Text>}
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
        <Text onPress={handleLoginRedirect} style={styles.buttonText}>Have an Account?</Text>
        <Text onPress={handleRegister} style={styles.buttonText}>Forgot Password?</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#A5A5A7',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  logo: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  inputText: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgb(151, 223, 241)',
    height: 50,
    fontSize: 16,
    borderRadius: 8,
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 8,
    elevation: 10,
    
  },
  input2: {
    backgroundColor: 'rgb(151, 223, 241)',
    height: 50,
    fontSize: 16,
    borderRadius: 8,
    marginBottom: 150,
    paddingHorizontal: 8,
    elevation: 10,

  },
  button: {
    backgroundColor: 'rgb(246, 148, 49)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    elevation: 5,
  },
  buttonText: {
    flexDirection: 'row',
    margin: 5,
    color: '#FFFFFF',
    fontSize: 15,
  },
});