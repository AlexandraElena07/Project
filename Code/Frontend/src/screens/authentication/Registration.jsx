import React, { useState, useEffect, useRef } from 'react';
import { TextInput, Text, View, Image, TouchableOpacity, ScrollView, Alert, Keyboard } from 'react-native';
import styles from './login.style';
import { Formik } from 'formik'
import * as Yup from 'yup'
import { COLORS, SIZES } from '../../constants/theme';
import { HeightSpacer, WidthSpacer, ReusableBtn } from '../../components';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .nullable()
        .min(8, "Password must be at least 8 characters")
        .required('Password must be at least 8 characters, contain one digit and one big letter')
        .matches(/^(?=.*[0-9])/, 'Password must contain at least one digit')
        .matches(/^(?=.*[A-Z])/, 'Password must contain at least one big letter'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
    username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .required('Required'),
    email: Yup.string()
        .email("Provide a valid email")
        .matches(/(\.com)$/, 'Provide a valid email')
        .required('Required'),
});

const SignIn = () => {
    const [responseData, setResponseData] = useState(null)
    const [obsecureText, setObsecureText] = useState(false)
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const navigation = useNavigation();

    const createUser = async (userData) => {
        try {

            const response = await axios.post('http://10.9.31.61:5003/api/register', userData);

            setResponseData(response.data);
            //console.log(response.data);

            Alert.alert('Success', response.data.message);

        } catch (error) {
            if (error.response.status === 409) {
                Alert.alert('Error', 'Username already exists.');
            } else if (error.response.status === 500) {
                Alert.alert('Error', 'Email already exists.');
            } else {
                Alert.alert('Error', 'An error occurred while creating the user.');
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

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <View style={{ alignItems: "center" }}>
                    <HeightSpacer height={keyboardVisible ? SIZES.height * 0.04 : SIZES.height * 0.09} />
                    <Image source={require('../../../assets/images/logo1.png')} style={styles.image} />
                </View>

                <HeightSpacer height={keyboardVisible ? SIZES.height * 0.005 : SIZES.height * 0.06} />

                <Formik
                    initialValues={{ email: "", password: "", username: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(value) => { createUser(value) }}>

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
                                        <WidthSpacer width={10} />
                                        <TextInput
                                            placeholder='Enter your email'
                                            onFocus={() => { setFieldTouched('email') }}
                                            onBlur={() => { setFieldTouched('email', "") }}
                                            value={values.email}
                                            onChangeText={(text) => { handleChange('email')(text) }}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                            onSubmitEditing={() => { usernameRef.current.focus(); }}
                                            placeholderTextColor={COLORS.grey}
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
                                        <WidthSpacer width={10} />
                                        <TextInput
                                            ref={usernameRef}
                                            placeholder='Enter your username'
                                            onFocus={() => { setFieldTouched('username') }}
                                            onBlur={() => { setFieldTouched('username', "") }}
                                            value={values.username}
                                            onChangeText={(text) => { handleChange('username')(text) }}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                            onSubmitEditing={() => { passwordRef.current.focus(); }}
                                            placeholderTextColor={COLORS.grey}
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
                                        <WidthSpacer width={10} />
                                        <TextInput
                                            ref={passwordRef}
                                            secureTextEntry={!obsecureText}
                                            placeholder='Enter your password'
                                            onFocus={() => { setFieldTouched('password') }}
                                            onBlur={() => { setFieldTouched('password', "") }}
                                            value={values.password}
                                            onChangeText={(text) => { handleChange('password')(text) }}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                            onSubmitEditing={() => { confirmPasswordRef.current.focus(); }}
                                            placeholderTextColor={COLORS.grey}
                                        />
                                        <TouchableOpacity onPress={() => {
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

                            <View style={styles.wraper}>
                                <Text style={styles.label}>Confirm password</Text>
                                <View>
                                    <View style={styles.inputWrapper(touched.confirmPassword ? COLORS.darkGrey : COLORS.grey)}>
                                        <MaterialCommunityIcons
                                            name="lock-outline"
                                            size={20}
                                            color={COLORS.grey}
                                        />
                                        <WidthSpacer width={10} />
                                        <TextInput
                                            ref={confirmPasswordRef}
                                            secureTextEntry={!obsecureText}
                                            placeholder='Enter your password'
                                            onFocus={() => { setFieldTouched('confirmPassword') }}
                                            onBlur={() => { setFieldTouched('confirmPassword', "") }}
                                            value={values.confirmPassword}
                                            onChangeText={(text) => { handleChange('confirmPassword')(text) }}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            style={{ flex: 1 }}
                                            placeholderTextColor={COLORS.grey}
                                        />
                                        <TouchableOpacity onPress={() => {
                                            setObsecureText(!obsecureText)
                                        }}>
                                            <MaterialCommunityIcons
                                                name={obsecureText ? "eye-outline" : "eye-off-outline"}
                                                size={20}
                                                color={COLORS.darkGrey}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
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
        </ScrollView>
    );
}

export default SignIn;
