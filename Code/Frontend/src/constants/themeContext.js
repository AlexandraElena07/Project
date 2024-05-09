import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeDark from './themeDark';

export const ThemeProvider = ({ children }) => {
    const [userTheme, setUserTheme] = useState(themeDark.light);

    useEffect(() => {
        const fetchUserTheme = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('http://10.9.31.61:5003/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data && response.data.theme) {
                    setUserTheme(response.data.theme);
                }
            } catch (error) {
                console.error('Eroare la preluarea temei utilizatorului:', error);
            }
        };

        fetchUserTheme();
    }, []);

    return (
        <ThemeContext.Provider value={userTheme}>
            {children}
        </ThemeContext.Provider>
    );
};

const ThemeContext = createContext();

export  default ThemeContext;
