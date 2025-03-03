import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Link } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export function FixedNavigationBar() {
    return (
        <View style={styles.fixedNavBarContainer}>
            <View style={styles.fixedNavBar}>
                <Link href="/" asChild>
                    <TouchableOpacity style={styles.navItem} accessibilityRole="button" accessibilityLabel="Dashboard">
                        <Feather name="grid" size={24} color="#777" />
                        <Text style={styles.navItemText}>Dashboard</Text>
                    </TouchableOpacity>
                </Link>
                
                <Link href="/create" asChild>
                    <View style={styles.plusButtonWrapper}>
                        <TouchableOpacity 
                            style={styles.plusButtonContainer} 
                            accessibilityRole="button" 
                            accessibilityLabel="Add new"
                        >
                            <LinearGradient
                                colors={['#8A2BE2', '#6722A8', '#4B0082']}
                                style={styles.plusButton}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Feather name="plus" size={24} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Link>
                
                <Link href="/profile" asChild>
                    <TouchableOpacity style={styles.navItem} accessibilityRole="button" accessibilityLabel="Profile">
                        <Feather name="user" size={24} color="#777" />
                        <Text style={styles.navItemText}>Profile</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    fixedNavBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingBottom: 20,
        zIndex: 1000,
    },
    fixedNavBar: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#222',
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        flex: 1,
    },
    navItemText: {
        color: '#aaa',
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Inter_500Medium',
    },
    plusButtonWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        flex: 1,
    },
    plusButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -36,
    },
    plusButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#111',
        shadowOffset: { width: 2, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    }
});