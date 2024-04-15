import React, { useState, useEffect } from 'react';
import { TextInput, Text, View, Image, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import styles from './login.style';
import { Formik } from 'formik'
import * as Yup from 'yup'
import { COLORS, SIZES } from '../../constants/theme';
import { HeightSpacer, WidthSpacer, ReusableBtn } from '../../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const validationSchema = Yup.object().shape({
   password: Yup.string()
   .nullable()
   .min(8, "Password must be at least 8 characters")
   .required('Password must be at least 8 characters, contain one digit and one big letter')
   .matches(/^(?=.*[0-9])/, 'Password must contain at least one digit')
   .matches(/^(?=.*[A-Z])/, 'Password must contain at least one big letter'),

   username: Yup.string()
   .min(3, "Username must be at least 3 characters")
   .required('Required'),

   email: Yup.string()
   .email("Provide a valid email")
   .matches(/(\.com)$/, 'Provide a valid email')
   .required('Required'),
})

const SignIn = () => {
  const [loader, setLoader] = useState(false)
  const [responseData, setResponseData] = useState(null)
  const [obsecureText, setObsecureText] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false);

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

         <HeightSpacer height={keyboardVisible ? SIZES.height * 0.03 : SIZES.height * 0.1}/>
         
         <Formik
            initialValues={{email: "", password: "", username: ""}}
            validationSchema={validationSchema}
            onSubmit={(value) => {console.log(value);}}>

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
                                 placeholder='Enter your email'
                                 onFocus={() => {setFieldTouched('email')}}
                                 onBlur={() => {setFieldTouched('email',"")}}
                                 value={values.email}
                                 onChangeText={(text) => {handleChange('email')(text)}}
                                 autoCapitalize='none'
                                 autoCorrect={false}
                                 style={{flex: 1}}
                              />
                           </View>
                           {touched.email && errors.email && (
                              <Text style={styles.errorMessage}>{errors.email}</Text>
                           )}
                        </View>
                     </View>

                     <View style={styles.wraper}>
                        <Text style={styles.label}>Username</Text>
                        <View>
                           <View style={styles.inputWrapper(touched.username ? COLORS.darkGrey : COLORS.grey)}>
                              <MaterialCommunityIcons 
                                 name="face-man-profile"
                                 size={20}
                                 color={COLORS.grey}
                              />
                              <WidthSpacer width={10}/>
                              <TextInput 
                                 placeholder='Enter your username'
                                 onFocus={() => {setFieldTouched('username')}}
                                 onBlur={() => {setFieldTouched('username',"")}}
                                 value={values.username}
                                 onChangeText={(text) => {handleChange('username')(text)}}
                                 autoCapitalize='none'
                                 autoCorrect={false}
                                 style={{flex: 1}}
                              />
                           </View>
                           {touched.username && errors.username && (
                              <Text style={styles.errorMessage}>{errors.username}</Text>
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
                        btnText={"Register"}
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

export default SignIn
