
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

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState('inicio');

  const handleTabChange = (tab: string) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomeScreen />;
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
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <View style={{ flex: 1 }}>
        {renderActiveScreen()}
      </View>
      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </SafeAreaView>
  );
}
