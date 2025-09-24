
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import EventCard from '../components/EventCard';
import React, { useState } from 'react';

export default function FavoritesScreen() {
  const { getFavoriteEvents, toggleFavorite, loading, refreshEvents } = useEvents();
  const { userStats, updateStats } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const favoriteEvents = getFavoriteEvents();

  const handleRegister = async (eventId: string) => {
    console.log('Registering for event:', eventId);
    
    const event = favoriteEvents.find(e => e.id === eventId);
    if (!event) return;

    // Update user stats based on event type
    const newStats = { ...userStats };
    
    switch (event.type) {
      case 'CTF':
        newStats.ctfsCompleted += 1;
        newStats.pointsEarned += 50;
        break;
      case 'Taller':
        newStats.workshopsTaken += 1;
        newStats.pointsEarned += 30;
        break;
      case 'Charla':
        newStats.pointsEarned += 20;
        break;
    }
    
    newStats.eventsAttended += 1;
    
    await updateStats(newStats);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshEvents();
    setRefreshing(false);
  };

  if (loading && favoriteEvents.length === 0) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={commonStyles.text}>Cargando favoritos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Favoritos</Text>
        <Icon name="heart" size={24} color={colors.primary} />
      </View>

      <ScrollView 
        style={commonStyles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={{ padding: 20 }}>
          {favoriteEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onToggleFavorite={toggleFavorite}
              onRegister={handleRegister}
            />
          ))}
          
          {favoriteEvents.length === 0 && (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60,
            }}>
              <Icon name="heart" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
                No tienes eventos favoritos
              </Text>
              <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
                Marca eventos como favoritos para verlos aquí
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
