import React, {useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';

const TopButtons = ({ activeTab, setActiveTab }) => {
    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    return (
        <View style={styles.tabsContainer}>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'Home' ? styles.activeTab : null]}
                onPress={() => setActiveTab('Home')}
            >
                <Text style={[styles.tabText, {color: currentTheme.color}]}>HOME</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, activeTab === 'Reviews' ? styles.activeTab : null]}
                onPress={() => setActiveTab('Reviews')}
            >
                <Text style={[styles.tabText, {color: currentTheme.color}]}>REVIEWS</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1
      },
      tab: {
        padding: 10,
        backgroundColor: COLORS.primary,
        width: 200,
        alignItems: 'center',
        height: 45,
        verticalAlign: 'middle'
      },
      activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.red,
      },
      tabText: {
        fontSize: 16
      },
});

export default TopButtons;
