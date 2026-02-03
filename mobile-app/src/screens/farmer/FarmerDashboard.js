import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../../stateManagement/AuthContext';
import { COLORS } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function FarmerDashboard() {
    const { logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Section */}
            <LinearGradient
                colors={[COLORS.forestDeep, COLORS.forestMid]}
                style={styles.header}
            >
                <SafeAreaView style={styles.SafeAreaView}>
                    <View style={styles.navBar}>
                        <View>
                            <Text style={styles.greeting}>Farm Manager</Text>
                            <Text style={styles.subGreeting}>Harvesting Season 2026</Text>
                        </View>
                        <TouchableOpacity style={styles.profileBadge} onPress={logout}>
                            <Text style={styles.logoutIcon}>Logout</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Stats Summary */}
                    <View style={styles.statsStrip}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Active Crops</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>85%</Text>
                            <Text style={styles.statLabel}>Soil Health</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>KSh 45k</Text>
                            <Text style={styles.statLabel}>Est. Revenue</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Action Grid */}
                <Text style={styles.sectionTitle}>Farm Operations</Text>
                <View style={styles.grid}>
                    <TouchableOpacity style={styles.gridCard}>
                        <Text style={styles.cardIcon}>🌱</Text>
                        <Text style={styles.cardTitle}>My Crops</Text>
                        <Text style={styles.cardSub}>Manage inventory</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridCard}>
                        <Text style={styles.cardIcon}>🔬</Text>
                        <Text style={styles.cardTitle}>Disease Scan</Text>
                        <Text style={styles.cardSub}>AI Diagnosis</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridCard}>
                        <Text style={styles.cardIcon}>📈</Text>
                        <Text style={styles.cardTitle}>Market Prices</Text>
                        <Text style={styles.cardSub}>Real-time data</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.gridCard}>
                        <Text style={styles.cardIcon}>🚜</Text>
                        <Text style={styles.cardTitle}>Hire Help</Text>
                        <Text style={styles.cardSub}>Service providers</Text>
                    </TouchableOpacity>
                </View>

                {/* Soil Analysis Alert Card */}
                <TouchableOpacity style={styles.alertCard}>
                    <LinearGradient
                        colors={['#FFF', '#F0FFF4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.alertGradient}
                    >
                        <View style={styles.alertContent}>
                            <Text style={styles.alertTitle}>Soil Analysis Due</Text>
                            <Text style={styles.alertDesc}>
                                Your Maize field requires a nutrient check-up this week.
                            </Text>
                        </View>
                        <View style={styles.alertBadge}>
                            <Text style={styles.alertBadgeText}>NOW</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA'
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 35,
        borderBottomRightRadius: 35,
        paddingTop: Platform.OS === 'android' ? 45 : 0,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15
    },
    greeting: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    subGreeting: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14
    },
    profileBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 12
    },
    logoutIcon: {
        fontSize: 18
    },
    statsStrip: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        marginTop: 25,
        padding: 15,
        justifyContent: 'space-around'
    },
    statItem: {
        alignItems: 'center'
    },
    statValue: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    statLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        marginTop: 4,
        textTransform: 'uppercase'
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    content: {
        padding: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 15
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    gridCard: {
        backgroundColor: 'white',
        width: (width - 55) / 2,
        padding: 20,
        borderRadius: 24,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10
    },
    cardIcon: {
        fontSize: 32,
        marginBottom: 10
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    cardSub: {
        fontSize: 12,
        color: '#999',
        marginTop: 4
    },
    alertCard: {
        marginTop: 10,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 2
    },
    alertGradient: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    alertContent: {
        flex: 1
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2D6A4F'
    },
    alertDesc: {
        fontSize: 13,
        color: '#555',
        marginTop: 4
    },
    alertBadge: {
        backgroundColor: '#2D6A4F',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8
    },
    alertBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold'
    },
});