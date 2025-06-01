import { Link, Stack } from 'expo-router';
import { View, StyleSheet, SafeAreaView, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, {useState} from "react"

import ThemedText from '@/components/ThemedText';
import StyledTextInput from '@/components/StyledTextInput';
import colors from '@/constants/Colors';
import TextButton from '@/components/buttons/TextButton';
import { useAuth } from '@/context/authContext';

import { useRouter } from 'expo-router';

export default function Login() {
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const router = useRouter();

    const {login} = useAuth();

    const handleLogin = async() => {
        try {
            const res = await login(inputs.email, inputs.password);
            if (res.success) {
                router.push("./")
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
            <ThemedText type="font_lg" style={{marginBottom: 16}}>Login</ThemedText>
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
            <TextButton
                style={{marginTop: 32, marginBottom: 16}}
                onPress={handleLogin}
            >
                <ThemedText type="font_sm">Log In</ThemedText>
            </TextButton>
            <ThemedText type="subtitle">Don't have an account? <Link href="/register" style={{textDecorationLine: 'underline', fontWeight: "bold"}}>Register now</Link></ThemedText>
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
