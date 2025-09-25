
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import { Event, Speaker } from '../types/Event';
import { AdminService } from '../services/adminService';

interface QRGeneratorProps {
  events: Event[];
  speakers: Speaker[];
  onClose: () => void;
}

export default function QRGenerator({ events, speakers, onClose }: QRGeneratorProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [qrType, setQrType] = useState<'user' | 'speaker'>('user');
  const [userId, setUserId] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [generatedQR, setGeneratedQR] = useState<string>('');

  const handleGenerateQR = () => {
    if (!selectedEvent) {
      Alert.alert('Error', 'Selecciona un evento');
      return;
    }

    let qrData = '';
    
    if (qrType === 'user') {
      if (!userId.trim()) {
        Alert.alert('Error', 'Ingresa el ID del usuario');
        return;
      }
      qrData = AdminService.generateAttendanceQR(selectedEvent.id, userId.trim());
    } else {
      if (!selectedSpeaker) {
        Alert.alert('Error', 'Selecciona un speaker');
        return;
      }
      qrData = AdminService.generateSpeakerAttendanceQR(selectedEvent.id, selectedSpeaker.id);
    }

    setGeneratedQR(qrData);
  };

  const handleCopyQR = () => {
    if (generatedQR) {
      // In a real app, you would copy to clipboard
      Alert.alert('QR Copiado', `Datos del QR: ${generatedQR}`);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={commonStyles.header}>
        <TouchableOpacity onPress={onClose}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.title}>Generar QR</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {/* Event Selection */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>Seleccionar Evento:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={[
                    {
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 8,
                      backgroundColor: selectedEvent?.id === event.id ? colors.primary : colors.surface,
                      minWidth: 120,
                    },
                  ]}
                  onPress={() => setSelectedEvent(event)}
                >
                  <Text style={[
                    commonStyles.text,
                    { 
                      color: selectedEvent?.id === event.id ? colors.background : colors.text,
                      fontSize: 14,
                      textAlign: 'center',
                    }
                  ]}>
                    {event.title}
                  </Text>
                  <Text style={[
                    commonStyles.textSecondary,
                    { 
                      color: selectedEvent?.id === event.id ? colors.background + '80' : colors.textSecondary,
                      fontSize: 12,
                      textAlign: 'center',
                      marginTop: 4,
                    }
                  ]}>
                    {event.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* QR Type Selection */}
        <View style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>Tipo de QR:</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: qrType === 'user' ? colors.primary : colors.surface,
                },
              ]}
              onPress={() => setQrType('user')}
            >
              <Text style={[
                commonStyles.text,
                { 
                  color: qrType === 'user' ? colors.background : colors.text,
                  textAlign: 'center',
                }
              ]}>
                Usuario
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                {
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  backgroundColor: qrType === 'speaker' ? colors.primary : colors.surface,
                },
              ]}
              onPress={() => setQrType('speaker')}
            >
              <Text style={[
                commonStyles.text,
                { 
                  color: qrType === 'speaker' ? colors.background : colors.text,
                  textAlign: 'center',
                }
              ]}>
                Speaker
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* User ID Input */}
        {qrType === 'user' && (
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>ID del Usuario:</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Ingresa el ID del usuario"
              value={userId}
              onChangeText={setUserId}
            />
          </View>
        )}

        {/* Speaker Selection */}
        {qrType === 'speaker' && (
          <View style={{ marginBottom: 24 }}>
            <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>Seleccionar Speaker:</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {speakers.map((speaker) => (
                <TouchableOpacity
                  key={speaker.id}
                  style={[
                    {
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: selectedSpeaker?.id === speaker.id ? colors.primary + '20' : colors.surface,
                      marginBottom: 8,
                      borderWidth: selectedSpeaker?.id === speaker.id ? 2 : 0,
                      borderColor: selectedSpeaker?.id === speaker.id ? colors.primary : 'transparent',
                    },
                  ]}
                  onPress={() => setSelectedSpeaker(speaker)}
                >
                  <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                    {speaker.name}
                  </Text>
                  {speaker.company && (
                    <Text style={[commonStyles.textSecondary, { fontSize: 14, marginTop: 4 }]}>
                      {speaker.company}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Generate Button */}
        <TouchableOpacity
          style={[buttonStyles.primary, { marginBottom: 24 }]}
          onPress={handleGenerateQR}
        >
          <Icon name="qr-code" size={16} color={colors.background} />
          <Text style={[buttonStyles.primaryText, { marginLeft: 8 }]}>Generar QR</Text>
        </TouchableOpacity>

        {/* Generated QR Display */}
        {generatedQR && (
          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 20,
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Icon name="qr-code" size={64} color={colors.primary} />
            <Text style={[commonStyles.text, { marginTop: 16, fontWeight: '600' }]}>
              QR Generado
            </Text>
            <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
              Datos: {generatedQR}
            </Text>
            <TouchableOpacity
              style={[buttonStyles.secondary, { marginTop: 16 }]}
              onPress={handleCopyQR}
            >
              <Icon name="copy" size={16} color={colors.text} />
              <Text style={[buttonStyles.secondaryText, { marginLeft: 8 }]}>Copiar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Instructions */}
        <View style={{
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}>
          <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
            Instrucciones:
          </Text>
          <Text style={[commonStyles.textSecondary, { lineHeight: 20 }]}>
            1. Selecciona el evento para el cual generar el QR{'\n'}
            2. Elige si es para un usuario o speaker{'\n'}
            3. Ingresa los datos correspondientes{'\n'}
            4. Genera el código QR{'\n'}
            5. Usa el escáner QR en la pestaña de Asistencia para registrar la asistencia
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
