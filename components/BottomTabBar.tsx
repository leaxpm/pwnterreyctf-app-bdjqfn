
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface BottomTabBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { key: 'inicio', label: 'Inicio', icon: 'home-outline' },
    { key: 'ctfs', label: 'CTFs', icon: 'flag-outline' },
    { key: 'talleres', label: 'Talleres', icon: 'library-outline' },
    { key: 'favoritos', label: 'Favoritos', icon: 'star-outline' },
    { key: 'perfil', label: 'Perfil', icon: 'person-outline' },
  ];

  return (
    <View style={commonStyles.bottomTabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={commonStyles.bottomTab}
          onPress={() => {
            console.log('Tab changed to:', tab.key);
            onTabChange(tab.key);
          }}
        >
          <Icon 
            name={tab.icon as any} 
            size={24} 
            color={activeTab === tab.key ? colors.accent : colors.textSecondary} 
          />
          <Text
            style={{
              fontSize: 12,
              color: activeTab === tab.key ? colors.accent : colors.textSecondary,
              marginTop: 2,
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomTabBar;
