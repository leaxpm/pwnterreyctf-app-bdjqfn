
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';

const WorkshopScreen: React.FC = () => {
  const { getEventsByType, toggleFavorite } = useEvents();
  const workshopEvents = [...getEventsByType('Taller'), ...getEventsByType('Charla')];

  const handleRegister = (eventId: string) => {
    console.log('Registering for workshop event:', eventId);
    // Here you would implement the registration logic
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="library" size={24} color={colors.tallerTag} />
          <Text style={[commonStyles.title, { marginLeft: 8 }]}>Talleres</Text>
        </View>
        <Text style={commonStyles.textSecondary}>
          {workshopEvents.length} eventos
        </Text>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {workshopEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleFavorite={toggleFavorite}
            onRegister={handleRegister}
          />
        ))}
        
        {workshopEvents.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Icon name="library-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
              No hay talleres disponibles
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkshopScreen;
