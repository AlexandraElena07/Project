import React, { useState, useEffect, useRef } from 'react';
import { TextInput, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import styles from './login.style';
import { Formik } from 'formik'
import * as Yup from 'yup'
import { COLORS, SIZES } from '../../constants/theme';
import { HeightSpacer, WidthSpacer, ReusableBtn } from '../../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const validationSchema = Yup.object().shape({
   password: Yup.string()
   .nullable()
   .min(8, "Password must be at least 8 characters")
   .required('Password must be at least 8 characters, contain one digit and one big letter')
   .matches(/^(?=.*[0-9])/, 'Password must contain at least one digit')
   .matches(/^(?=.*[A-Z])/, 'Password must contain at least one big letter'),
   email: Yup.string()
   .email("Provide a valid email")
   .matches(/(\.com)$/, 'Provide a valid email')
   .required('Required'),
})

const LogIn = () => {
  const [responseData, setResponseData] = useState(null)
  const [obsecureText, setObsecureText] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const loginUser = async (userData) => {
   try {
     
     const response = await axios.post('http://10.9.31.61:5003/api/login', userData);
     
     setResponseData(response.data); 
     
     console.log(response.data);
     Alert.alert('Success', response.data.message)
   //   , () => {
   //    navigation.navigate('LogIn');
   //    });

   } catch (error) {

      //console.error('Error creating user:', error);

      if (error.response.status === 401) {
         Alert.alert('Error', 'User not found');
      } else if (error.response.status === 501) {
         Alert.alert('Error', 'Wrong password. Try again!');
      } else {
         Alert.alert('Error', 'An error occurred while login the user.');
      }
    } 
  };

  useEffect(() => {
   const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
     setKeyboardVisible(true);
   });
   const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
     setKeyboardVisible(false);
   });

   // Clean up function
   return () => {
     keyboardDidShowListener.remove();
     keyboardDidHideListener.remove();
   };
 }, []);

  return (
   <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.container}>
         <View style = {{alignItems: "center"}}>
            <HeightSpacer height={keyboardVisible ? SIZES.height * 0.05 : SIZES.height * 0.15}/>
            <Image source={require('../../../assets/images/logo1.png')} style={styles.image}/>
         </View>

         <HeightSpacer height={keyboardVisible ? SIZES.height * 0.05 : SIZES.height * 0.1}/>
         
         <Formik
            initialValues={{email: "", password: ""}}
            validationSchema={validationSchema}
            onSubmit={(value) => {loginUser(value);}}>

               {({
                  handleChange,
                  touched,
                  handleSubmit,
                  values,
                  errors,
                  isValid,
                  setFieldTouched

               }) => (
                  <View>

                     <View style={styles.wraper}>
                        <Text style={styles.label}>Email</Text>
                        <View>
                           <View style={styles.inputWrapper(touched.email ? COLORS.darkGrey : COLORS.grey)}>
                              <MaterialCommunityIcons 
                                 name="email-outline"
                                 size={20}
                                 color={COLORS.grey}
                              />
                              <WidthSpacer width={10}/>
                              <TextInput 
                                 ref={emailRef}
                                 placeholder='Enter your email'
                                 onFocus={() => {setFieldTouched('email')}}
                                 onBlur={() => {setFieldTouched('email',"")}}
                                 value={values.email}
                                 onChangeText={(text) => {handleChange('email')(text)}}
                                 autoCapitalize='none'
                                 autoCorrect={false}
                                 style={{flex: 1}}
                                 onSubmitEditing={() => { passwordRef.current.focus(); }}
                              />
                           </View>
                           {touched.email && errors.email && (
                              <Text style={styles.errorMessage}>{errors.email}</Text>
                           )}
                        </View>
                     </View>

                     <View style={styles.wraper}>
                        <Text style={styles.label}>Password</Text>
                        <View>
                           <View style={styles.inputWrapper(touched.password ? COLORS.darkGrey : COLORS.grey)}>
                              <MaterialCommunityIcons 
                                 name="lock-outline"
                                 size={20}
                                 color={COLORS.grey}
                              />
                              <WidthSpacer width={10}/>
                              <TextInput
                                 ref={passwordRef}
                                 secureTextEntry={obsecureText} 
                                 placeholder='Enter your password'
                                 onFocus={() => {setFieldTouched('password')}}
                                 onBlur={() => {setFieldTouched('password', "")}}
                                 value={values.password}
                                 onChangeText={(text) => {handleChange('password')(text)}}
                                 autoCapitalize='none'
                                 autoCorrect={false}
                                 style={{flex: 1}}
                              />
                              <TouchableOpacity onPress={()=> {
                                 setObsecureText(!obsecureText)
                              }}>
                                 <MaterialCommunityIcons
                                    name={obsecureText ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.darkGrey}
                                 />
                              </TouchableOpacity>
                           </View>
                           {touched.password && errors.password && (
                              <Text style={styles.errorMessage}>{errors.password}</Text>
                           )}
                        </View>
                     </View>

                     <ReusableBtn
                        onPress={handleSubmit}
                        btnText={"Log in"}
                        width={(SIZES.width - 41)}
                        backgroundColor={COLORS.red}
                        borderColor={COLORS.red}
                        borderWidth={0}
                        textColor={COLORS.white}
                     />

                  </View>
               )}
         </Formik>
      </View>
   </KeyboardAvoidingView>
  );
}

export default LogIn
