
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../hooks/useEvents';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import { View, Text, ScrollView } from 'react-native';
import EventCard from '../components/EventCard';
import React from 'react';

const TalksScreen: React.FC = () => {
  const { getEventsByType, toggleFavorite } = useEvents();
  const talks = getEventsByType('Charla');

  console.log('TalksScreen rendered with talks:', talks.length);

  const handleRegister = (eventId: string) => {
    console.log('Register for talk:', eventId);
    // Aquí podrías agregar lógica adicional para registro
  };

  const handleSubscribe = (eventId: string) => {
    console.log('Subscribe to talk:', eventId);
    toggleFavorite(eventId);
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <View style={commonStyles.header}>
        <View style={commonStyles.headerContent}>
          <Icon name="chatbubbles" size={28} color={colors.accent} />
          <Text style={commonStyles.headerTitle}>Charlas</Text>
        </View>
        <Text style={commonStyles.headerSubtitle}>
          Suscríbete a las charlas que te interesen
        </Text>
      </View>

      <ScrollView 
        style={commonStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {talks.length === 0 ? (
          <View style={commonStyles.emptyState}>
            <Icon name="chatbubbles-outline" size={64} color={colors.textSecondary} />
            <Text style={commonStyles.emptyStateTitle}>No hay charlas disponibles</Text>
            <Text style={commonStyles.emptyStateSubtitle}>
              Las charlas aparecerán aquí cuando estén programadas
            </Text>
          </View>
        ) : (
          <View style={commonStyles.eventList}>
            {talks.map((talk) => (
              <EventCard
                key={talk.id}
                event={talk}
                onToggleFavorite={handleSubscribe}
                onRegister={handleRegister}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TalksScreen;
