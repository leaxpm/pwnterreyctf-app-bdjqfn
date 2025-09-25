
import React, { useState } from 'react';
import { View, Platform, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import CTFScreen from '../screens/CTFScreen';
import WorkshopScreen from '../screens/WorkshopScreen';
import TalksScreen from '../screens/TalksScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AdminScreen from '../screens/AdminScreen';
import AuthWrapper from '../components/AuthWrapper';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [showAdminScreen, setShowAdminScreen] = useState(false);

  console.log('MainScreen - Rendering with state:', {
    activeTab,
    showAdminScreen
  });

  const handleTabChange = (tab: string) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  const handleShowAdmin = () => {
    console.log('MainScreen - handleShowAdmin called');
    console.log('MainScreen - Current showAdminScreen state:', showAdminScreen);
    setShowAdminScreen(true);
    console.log('MainScreen - Admin screen state set to true');
  };

  const handleCloseAdmin = () => {
    console.log('MainScreen - handleCloseAdmin called');
    console.log('MainScreen - Current showAdminScreen state:', showAdminScreen);
    setShowAdminScreen(false);
    console.log('MainScreen - Admin screen state set to false');
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomeScreen onShowAdmin={handleShowAdmin} />;
      case 'ctfs':
        return <CTFScreen />;
      case 'talleres':
        return <WorkshopScreen />;
      case 'charlas':
        return <TalksScreen />;
      case 'favoritos':
        return <FavoritesScreen />;
      case 'perfil':
        return <ProfileScreen />;
      default:
        return <HomeScreen onShowAdmin={handleShowAdmin} />;
    }
  };

  // Show admin screen as overlay
  if (showAdminScreen) {
    console.log('MainScreen - Rendering AdminScreen overlay');
    return (
      <AuthWrapper>
        <AdminScreen onClose={handleCloseAdmin} />
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <SafeAreaView style={commonStyles.container} edges={['top']}>
        {/* Debug Admin Button - Remove after testing */}
        <View style={{
          position: 'absolute',
          top: 50,
          right: 20,
          zIndex: 1000,
          backgroundColor: colors.primary,
          borderRadius: 8,
          padding: 8,
        }}>
          <TouchableOpacity
            onPress={() => {
              console.log('DIRECT ADMIN BUTTON - Pressed');
              console.log('DIRECT ADMIN BUTTON - Current state:', showAdminScreen);
              setShowAdminScreen(true);
              console.log('DIRECT ADMIN BUTTON - State set to true');
            }}
          >
            <Text style={{ color: colors.background, fontSize: 12, fontWeight: '600' }}>
              ADMIN
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ flex: 1 }}>
          {renderActiveScreen()}
        </View>
        <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </SafeAreaView>
    </AuthWrapper>
  );
}
