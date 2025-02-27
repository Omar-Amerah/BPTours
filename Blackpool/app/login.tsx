import React, { createContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export const UserContext = createContext("null");

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  //Login Function
  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    setLoading(true);
    const auth = getAuth();

    try{
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user.uid);
      alert('Login successful!');
      
      router.replace("/(tabs)"); 
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
        alert(error.message);
      } else {
        console.error('Login error:', error);
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  //Redirect to Register Page
  const handleRegister = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.title}>Sign In</Text>
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
      <TouchableOpacity style={styles.button} 
      onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
          <Text onPress={handleRegister} style={styles.buttonText}>Don't Have an Account?</Text>
          <Text onPress={handleRegister} style={styles.buttonText}>Forgot Password?</Text>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
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