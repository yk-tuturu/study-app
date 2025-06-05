import { Link, Stack } from 'expo-router';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, {useState} from "react"

import ThemedText from '@/components/text/ThemedText';
import StyledTextInput from '@/components/general/StyledTextInput';
import colors from '@/constants/Colors';
import TextButton from '@/components/buttons/TextButton';
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';

export default function Register() {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const {register} = useAuth()

    const router = useRouter()

    const handleRegister = async() => {
      try {
        const res = await register(inputs.name, inputs.email, inputs.password, inputs.confirmPassword);
        if (res.success) {
          router.replace("./(tabs)/") // redirect to home page
        } else {
          console.log(res.message)
        }
      } catch (err) {
        console.log(err);
      }
    }
    
    return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // iOS needs 'padding'
        keyboardVerticalOffset={-100}
        style={styles.container}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
            <View style={styles.uiContainer}>
            <ThemedText type="font_lg" style={{marginBottom: 16}}>Register</ThemedText>
            <StyledTextInput
                value={inputs.name}
                placeholder="Enter username here"
                onChangeText={(e)=>setInputs(prev=>({...prev, name: e}))}
                label="Username"
            />
            <StyledTextInput
                value={inputs.email}
                placeholder="Enter email here"
                onChangeText={(e)=>setInputs(prev=>({...prev, email: e}))}
                label="Email"
            />
            <StyledTextInput
                value={inputs.password}
                placeholder="Enter password here"
                onChangeText={(e)=>setInputs(prev=>({...prev, password: e}))}
                label="Password"
                secureTextEntry={true}
            />
            <StyledTextInput
                value={inputs.confirmPassword}
                placeholder="Enter password again"
                onChangeText={(e)=>setInputs(prev=>({...prev, confirmPassword: e}))}
                label="Confirm Password"
                secureTextEntry={true}
            />
            <TextButton
                style={{marginTop: 32, marginBottom: 16}}
                onPress={handleRegister}
            >
                <ThemedText type="font_sm">Register</ThemedText>
            </TextButton>
            <ThemedText type="subtitle">Already have an account? <Link href="/login" style={{textDecorationLine: 'underline', fontWeight: "bold"}}>Log in</Link></ThemedText>
        </View>
        </ScrollView>
        
        
    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.lightBg,
  },
  uiContainer: {
    flex: 1,
    width: "100%",
    padding: 30,
    height: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
