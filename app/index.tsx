
import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/commonStyles';
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

  const handleTabChange = (tab: string) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  const handleShowAdmin = () => {
    console.log('MainScreen - Showing admin screen');
    setShowAdminScreen(true);
  };

  const handleCloseAdmin = () => {
    console.log('MainScreen - Closing admin screen');
    setShowAdminScreen(false);
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
    return (
      <AuthWrapper>
        <AdminScreen onClose={handleCloseAdmin} />
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <SafeAreaView style={commonStyles.container} edges={['top']}>
        <View style={{ flex: 1 }}>
          {renderActiveScreen()}
        </View>
        <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </SafeAreaView>
    </AuthWrapper>
  );
}
