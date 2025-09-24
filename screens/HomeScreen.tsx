
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import FilterTabs from '../components/FilterTabs';
import Icon from '../components/Icon';

const HomeScreen: React.FC = () => {
  const { getAllEvents, toggleFavorite } = useEvents();
  const [activeFilter, setActiveFilter] = useState('todos');

  const filters = [
    { key: 'todos', label: 'Todos' },
    { key: 'CTF', label: 'CTFs' },
    { key: 'Taller', label: 'Talleres' },
    { key: 'Charla', label: 'Charlas' },
    { key: 'favoritos', label: 'Favoritos' },
  ];

  const getFilteredEvents = () => {
    const allEvents = getAllEvents();
    
    switch (activeFilter) {
      case 'todos':
        return allEvents;
      case 'favoritos':
        return allEvents.filter(event => event.isFavorite);
      case 'CTF':
      case 'Taller':
      case 'Charla':
        return allEvents.filter(event => event.type === activeFilter);
      default:
        return allEvents;
    }
  };

  const handleRegister = (eventId: string) => {
    console.log('Registering for event:', eventId);
    // Here you would implement the registration logic
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={commonStyles.title}>Pwnterrey</Text>
          <Icon name="shield-checkmark" size={24} color={colors.text} style={{ marginLeft: 8 }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={commonStyles.localDataIndicator}>
            <Icon name="warning" size={16} color={colors.text} />
            <Text style={{ fontSize: 12, color: colors.text, marginLeft: 4 }}>
              Datos locales
            </Text>
          </View>
          <Text style={[commonStyles.textSecondary, { marginLeft: 12 }]}>
            Modo sin conexión
          </Text>
        </View>
      </View>

      <FilterTabs 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filters={filters}
      />

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {getFilteredEvents().map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleFavorite={toggleFavorite}
            onRegister={handleRegister}
          />
        ))}
        
        {getFilteredEvents().length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Icon name="calendar-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
              No hay eventos disponibles para este filtro
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
