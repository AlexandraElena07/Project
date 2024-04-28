import React, { useState } from 'react';
import { View } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import { LogIn, Registration } from '../screens';
import styles from '../navigation/authtab.style';
import { COLORS, SIZES } from '../constants/theme'

const AuthTab = () => {
  const [selectedOption, setSelectedOption] = useState('Login');

  const handleSwitchChange = (value) => {
    setSelectedOption(value);
  };

  return (
    <View style={styles.container}>
      <View>
        {selectedOption === 'Login' ? <LogIn /> : <Registration />}
        
        <View style={styles.switchContainer}>
          <SwitchSelector
            options={[
              { label: 'Login', value: 'Login' },
              { label: 'Register', value: 'Register' }
            ]}
            initial={0}
            onPress={handleSwitchChange}
            buttonColor={COLORS.red}
            borderColor={COLORS.red}
            textStyle={{ color: COLORS.red }}
            selectedTextStyle={{ color: COLORS.white }}
            style={styles.switchSelector}
            fontSize={SIZES.small}
            height={SIZES.xLarge}
          />
        </View>
      </View>
    </View>
  );
};

export default AuthTab;
