
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../types/Event';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface EventCardProps {
  event: Event;
  onToggleFavorite: (eventId: string) => void;
  onRegister?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onToggleFavorite, onRegister }) => {
  const getTagStyle = (type: Event['type']) => {
    switch (type) {
      case 'CTF':
        return [commonStyles.tag, commonStyles.ctfTag];
      case 'Taller':
        return [commonStyles.tag, commonStyles.tallerTag];
      case 'Charla':
        return [commonStyles.tag, commonStyles.charlaTag];
      default:
        return [commonStyles.tag, commonStyles.ctfTag];
    }
  };

  const handleRegister = () => {
    console.log('Register button pressed for event:', event.id);
    if (onRegister) {
      onRegister(event.id);
    }
  };

  const handleToggleFavorite = () => {
    console.log('Favorite button pressed for event:', event.id);
    onToggleFavorite(event.id);
  };

  return (
    <View style={commonStyles.card}>
      <View style={styles.header}>
        <View style={styles.leftContent}>
          <View style={styles.avatar} />
          <View style={styles.eventInfo}>
            <Text style={styles.title}>{event.title}</Text>
            <Text style={commonStyles.textSecondary}>{event.organizer}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={commonStyles.favoriteButton}
          onPress={handleToggleFavorite}
        >
          <Icon 
            name={event.isFavorite ? "star" : "star-outline"} 
            size={24} 
            color={event.isFavorite ? "#FFD700" : colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      <View style={getTagStyle(event.type)}>
        <Text style={commonStyles.tagText}>{event.type}</Text>
      </View>

      <View style={styles.timeLocation}>
        <View style={styles.timeInfo}>
          <Icon name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
            {event.startTime} - {event.endTime}
          </Text>
        </View>
        <View style={styles.locationInfo}>
          <Icon name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
            {event.location}
          </Text>
        </View>
      </View>

      <Text style={[commonStyles.text, { marginVertical: 8 }]}>
        {event.description}
      </Text>

      <View style={styles.footer}>
        <Text style={commonStyles.textSecondary}>{event.date}</Text>
        <TouchableOpacity 
          style={commonStyles.registerButton}
          onPress={handleRegister}
        >
          <Icon name="open-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftContent: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  timeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 16,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});

export default EventCard;
