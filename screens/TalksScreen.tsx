
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';

interface TalksScreenProps {
  onShowAdmin?: () => void;
}

const TalksScreen: React.FC<TalksScreenProps> = ({ onShowAdmin }) => {
  const [selectedEdition, setSelectedEdition] = useState(2025);
  const { getEventsByType, toggleFavorite } = useEvents(selectedEdition);
  const talkEvents = getEventsByType('Charla');

  const handleRegister = (eventId: string) => {
    console.log('Registering for talk event:', eventId);
    // Here you would implement the registration logic
  };

  const handleAdminPress = () => {
    if (onShowAdmin) {
      onShowAdmin();
    }
  };

  return (
    <View style={commonStyles.container}>
      <TopBar
        title="Charlas"
        selectedEdition={selectedEdition}
        onEditionChange={setSelectedEdition}
        showAdminButton={true}
        onAdminPress={handleAdminPress}
      />
      
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="chatbubbles" size={20} color={colors.charlaTag} />
            <Text style={[commonStyles.subtitle, { marginLeft: 8 }]}>Charlas</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            {talkEvents.length} eventos
          </Text>
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {talkEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleFavorite={toggleFavorite}
            onRegister={handleRegister}
          />
        ))}
        
        {talkEvents.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Icon name="chatbubbles-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
              No hay charlas disponibles
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default TalksScreen;
