
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

  const handleRegister = (eventId: string) => {
    console.log('Registering for favorite event:', eventId);
    // Here you would implement the registration logic
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="star" size={24} color="#FFD700" />
          <Text style={[commonStyles.title, { marginLeft: 8 }]}>Favoritos</Text>
        </View>
        <Text style={commonStyles.textSecondary}>
          {favoriteEvents.length} eventos
        </Text>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {favoriteEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleFavorite={toggleFavorite}
            onRegister={handleRegister}
          />
        ))}
        
        {favoriteEvents.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Icon name="star-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
              No tienes eventos favoritos
            </Text>
            <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
              Marca eventos como favoritos para verlos aquí
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FavoritesScreen;
