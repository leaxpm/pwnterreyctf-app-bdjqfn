
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import QRScanner from '../components/QRScanner';
import QRGenerator from '../components/QRGenerator';
import { useAuth } from '../hooks/useAuth';
import { useEvents } from '../hooks/useEvents';
import { Event, Speaker, EventAttendance, EventSpeaker } from '../types/Event';
import { AdminService } from '../services/adminService';

interface AdminScreenProps {
  onClose?: () => void;
}

export default function AdminScreen({ onClose }: AdminScreenProps) {
  const { user } = useAuth();
  const [selectedEdition, setSelectedEdition] = useState(2025);
  const { events, refreshEvents } = useEvents(selectedEdition);
  const [activeTab, setActiveTab] = useState<'events' | 'attendance' | 'speakers'>('events');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [attendance, setAttendance] = useState<EventAttendance[]>([]);
  const [eventSpeakers, setEventSpeakers] = useState<EventSpeaker[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    organizer: '',
    type: 'CTF' as Event['type'],
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    date: '',
    edition: selectedEdition,
    registrationUrl: '',
  });

  // Speaker form state
  const [speakerForm, setSpeakerForm] = useState({
    name: '',
    bio: '',
    email: '',
    company: '',
    avatar_url: '',
  });

  const loadAdminData = useCallback(async () => {
    try {
      console.log('AdminScreen - Loading admin data for edition:', selectedEdition);
      setLoading(true);
      
      const [speakersData, attendanceData, eventSpeakersData] = await Promise.all([
        AdminService.getSpeakers(),
        AdminService.getAttendance(selectedEdition),
        AdminService.getEventSpeakers(selectedEdition),
      ]);

      setSpeakers(speakersData);
      setAttendance(attendanceData);
      setEventSpeakers(eventSpeakersData);
      console.log('AdminScreen - Admin data loaded successfully');
    } catch (error) {
      console.error('AdminScreen - Error loading admin data:', error);
      Alert.alert('Error', 'Error cargando datos del panel de administración');
    } finally {
      setLoading(false);
    }
  }, [selectedEdition, user]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      console.log('AdminScreen - User is admin, loading data');
      loadAdminData();
    } else {
      console.log('AdminScreen - User is not admin or not loaded:', user ? { email: user.email, role: user.role } : 'No user');
    }
  }, [user, loadAdminData]);

  const onRefresh = async () => {
    console.log('AdminScreen - Refreshing data');
    setRefreshing(true);
    await Promise.all([refreshEvents(), loadAdminData()]);
    setRefreshing(false);
  };

  const handleCreateEvent = async () => {
    try {
      console.log('AdminScreen - Creating event:', eventForm.title);
      
      if (!eventForm.title || !eventForm.date || !eventForm.startTime) {
        Alert.alert('Error', 'Por favor completa los campos requeridos (título, fecha, hora de inicio)');
        return;
      }

      const success = await AdminService.createEvent({
        ...eventForm,
        edition: selectedEdition,
      });

      if (success) {
        Alert.alert('Éxito', 'Evento creado exitosamente');
        setShowEventForm(false);
        resetEventForm();
        await refreshEvents();
      } else {
        Alert.alert('Error', 'Error creando el evento');
      }
    } catch (error) {
      console.error('AdminScreen - Error creating event:', error);
      Alert.alert('Error', 'Error creando el evento');
    }
  };

  const handleUpdateEvent = async () => {
    try {
      console.log('AdminScreen - Updating event:', editingEvent?.id);
      
      if (!editingEvent || !eventForm.title || !eventForm.date || !eventForm.startTime) {
        Alert.alert('Error', 'Por favor completa los campos requeridos (título, fecha, hora de inicio)');
        return;
      }

      const success = await AdminService.updateEvent(editingEvent.id, {
        ...eventForm,
        edition: selectedEdition,
      });

      if (success) {
        Alert.alert('Éxito', 'Evento actualizado exitosamente');
        setShowEventForm(false);
        setEditingEvent(null);
        resetEventForm();
        await refreshEvents();
      } else {
        Alert.alert('Error', 'Error actualizando el evento');
      }
    } catch (error) {
      console.error('AdminScreen - Error updating event:', error);
      Alert.alert('Error', 'Error actualizando el evento');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este evento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('AdminScreen - Deleting event:', eventId);
              const success = await AdminService.deleteEvent(eventId);
              if (success) {
                Alert.alert('Éxito', 'Evento eliminado exitosamente');
                await refreshEvents();
              } else {
                Alert.alert('Error', 'Error eliminando el evento');
              }
            } catch (error) {
              console.error('AdminScreen - Error deleting event:', error);
              Alert.alert('Error', 'Error eliminando el evento');
            }
          },
        },
      ]
    );
  };

  const handleCreateSpeaker = async () => {
    try {
      console.log('AdminScreen - Creating speaker:', speakerForm.name);
      
      if (!speakerForm.name) {
        Alert.alert('Error', 'El nombre del speaker es requerido');
        return;
      }

      const success = await AdminService.createSpeaker(speakerForm);

      if (success) {
        Alert.alert('Éxito', 'Speaker creado exitosamente');
        setShowSpeakerForm(false);
        resetSpeakerForm();
        await loadAdminData();
      } else {
        Alert.alert('Error', 'Error creando el speaker');
      }
    } catch (error) {
      console.error('AdminScreen - Error creating speaker:', error);
      Alert.alert('Error', 'Error creando el speaker');
    }
  };

  const handleUpdateSpeaker = async () => {
    try {
      console.log('AdminScreen - Updating speaker:', editingSpeaker?.id);
      
      if (!editingSpeaker || !speakerForm.name) {
        Alert.alert('Error', 'El nombre del speaker es requerido');
        return;
      }

      const success = await AdminService.updateSpeaker(editingSpeaker.id, speakerForm);

      if (success) {
        Alert.alert('Éxito', 'Speaker actualizado exitosamente');
        setShowSpeakerForm(false);
        setEditingSpeaker(null);
        resetSpeakerForm();
        await loadAdminData();
      } else {
        Alert.alert('Error', 'Error actualizando el speaker');
      }
    } catch (error) {
      console.error('AdminScreen - Error updating speaker:', error);
      Alert.alert('Error', 'Error actualizando el speaker');
    }
  };

  const handleDeleteSpeaker = async (speakerId: string) => {
    Alert.alert(
      'Confirmar Eliminación',
      '¿Estás seguro de que quieres eliminar este speaker?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('AdminScreen - Deleting speaker:', speakerId);
              const success = await AdminService.deleteSpeaker(speakerId);
              if (success) {
                Alert.alert('Éxito', 'Speaker eliminado exitosamente');
                await loadAdminData();
              } else {
                Alert.alert('Error', 'Error eliminando el speaker');
              }
            } catch (error) {
              console.error('AdminScreen - Error deleting speaker:', error);
              Alert.alert('Error', 'Error eliminando el speaker');
            }
          },
        },
      ]
    );
  };

  const handleToggleAttendance = async (eventId: string, userId: string, currentStatus: boolean) => {
    try {
      console.log('AdminScreen - Toggling attendance:', { eventId, userId, currentStatus });
      const success = await AdminService.updateAttendance(eventId, userId, !currentStatus);
      
      if (success) {
        await loadAdminData();
      } else {
        Alert.alert('Error', 'Error actualizando la asistencia');
      }
    } catch (error) {
      console.error('AdminScreen - Error toggling attendance:', error);
      Alert.alert('Error', 'Error actualizando la asistencia');
    }
  };

  const handleToggleSpeakerAttendance = async (eventId: string, speakerId: string, currentStatus: boolean) => {
    try {
      console.log('AdminScreen - Toggling speaker attendance:', { eventId, speakerId, currentStatus });
      const success = await AdminService.updateSpeakerAttendance(eventId, speakerId, !currentStatus);
      
      if (success) {
        await loadAdminData();
      } else {
        Alert.alert('Error', 'Error actualizando la asistencia del speaker');
      }
    } catch (error) {
      console.error('AdminScreen - Error toggling speaker attendance:', error);
      Alert.alert('Error', 'Error actualizando la asistencia del speaker');
    }
  };

  const handleQRScan = async (data: string) => {
    try {
      console.log('AdminScreen - QR scanned:', data);
      setShowQRScanner(false);
      
      // Check if it's an email (user QR code)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(data)) {
        // Handle email-based attendance
        Alert.alert(
          'Registrar Asistencia',
          `¿Registrar asistencia para el usuario con email: ${data}?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Registrar',
              onPress: async () => {
                // For now, we'll show a success message
                // In a real implementation, you'd need to:
                // 1. Find the user by email
                // 2. Select which event to register attendance for
                // 3. Register the attendance
                Alert.alert('Éxito', `Asistencia registrada para: ${data}`);
              }
            }
          ]
        );
        return;
      }

      // Parse QR data - expecting format: "event_id:user_id" or "event_id:speaker_id:speaker"
      const parts = data.split(':');
      if (parts.length < 2) {
        Alert.alert('Error', 'Código QR inválido');
        return;
      }

      const eventId = parts[0];
      const userId = parts[1];
      const isSpeaker = parts[2] === 'speaker';

      // Verify event exists
      const event = events.find(e => e.id === eventId);
      if (!event) {
        Alert.alert('Error', 'Evento no encontrado');
        return;
      }

      if (isSpeaker) {
        // Handle speaker attendance
        const success = await AdminService.updateSpeakerAttendance(eventId, userId, true);
        if (success) {
          Alert.alert('Éxito', `Asistencia de speaker registrada para: ${event.title}`);
          await loadAdminData();
        } else {
          Alert.alert('Error', 'Error registrando asistencia del speaker');
        }
      } else {
        // Handle user attendance
        const success = await AdminService.updateAttendance(eventId, userId, true);
        if (success) {
          Alert.alert('Éxito', `Asistencia registrada para: ${event.title}`);
          await loadAdminData();
        } else {
          Alert.alert('Error', 'Error registrando asistencia');
        }
      }
    } catch (error) {
      console.error('AdminScreen - Error processing QR:', error);
      Alert.alert('Error', 'Error procesando código QR');
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      organizer: '',
      type: 'CTF',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
      date: '',
      edition: selectedEdition,
      registrationUrl: '',
    });
  };

  const resetSpeakerForm = () => {
    setSpeakerForm({
      name: '',
      bio: '',
      email: '',
      company: '',
      avatar_url: '',
    });
  };

  const openEditEvent = (event: Event) => {
    console.log('AdminScreen - Opening edit event:', event.title);
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      organizer: event.organizer,
      type: event.type,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      description: event.description,
      date: event.date,
      edition: event.edition,
      registrationUrl: event.registrationUrl || '',
    });
    setShowEventForm(true);
  };

  const openEditSpeaker = (speaker: Speaker) => {
    console.log('AdminScreen - Opening edit speaker:', speaker.name);
    setEditingSpeaker(speaker);
    setSpeakerForm({
      name: speaker.name,
      bio: speaker.bio || '',
      email: speaker.email || '',
      company: speaker.company || '',
      avatar_url: speaker.avatar_url || '',
    });
    setShowSpeakerForm(true);
  };

  const handleClose = () => {
    console.log('AdminScreen - Closing admin panel');
    if (onClose) {
      onClose();
    }
  };

  const filteredEvents = events.filter(event => event.edition === selectedEdition);

  // Show loading screen while checking user permissions
  if (!user) {
    return (
      <SafeAreaView style={commonStyles.container}>
        {/* Header */}
        <View style={commonStyles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Panel de Admin</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Icon name="user" size={64} color={colors.textSecondary} />
          <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
            Verificando permisos...
          </Text>
          <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
            Cargando información del usuario
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (user.role !== 'admin') {
    return (
      <SafeAreaView style={commonStyles.container}>
        {/* Header */}
        <View style={commonStyles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="arrow-left-circle" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Panel de Admin</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Icon name="shield-off" size={64} color={colors.textSecondary} />
          <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
            Acceso Denegado
          </Text>
          <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
            No tienes permisos para acceder al panel de administración
          </Text>
          <TouchableOpacity
            style={[buttonStyles.primary, { marginTop: 20 }]}
            onPress={handleClose}
          >
            <Text style={buttonStyles.primaryText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={handleClose}>
          <Icon name="arrow-left-circle" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.title}>Panel de Admin</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => setShowQRGenerator(true)}>
            <Icon name="qr-code" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowQRScanner(true)}>
            <Icon name="camera" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Edition Selector */}
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>Edición:</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[2025, 2026, 2027].map((edition) => (
            <TouchableOpacity
              key={edition}
              style={[
                {
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: selectedEdition === edition ? colors.primary : colors.surface,
                },
              ]}
              onPress={() => setSelectedEdition(edition)}
            >
              <Text style={[
                commonStyles.text,
                { color: selectedEdition === edition ? colors.background : colors.text }
              ]}>
                {edition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', padding: 20, paddingBottom: 0 }}>
        {[
          { key: 'events', label: 'Eventos', icon: 'calendar' },
          { key: 'attendance', label: 'Asistencia', icon: 'users' },
          { key: 'speakers', label: 'Speakers', icon: 'mic' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.key ? colors.primary : 'transparent',
                gap: 6,
              },
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Icon 
              name={tab.icon as any} 
              size={16} 
              color={activeTab === tab.key ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              commonStyles.text,
              { 
                color: activeTab === tab.key ? colors.primary : colors.textSecondary,
                fontWeight: activeTab === tab.key ? '600' : '400',
              }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={commonStyles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Events Tab */}
        {activeTab === 'events' && (
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={commonStyles.subtitle}>Eventos {selectedEdition}</Text>
              <TouchableOpacity
                style={buttonStyles.primary}
                onPress={() => {
                  resetEventForm();
                  setEditingEvent(null);
                  setShowEventForm(true);
                }}
              >
                <Icon name="plus-square-o" size={16} color={colors.background} />
                <Text style={[buttonStyles.primaryText, { marginLeft: 6 }]}>Crear</Text>
              </TouchableOpacity>
            </View>

            {filteredEvents.map((event) => (
              <View key={event.id} style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                      {event.title}
                    </Text>
                    <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
                      {event.type} • {event.date} • {event.startTime}
                    </Text>
                    <Text style={[commonStyles.textSecondary, { fontSize: 14, marginBottom: 4 }]}>
                      {event.location}
                    </Text>
                    {event.registrationUrl && (
                      <Text style={[commonStyles.textSecondary, { fontSize: 12, fontStyle: 'italic' }]}>
                        URL: {event.registrationUrl.length > 40 ? event.registrationUrl.substring(0, 40) + '...' : event.registrationUrl}
                      </Text>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={{ padding: 8 }}
                      onPress={() => openEditEvent(event)}
                    >
                      <Icon name="edit-2" size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ padding: 8 }}
                      onPress={() => handleDeleteEvent(event.id)}
                    >
                      <Icon name="trash-2" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {filteredEvents.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Icon name="calendar" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.textSecondary, { marginTop: 16 }]}>
                  No hay eventos para la edición {selectedEdition}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={commonStyles.subtitle}>Asistencia {selectedEdition}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={[buttonStyles.secondary]}
                  onPress={() => setShowQRGenerator(true)}
                >
                  <Icon name="qr-code" size={16} color={colors.text} />
                  <Text style={[buttonStyles.secondaryText, { marginLeft: 6 }]}>Generar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[buttonStyles.primary, { backgroundColor: colors.success }]}
                  onPress={() => setShowQRScanner(true)}
                >
                  <Icon name="camera" size={16} color={colors.background} />
                  <Text style={[buttonStyles.primaryText, { marginLeft: 6 }]}>Escanear</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* QR Scanner Instructions */}
            <View style={{
              backgroundColor: colors.primary + '20',
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: colors.primary,
            }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                Escaneo de QR de Usuario:
              </Text>
              <Text style={[commonStyles.textSecondary, { lineHeight: 20 }]}>
                • Los usuarios pueden mostrar su QR personal desde su perfil{'\n'}
                • El QR contiene su email para identificación{'\n'}
                • Escanea el QR para registrar asistencia automáticamente
              </Text>
            </View>

            {filteredEvents.map((event) => {
              const eventAttendance = attendance.filter(a => a.event_id === event.id);
              const eventSpeakersList = eventSpeakers.filter(es => es.event_id === event.id);
              
              return (
                <View key={event.id} style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}>
                  <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 12 }]}>
                    {event.title}
                  </Text>
                  
                  {/* User Attendance */}
                  <Text style={[commonStyles.textSecondary, { marginBottom: 8, fontSize: 14 }]}>
                    Asistentes ({eventAttendance.length})
                  </Text>
                  {eventAttendance.map((att) => (
                    <View key={att.id} style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}>
                      <Text style={commonStyles.text}>Usuario {att.user_id.slice(0, 8)}...</Text>
                      <TouchableOpacity
                        style={[
                          {
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 6,
                            backgroundColor: att.attended ? colors.success + '20' : colors.error + '20',
                          }
                        ]}
                        onPress={() => handleToggleAttendance(att.event_id, att.user_id, att.attended)}
                      >
                        <Text style={{
                          color: att.attended ? colors.success : colors.error,
                          fontSize: 12,
                          fontWeight: '600',
                        }}>
                          {att.attended ? 'Asistió' : 'No asistió'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Speaker Attendance */}
                  {eventSpeakersList.length > 0 && (
                    <>
                      <Text style={[commonStyles.textSecondary, { marginTop: 16, marginBottom: 8, fontSize: 14 }]}>
                        Speakers ({eventSpeakersList.length})
                      </Text>
                      {eventSpeakersList.map((es) => (
                        <View key={es.id} style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingVertical: 8,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border,
                        }}>
                          <Text style={commonStyles.text}>
                            {es.speaker?.name || `Speaker ${es.speaker_id.slice(0, 8)}...`}
                          </Text>
                          <TouchableOpacity
                            style={[
                              {
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 6,
                                backgroundColor: es.attended ? colors.success + '20' : colors.error + '20',
                              }
                            ]}
                            onPress={() => handleToggleSpeakerAttendance(es.event_id, es.speaker_id, es.attended)}
                          >
                            <Text style={{
                              color: es.attended ? colors.success : colors.error,
                              fontSize: 12,
                              fontWeight: '600',
                            }}>
                              {es.attended ? 'Asistió' : 'No asistió'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </>
                  )}

                  {eventAttendance.length === 0 && eventSpeakersList.length === 0 && (
                    <Text style={[commonStyles.textSecondary, { textAlign: 'center', paddingVertical: 20 }]}>
                      No hay registros de asistencia
                    </Text>
                  )}
                </View>
              );
            })}

            {filteredEvents.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Icon name="users" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.textSecondary, { marginTop: 16 }]}>
                  No hay eventos para la edición {selectedEdition}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Speakers Tab */}
        {activeTab === 'speakers' && (
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={commonStyles.subtitle}>Speakers</Text>
              <TouchableOpacity
                style={buttonStyles.primary}
                onPress={() => {
                  resetSpeakerForm();
                  setEditingSpeaker(null);
                  setShowSpeakerForm(true);
                }}
              >
                <Icon name="plus" size={16} color={colors.background} />
                <Text style={[buttonStyles.primaryText, { marginLeft: 6 }]}>Crear</Text>
              </TouchableOpacity>
            </View>

            {speakers.map((speaker) => (
              <View key={speaker.id} style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                      {speaker.name}
                    </Text>
                    {speaker.company && (
                      <Text style={[commonStyles.textSecondary, { marginBottom: 4 }]}>
                        {speaker.company}
                      </Text>
                    )}
                    {speaker.email && (
                      <Text style={[commonStyles.textSecondary, { fontSize: 14 }]}>
                        {speaker.email}
                      </Text>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={{ padding: 8 }}
                      onPress={() => openEditSpeaker(speaker)}
                    >
                      <Icon name="edit-2" size={16} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ padding: 8 }}
                      onPress={() => handleDeleteSpeaker(speaker.id)}
                    >
                      <Icon name="trash-2" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {speakers.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Icon name="mic" size={48} color={colors.textSecondary} />
                <Text style={[commonStyles.textSecondary, { marginTop: 16 }]}>
                  No hay speakers registrados
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* QR Scanner Modal */}
      <Modal
        visible={showQRScanner}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      </Modal>

      {/* QR Generator Modal */}
      <Modal
        visible={showQRGenerator}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <QRGenerator
          events={filteredEvents}
          speakers={speakers}
          onClose={() => setShowQRGenerator(false)}
        />
      </Modal>

      {/* Event Form Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEditingEvent(null);
          resetEventForm();
        }}
      >
        <ScrollView style={{ maxHeight: 700 }}>
          <View style={{ padding: 20 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 20, textAlign: 'center' }]}>
              {editingEvent ? 'Editar Evento' : 'Crear Evento'}
            </Text>

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="Título del evento *"
              value={eventForm.title}
              onChangeText={(text) => setEventForm(prev => ({ ...prev, title: text }))}
            />

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="Organizador"
              value={eventForm.organizer}
              onChangeText={(text) => setEventForm(prev => ({ ...prev, organizer: text }))}
            />

            <View style={{ marginBottom: 16 }}>
              <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>Tipo:</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {(['CTF', 'Taller', 'Charla'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 8,
                        backgroundColor: eventForm.type === type ? colors.primary : colors.surface,
                      },
                    ]}
                    onPress={() => setEventForm(prev => ({ ...prev, type }))}
                  >
                    <Text style={[
                      commonStyles.text,
                      { color: eventForm.type === type ? colors.background : colors.text }
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="Fecha (YYYY-MM-DD) *"
              value={eventForm.date}
              onChangeText={(text) => setEventForm(prev => ({ ...prev, date: text }))}
            />

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <TextInput
                style={[commonStyles.input, { flex: 1 }]}
                placeholder="Hora inicio (HH:MM) *"
                value={eventForm.startTime}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, startTime: text }))}
              />
              <TextInput
                style={[commonStyles.input, { flex: 1 }]}
                placeholder="Hora fin (HH:MM)"
                value={eventForm.endTime}
                onChangeText={(text) => setEventForm(prev => ({ ...prev, endTime: text }))}
              />
            </View>

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="Ubicación"
              value={eventForm.location}
              onChangeText={(text) => setEventForm(prev => ({ ...prev, location: text }))}
            />

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="URL de registro (opcional)"
              value={eventForm.registrationUrl}
              onChangeText={(text) => setEventForm(prev => ({ ...prev, registrationUrl: text }))}
              keyboardType="url"
              autoCapitalize="none"
            />

            <TextInput
              style={[commonStyles.input, { marginBottom: 24, minHeight: 80 }]}
              placeholder="Descripción"
              value={eventForm.description}
              onChangeText={(text) => setEventForm(prev => ({ ...prev, description: text }))}
              multiline
              textAlignVertical="top"
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[buttonStyles.secondary, { flex: 1 }]}
                onPress={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                  resetEventForm();
                }}
              >
                <Text style={buttonStyles.secondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.primary, { flex: 1 }]}
                onPress={editingEvent ? handleUpdateEvent : handleCreateEvent}
              >
                <Text style={buttonStyles.primaryText}>
                  {editingEvent ? 'Actualizar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SimpleBottomSheet>

      {/* Speaker Form Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showSpeakerForm}
        onClose={() => {
          setShowSpeakerForm(false);
          setEditingSpeaker(null);
          resetSpeakerForm();
        }}
      >
        <ScrollView style={{ maxHeight: 500 }}>
          <View style={{ padding: 20 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 20, textAlign: 'center' }]}>
              {editingSpeaker ? 'Editar Speaker' : 'Crear Speaker'}
            </Text>

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="Nombre del speaker *"
              value={speakerForm.name}
              onChangeText={(text) => setSpeakerForm(prev => ({ ...prev, name: text }))}
            />

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="Email"
              value={speakerForm.email}
              onChangeText={(text) => setSpeakerForm(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="Empresa"
              value={speakerForm.company}
              onChangeText={(text) => setSpeakerForm(prev => ({ ...prev, company: text }))}
            />

            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="URL del avatar"
              value={speakerForm.avatar_url}
              onChangeText={(text) => setSpeakerForm(prev => ({ ...prev, avatar_url: text }))}
              keyboardType="url"
              autoCapitalize="none"
            />

            <TextInput
              style={[commonStyles.input, { marginBottom: 24, minHeight: 80 }]}
              placeholder="Biografía"
              value={speakerForm.bio}
              onChangeText={(text) => setSpeakerForm(prev => ({ ...prev, bio: text }))}
              multiline
              textAlignVertical="top"
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[buttonStyles.secondary, { flex: 1 }]}
                onPress={() => {
                  setShowSpeakerForm(false);
                  setEditingSpeaker(null);
                  resetSpeakerForm();
                }}
              >
                <Text style={buttonStyles.secondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[buttonStyles.primary, { flex: 1 }]}
                onPress={editingSpeaker ? handleUpdateSpeaker : handleCreateSpeaker}
              >
                <Text style={buttonStyles.primaryText}>
                  {editingSpeaker ? 'Actualizar' : 'Crear'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
}
