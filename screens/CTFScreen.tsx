
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';

const CTFScreen: React.FC = () => {
  const { getEventsByType, toggleFavorite } = useEvents();
  const ctfEvents = getEventsByType('CTF');

  const handleRegister = (eventId: string) => {
    console.log('Registering for CTF event:', eventId);
    // Here you would implement the registration logic
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="flag" size={24} color={colors.ctfTag} />
          <Text style={[commonStyles.title, { marginLeft: 8 }]}>CTFs</Text>
        </View>
        <Text style={commonStyles.textSecondary}>
          {ctfEvents.length} eventos
        </Text>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {ctfEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleFavorite={toggleFavorite}
            onRegister={handleRegister}
          />
        ))}
        
        {ctfEvents.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Icon name="flag-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
              No hay eventos CTF disponibles
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CTFScreen;
