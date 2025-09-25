
import React, { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import FilterTabs from '../components/FilterTabs';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../hooks/useAuth';
import EventCard from '../components/EventCard';

interface HomeScreenProps {
  onShowAdmin?: () => void;
}

export default function HomeScreen({ onShowAdmin }: HomeScreenProps) {
  const [selectedEdition, setSelectedEdition] = useState(2025);
  const { events, toggleFavorite, loading, error, refreshEvents } = useEvents(selectedEdition);
  const { user, userStats, updateStats } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [refreshing, setRefreshing] = useState(false);

  console.log('HomeScreen - Rendered with:', {
    selectedEdition,
    eventsCount: events.length,
    loading,
    error,
    activeFilter,
    user: user ? { id: user.id, email: user.email, role: user.role } : null
  });

  const filters = [
    { key: 'Todos', label: 'Todos' },
    { key: 'CTF', label: 'CTF' },
    { key: 'Taller', label: 'Taller' },
    { key: 'Charla', label: 'Charla' }
  ];

  const getFilteredEvents = () => {
    if (activeFilter === 'Todos') {
      return events;
    }
    return events.filter(event => event.type === activeFilter);
  };

  const handleRegister = async (eventId: string) => {
    console.log('HomeScreen - Registering for event:', eventId);
    
    const event = events.find(e => e.id === eventId);
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
    console.log('HomeScreen - Admin button pressed');
    console.log('HomeScreen - Current user:', user ? { id: user.id, email: user.email, role: user.role } : null);
    console.log('HomeScreen - onShowAdmin callback exists:', !!onShowAdmin);
    
    if (!onShowAdmin) {
      console.log('HomeScreen - ERROR: No onShowAdmin callback provided');
      Alert.alert('Error', 'Función de administración no disponible');
      return;
    }
    
    console.log('HomeScreen - Calling onShowAdmin callback');
    onShowAdmin();
  };

  if (loading && events.length === 0) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={commonStyles.text}>Cargando eventos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <TopBar
        title="PwnterreyCTF"
        selectedEdition={selectedEdition}
        onEditionChange={setSelectedEdition}
        showAdminButton={true}
        onAdminPress={handleAdminPress}
      />

      {/* Debug Info - Remove after testing */}
      {user && (
        <View style={{
          backgroundColor: colors.info + '20',
          margin: 20,
          padding: 12,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: colors.info,
        }}>
          <Text style={{ color: colors.info, fontSize: 12 }}>
            Debug: User {user.email} - Role: {user.role} - ID: {user.id.slice(0, 8)}...
          </Text>
          {user.role === 'admin' && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary,
                padding: 8,
                borderRadius: 6,
                marginTop: 8,
                alignItems: 'center',
              }}
              onPress={() => {
                console.log('DEBUG BUTTON - Direct admin call');
                if (onShowAdmin) {
                  console.log('DEBUG BUTTON - Calling onShowAdmin');
                  onShowAdmin();
                } else {
                  console.log('DEBUG BUTTON - No onShowAdmin callback');
                  Alert.alert('Debug', 'No onShowAdmin callback available');
                }
              }}
            >
              <Text style={{ color: colors.background, fontSize: 12, fontWeight: '600' }}>
                DEBUG: Abrir Admin Panel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {error && (
        <View style={{
          backgroundColor: colors.error + '20',
          margin: 20,
          padding: 12,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: colors.error,
        }}>
          <Text style={{ color: colors.error }}>
            {error}
          </Text>
        </View>
      )}

      <FilterTabs
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

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
        <View style={{ padding: 20, paddingTop: 0 }}>
          {getFilteredEvents().map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onToggleFavorite={toggleFavorite}
              onRegister={handleRegister}
            />
          ))}
          
          {getFilteredEvents().length === 0 && (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60,
            }}>
              <Icon name="calendar" size={48} color={colors.textSecondary} />
              <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
                {activeFilter === 'Todos' 
                  ? 'No hay eventos disponibles'
                  : `No hay eventos de tipo ${activeFilter}`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
