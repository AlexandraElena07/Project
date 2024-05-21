import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const TopBar = ({ activeTab, setActiveTab, averageRating }) => {
    return (
        <View style={styles.container}>
            {['Contact', 'History', 'Rating'].map(tab => {
                let tabContent;

                switch (tab) {
                    case 'Contact':
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
                    case 'History':
                        tabContent = (
                            <>
                                <MaterialIcons 
                                    name="info-outline" 
                                    size={24} 
                                    color={activeTab === tab ? COLORS.primary : COLORS.grey} 
                                />
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            </>
                        );
                        break;
                    case 'Rating':
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
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: COLORS.grey,
    },
    tab: {
        padding: 10,
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
