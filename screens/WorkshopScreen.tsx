
import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { useEvents } from '../hooks/useEvents';
import { EventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import TopBar from '../components/TopBar';
import Icon from '../components/Icon';

interface WorkshopScreenProps {
  onShowAdmin?: () => void;
}

const WorkshopScreen: React.FC<WorkshopScreenProps> = ({ onShowAdmin }) => {
  const [selectedEdition, setSelectedEdition] = useState(2025);
  const { getEventsByType, toggleFavorite } = useEvents(selectedEdition);
  const workshopEvents = [...getEventsByType('Taller'), ...getEventsByType('Charla')];

  const handleRegister = async (eventId: string) => {
    try {
      console.log('Registering for workshop event:', eventId);
      
      // Fetch event details from database using eventId
      const event = await EventService.getEvent(eventId);

      if (event && event.registrationUrl) {
        console.log('Opening registration URL:', event.registrationUrl);
        
        // Check if the URL can be opened
        const canOpen = await Linking.canOpenURL(event.registrationUrl);
        
        if (canOpen) {
          // Open the URL in the user's default browser
          await Linking.openURL(event.registrationUrl);
        } else {
          Alert.alert(
            "Error de Registro", 
            "No se pudo abrir la URL de registro. Verifica que sea válida."
          );
        }
      } else if (event && !event.registrationUrl) {
        // Handle case where URL is missing
        Alert.alert(
          "Registro No Disponible", 
          "Este evento no tiene una URL de registro configurada. Contacta a los organizadores para más información."
        );
      } else {
        // Handle case where event is not found
        Alert.alert(
          "Error de Registro", 
          "No se pudo encontrar la información del evento."
        );
      }
    } catch (error) {
      // Handle errors during data fetching or URL opening
      console.error("Error during registration:", error);
      Alert.alert(
        "Error de Registro", 
        "Ocurrió un error durante el registro. Inténtalo de nuevo."
      );
    }
  };

  const handleAdminPress = () => {
    if (onShowAdmin) {
      onShowAdmin();
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <TopBar
        title="Talleres"
        selectedEdition={selectedEdition}
        onEditionChange={setSelectedEdition}
        showAdminButton={true}
        onAdminPress={handleAdminPress}
      />
      
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="library" size={20} color={colors.tallerTag} />
            <Text style={[commonStyles.subtitle, { marginLeft: 8 }]}>Talleres y Charlas</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            {workshopEvents.length} eventos
          </Text>
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {workshopEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onToggleFavorite={toggleFavorite}
            onRegister={handleRegister}
          />
        ))}
        
        {workshopEvents.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Icon name="library-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginTop: 16, textAlign: 'center' }]}>
              No hay talleres disponibles
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkshopScreen;
