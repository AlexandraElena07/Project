import React, {useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import themeContext from '../../constants/themeContext';
import themeDark from '../../constants/themeDark';

const TopBar = ({ activeTab, setActiveTab, averageRating }) => {

    const userTheme = useContext(themeContext);
    const currentTheme = userTheme === 'dark' ? themeDark.dark : themeDark.light;

    return (
        <View style={[styles.container, {backgroundColor: currentTheme.background, borderBottomColor: currentTheme.backgroundBottombuttons}]}>
            {['CONTACT', 'RATING'].map(tab => {
                let tabContent;

                switch (tab) {
                    case 'CONTACT':
                        tabContent = (
                            <>
                                <MaterialIcons 
                                    name="contact-page" 
                                    size={24} 
                                    color={activeTab === tab ? COLORS.primary : COLORS.grey} 
                                />
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            </>
                        );
                        break;
                        case 'RATING':
                            tabContent = (
                                <>
                                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText, {fontSize: SIZES.large}]}>
                                        {averageRating !== undefined ? `${averageRating.toFixed(1)}/5` : <MaterialIcons 
                                        name="star" 
                                        size={24} 
                                        color={activeTab === tab ? COLORS.primary : COLORS.grey} 
                                    />}
                                    </Text>
                                
                                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                                </>
                            );
                        break;
                    default:
                        tabContent = (
                            <>
                                <MaterialIcons 
                                    name="info" 
                                    size={24} 
                                    color={activeTab === tab ? COLORS.primary : COLORS.grey} 
                                />
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            </>
                        );
                }

                return (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        {tabContent}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1
    },
    tab: {
        padding: 5,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
    },
    tabText: {
        color: COLORS.grey,
        marginTop: 4,
    },
    activeTabText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
});

export default TopBar;
