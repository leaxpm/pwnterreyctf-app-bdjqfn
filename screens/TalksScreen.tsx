
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import Icon from '../components/Icon';
import { colors, commonStyles } from '../styles/commonStyles';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import EventCard from '../components/EventCard';
import React, { useState } from 'react';

export default function TalksScreen() {
  const { getEventsByType, toggleFavorite, loading, refreshEvents } = useEvents();
  const { userStats, updateStats } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const talks = getEventsByType('Charla');

  const handleRegister = async (eventId: string) => {
    console.log('Registering for talk:', eventId);
    
    const talk = talks.find(e => e.id === eventId);
    if (!talk) return;

    // Update user stats
    const newStats = {
      ...userStats,
      eventsAttended: userStats.eventsAttended + 1,
      pointsEarned: userStats.pointsEarned + 20,
    };
    
    await updateStats(newStats);
  };

  const handleSubscribe = async (eventId: string) => {
    console.log('Subscribing to talk:', eventId);
    await toggleFavorite(eventId);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshEvents();
    setRefreshing(false);
  };

  if (loading && talks.length === 0) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={commonStyles.text}>Cargando charlas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Charlas</Text>
        <Icon name="mic" size={24} color={colors.text} />
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
          {talks.map((talk) => (
            <EventCard
              key={talk.id}
              event={talk}
              onToggleFavorite={handleSubscribe}
              onRegister={handleRegister}
            />
          ))}
          
          {talks.length === 0 && (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60,
            }}>
              <Icon name="mic" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
                No hay charlas disponibles
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
