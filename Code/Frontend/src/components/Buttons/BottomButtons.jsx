import React, { useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';

const BottomButtons = ({ onPressFavorite, onPressShare }) => {

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

  return (
    <View style={[ styles.container, { backgroundColor: currentTheme.background, borderTopColor: currentTheme.backgroundBottombuttons}]}>
      <TouchableOpacity onPress={onPressFavorite} style={styles.button}>
        <Ionicons name="heart-outline" size={20} color={COLORS.inactiveIcon} />
        <Text style={styles.text}>Favorite</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressShare} style={styles.button}>
        <Ionicons name="share-outline" size={20} color={COLORS.inactiveIcon}  />
        <Text style={styles.text}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom:5
  },
  button: {
    alignItems: 'center',
  },
  text: {
    marginBottom: 20,
    color: COLORS.inactiveIcon
  },
});

export default BottomButtons;
