
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import CTFScreen from '../screens/CTFScreen';
import WorkshopScreen from '../screens/WorkshopScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState('inicio');

  const renderScreen = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomeScreen />;
      case 'ctfs':
        return <CTFScreen />;
      case 'talleres':
        return <WorkshopScreen />;
      case 'favoritos':
        return <FavoritesScreen />;
      case 'perfil':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={commonStyles.container}>
      {renderScreen()}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}
