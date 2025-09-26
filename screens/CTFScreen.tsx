
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { router } from 'expo-router';

const CTFScreen: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState(2025);
  const { getEventsByType, toggleFavorite } = useEvents(selectedEdition);
  const ctfEvents = getEventsByType('CTF');

  const handleRegister = (eventId: string) => {
    console.log('Registering for CTF event:', eventId);
    // Here you would implement the registration logic
  };

  const handleAdminPress = () => {
    if (onShowAdmin) {
      onShowAdmin();
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <TopBar
        title="CTFs"
        selectedEdition={selectedEdition}
        onEditionChange={setSelectedEdition}
        showAdminButton={true}
        onAdminPress={handleAdminPress}
      />
      
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="flag" size={20} color={colors.ctfTag} />
            <Text style={[commonStyles.subtitle, { marginLeft: 8 }]}>Eventos CTF</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            {ctfEvents.length} eventos
          </Text>
        </View>
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
