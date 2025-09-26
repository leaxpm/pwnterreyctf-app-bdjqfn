
import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/EventCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';

const FavoritesScreen: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState(2025);
  const { events, toggleFavorite } = useEvents(selectedEdition);
  const favoriteEvents = events.filter(event => event.isFavorite);

  const handleRegister = (eventId: string) => {
    console.log('Registering for favorite event:', eventId);
    // Here you would implement the registration logic
  };

  return (
    <View style={commonStyles.container}>
      <TopBar
        title="Favoritos"
        selectedEdition={selectedEdition}
        onEditionChange={setSelectedEdition}
        showAdminButton={false}
      />
      
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="heart" size={20} color={colors.error} />
            <Text style={[commonStyles.subtitle, { marginLeft: 8 }]}>Eventos Favoritos</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            {favoriteEvents.length} eventos
          </Text>
        </View>
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
            <Icon name="heart-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
              No tienes eventos favoritos
            </Text>
            <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
              Marca eventos como favoritos para verlos aquí
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;
