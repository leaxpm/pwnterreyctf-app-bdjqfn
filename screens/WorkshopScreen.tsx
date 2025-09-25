
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { router } from 'expo-router';

const WorkshopScreen: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState(2025);
  const { getEventsByType, toggleFavorite } = useEvents(selectedEdition);
  const workshopEvents = [...getEventsByType('Taller'), ...getEventsByType('Charla')];

  const handleRegister = (eventId: string) => {
    console.log('Registering for workshop event:', eventId);
    // Here you would implement the registration logic
  };

  const handleAdminPress = () => {
    router.push('/admin');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <TopBar
        title="Talleres"
        selectedEdition={selectedEdition}
        onEditionChange={setSelectedEdition}
        showAdminButton={true}
        onAdminPress={handleAdminPress}
      />
      
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="library" size={20} color={colors.tallerTag} />
            <Text style={[commonStyles.subtitle, { marginLeft: 8 }]}>Talleres y Charlas</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            {workshopEvents.length} eventos
          </Text>
        </View>
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
