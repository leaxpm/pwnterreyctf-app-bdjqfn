
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  filters: string[] | { key: string; label: string }[];
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange, filters }) => {
  // Normalize filters to object format
  const normalizedFilters = filters.map(filter => 
    typeof filter === 'string' 
      ? { key: filter, label: filter }
      : filter
  );

  return (
    <View style={{ paddingVertical: 16 }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 16,
          alignItems: 'center',
          gap: 8,
        }}
      >
        {normalizedFilters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              {
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: activeFilter === filter.key ? colors.primary : colors.surface,
                borderWidth: 1,
                borderColor: activeFilter === filter.key ? colors.primary : colors.border,
              }
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
