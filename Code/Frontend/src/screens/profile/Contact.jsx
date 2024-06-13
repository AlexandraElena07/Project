import React, {useContext, useState, useEffect, useRef} from 'react';
import { useRoute } from '@react-navigation/native';
import { TextInput, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Linking, Alert, KeyboardAvoidingView } from 'react-native'
import styles from './contact.style';
import { HeightSpacer, ReusableText, WidthSpacer, ReusableBtn } from '../../components';
import { COLORS, SIZES, TEXT } from '../../constants/theme';
import * as MailComposer from 'expo-mail-composer';
import axios from 'axios';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Contact = () => {

    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    
    const scrollViewRef = useRef(null);      

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    const route = useRoute();

    const sendEmail = async () => {
        try {
            await MailComposer.composeAsync({
              recipients: ['contact@roexplorer.com']
            });
        } catch (error) {
            console.error('Eroare la compunerea emailului:', error);
        }
    }

    const phoneNumber = '0040 749 302 352'; 
          
    const handleCallPress = () => {
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.openURL(phoneUrl);
    }
        
    useEffect(() => {
        const responseData = route.params.data;
        setEmail(responseData.email); 
        setFeedback(responseData.feedback);
    }, [route.params.data])

    const createContact = async () => {
        const formData = {
            email: email,
            feedback: feedback
        }
        
        try {
            const token = await AsyncStorage.getItem('token');
            
            const response = await axios.post('http://10.9.31.61:5003/api/newcontact', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                console.log('Feedback trimis cu succes!');
                Alert.alert('Success', 'Feedback sent successfully');
                setFeedback(''); 
            } else {
                console.error('Eroare la trimiterea feedback-ului:', error.response?.data || error.message);
                Alert.alert('Error', 'Failed to send feedback: ' + response.data.message);
            }
    
        } catch (error) {
            console.error('Eroare la trimiterea formularului:', error);
            Alert.alert('Error', 'An error occurred while sending feedback');
        }   
    }
        
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <SafeAreaView style={{ flex: 1, backgroundColor: currentTheme.background }}>
                <ScrollView  ref={scrollViewRef} contentContainerStyle={[styles.container, {backgroundColor: currentTheme.background}]}>
                    <View>
                        <ReusableText
                            text={'Contact info'}
                            family={''}
                            size={TEXT.xLarge}
                            color={currentTheme.color}
                        />

                        <View style={styles.firstView}>
                            <ReusableText
                                text={'Email'}
                                family={'medium'}
                                size={TEXT.large}
                                color={currentTheme.color}
                            />

                            <HeightSpacer height={5}/>

                            <TouchableOpacity onPress={sendEmail}>
                                <Text style={styles.textStyle}>contact@roexplorer.com</Text>
                            </TouchableOpacity>

                            <HeightSpacer height={25}/>

                            <ReusableText
                                text={'Phone'}
                                family={'medium'}
                                size={TEXT.large}
                                color={currentTheme.color}
                            />

                            <HeightSpacer height={5}/>

                            <TouchableOpacity onPress={handleCallPress}>
                                <Text style={styles.textStyle}>{phoneNumber}</Text>
                            </TouchableOpacity>

                        </View>

                        <HeightSpacer height={10}/>

                        <ReusableText
                            text={'Share your feedback with us'}
                            family={''}
                            size={TEXT.xLarge}
                            color={currentTheme.color}
                        />

                        <View style={styles.secondView}>

                            <ReusableText
                                text={'Email:'}
                                family={''}
                                size={TEXT.medium}
                                color={currentTheme.color}
                            />

                            <HeightSpacer height={5}/>

                            <TextInput                     
                                placeholder='Enter your email'
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={styles.inputEmail}
                                defaultValue={email}
                                editable={false}
                                backgroundColor={currentTheme.backgroundTextInput}
                                color={currentTheme.color}
                            />

                            <HeightSpacer height={10}/>

                            <ReusableText
                                text={'Feedback:'}
                                family={''}
                                size={TEXT.medium}
                                color={currentTheme.color}
                            />

                            <HeightSpacer height={5}/>

                            <TextInput                     
                                placeholder='Enter your feedback'
                                placeholderTextColor={currentTheme.color}
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={styles.input}
                                multiline={true}
                                returnKeyType='done'
                                backgroundColor={currentTheme.background}
                                color={currentTheme.color}
                                onChangeText={(text) => setFeedback(text)}
                                value={feedback} 
                            />

                            <HeightSpacer height={55}/>

                            <View style={{alignItems: 'center'}}>
                                <ReusableBtn
                                    onPress={createContact}        
                                    btnText={"Send Feedback"}
                                    width={(SIZES.width - 80)/2}
                                    backgroundColor={currentTheme.backgroundButton}
                                    borderColor={COLORS.blue}
                                    borderWidth={2}
                                    textColor={COLORS.blue}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default Contact;
