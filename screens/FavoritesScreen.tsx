
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import Icon from '../components/Icon';

const FavoritesScreen: React.FC = () => {
  const { getFavoriteEvents, toggleFavorite } = useEvents();
  const favoriteEvents = getFavoriteEvents();

  console.log('FavoritesScreen rendered with favorites:', favoriteEvents.length);

  const handleRegister = (eventId: string) => {
    console.log('Registering for favorite event:', eventId);
    // Here you would implement the registration logic
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <View style={commonStyles.header}>
        <View style={commonStyles.headerContent}>
          <Icon name="star" size={28} color="#FFD700" />
          <Text style={commonStyles.headerTitle}>Favoritos</Text>
        </View>
        <Text style={commonStyles.headerSubtitle}>
          {favoriteEvents.length} eventos guardados
        </Text>
      </View>

      <ScrollView 
        style={commonStyles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {favoriteEvents.length === 0 ? (
          <View style={commonStyles.emptyState}>
            <Icon name="star-outline" size={64} color={colors.textSecondary} />
            <Text style={commonStyles.emptyStateTitle}>No tienes eventos favoritos</Text>
            <Text style={commonStyles.emptyStateSubtitle}>
              Marca eventos como favoritos para verlos aquí.{'\n'}
              Para charlas, usa el botón "Suscribirse" para agregarlas a favoritos.
            </Text>
          </View>
        ) : (
          <View style={commonStyles.eventList}>
            {favoriteEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onToggleFavorite={toggleFavorite}
                onRegister={handleRegister}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;
