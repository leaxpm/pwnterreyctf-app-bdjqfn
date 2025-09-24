
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: { key: string; label: string }[];
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange, filters }) => {
  return (
    <View style={commonStyles.tabContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 16,
          alignItems: 'center',
        }}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              buttonStyles.tab,
              activeFilter === filter.key 
                ? buttonStyles.tabActive 
                : buttonStyles.tabInactive
            ]}
            onPress={() => {
              console.log('Filter changed to:', filter.key);
              onFilterChange(filter.key);
            }}
          >
            <Text
              style={{
                color: activeFilter === filter.key ? colors.background : colors.text,
                fontSize: 14,
                fontWeight: activeFilter === filter.key ? '600' : '500',
                textAlign: 'center',
              }}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FilterTabs;
