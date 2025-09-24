
import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { commonStyles } from '../styles/commonStyles';
import BottomTabBar from '../components/BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import CTFScreen from '../screens/CTFScreen';
import WorkshopScreen from '../screens/WorkshopScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

export default function MainScreen() {
  const [activeTab, setActiveTab] = useState('inicio');
  const pagerRef = useRef<PagerView>(null);

  const tabs = [
    { key: 'inicio', component: HomeScreen },
    { key: 'ctfs', component: CTFScreen },
    { key: 'talleres', component: WorkshopScreen },
    { key: 'favoritos', component: FavoritesScreen },
    { key: 'perfil', component: ProfileScreen },
  ];

  const handleTabChange = (tab: string) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
    const tabIndex = tabs.findIndex(t => t.key === tab);
    if (tabIndex !== -1 && pagerRef.current) {
      pagerRef.current.setPage(tabIndex);
    }
  };

  const handlePageSelected = (event: any) => {
    const { position } = event.nativeEvent;
    const selectedTab = tabs[position];
    if (selectedTab) {
      console.log('Page swiped to:', selectedTab.key);
      setActiveTab(selectedTab.key);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {tabs.map((tab, index) => {
          const ScreenComponent = tab.component;
          return (
            <View key={tab.key} style={{ flex: 1 }}>
              <ScreenComponent />
            </View>
          );
        })}
      </PagerView>
      <BottomTabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </SafeAreaView>
  );
}
