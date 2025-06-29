import React, {createContext, useContext, useState, useEffect} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError} from "axios";
import config from "@/config"

type Response = {
    success: boolean,
    message: string
}

type AuthContextType = {
    login: (email: string, password: string) => Promise<Response>;
    register: (name: string, email: string, password: string, confirmPassword: string) => Promise<Response>
    logout: ()=>Promise<void>;
    loading: boolean;
    isLoggedIn: boolean;
    token: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState("");

    useEffect(()=> {
        restoreSession();
    }, [])

    const register = async(name: string, email: string, password: string, confirmPassword: string) => {
        try {
            const res = await axios.post(`${config.BACKEND_URL}/api/user/register`, {
                name: name,
                email: email,
                password: password,
                confirmPassword: confirmPassword
            })

            await AsyncStorage.setItem('jwt', res.data.token);

            setIsLoggedIn(true);
            setToken(res.data.token);

            return { success: true, message: "Registration success" };

        } catch(err) {
            const error = err as AxiosError;
            console.log(err)

            if (error.response) {
                console.log(error.response?.data); 
                return {
                    success: false, 
                    message:(error.response.data as any).message || 'Registration failed' 
                }
            } else {
                console.log('Unexpected error:', error.message);
                return { success: false, message: 'Unexpected error occurred' };
            }
        }
    }

    const restoreSession = async () => {
        setLoading(true);

        const token = await AsyncStorage.getItem('jwt');
        console.log(token)
        if (token) {
            try {
                console.log("loggedIn")
                setIsLoggedIn(true);
                setToken(token)

            } catch(err) {
                console.log("token error")
                console.log(err)
                await AsyncStorage.removeItem('jwt');
            }
        }
        setLoading(false);
    };

    const login = async(email: string, password: string) => {
        try {
            const res = await axios.post(`${config.BACKEND_URL}/api/user/login`, {email, password})
            await AsyncStorage.setItem('jwt', res.data.token);

            setIsLoggedIn(true);
            setToken(res.data.token);

            return {success: true, message: "Login success"}
        } catch(err) {
            const error = err as AxiosError;

            if (error.response) {
                console.log(error.response?.data); 
                return {
                    success: false, 
                    message:(error.response.data as any).message || 'Registration failed' 
                }
            } else {
                console.log('Unexpected error:', error.message);
                return { success: false, message: 'Unexpected error occurred' };
            }
        }
    }

    const logout = async() => {
        await AsyncStorage.removeItem('jwt');
        setIsLoggedIn(false)
        setToken("")
    }

    return (
        <AuthContext.Provider value={{ 
            login,
            register,
            logout,
            loading, 
            isLoggedIn,
            token
         }}>
        {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};