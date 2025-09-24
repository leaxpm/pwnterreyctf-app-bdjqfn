
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
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={commonStyles.tabContainer}
      contentContainerStyle={{ paddingHorizontal: 12 }}
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
              fontWeight: '500',
            }}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default FilterTabs;
