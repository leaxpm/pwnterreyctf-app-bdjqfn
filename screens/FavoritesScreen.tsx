
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import TopBar from '../components/TopBar';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import EventCard from '../components/EventCard';
import React, { useState } from 'react';
import { router } from 'expo-router';

export default function FavoritesScreen() {
  const [selectedEdition, setSelectedEdition] = useState(2025);
  const { getFavoriteEvents, toggleFavorite, loading, refreshEvents } = useEvents(selectedEdition);
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

  const handleAdminPress = () => {
    router.push('/admin');
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
      <TopBar
        title="Favoritos"
        selectedEdition={selectedEdition}
        onEditionChange={setSelectedEdition}
        showAdminButton={true}
        onAdminPress={handleAdminPress}
      />
      
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="heart" size={20} color={colors.primary} />
            <Text style={[commonStyles.subtitle, { marginLeft: 8 }]}>Eventos Favoritos</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            {favoriteEvents.length} eventos
          </Text>
        </View>
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
