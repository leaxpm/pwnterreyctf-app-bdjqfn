
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { UserStats } from '../types/Badge';
import BadgeCard from '../components/BadgeCard';
import SimpleBottomSheet from '../components/BottomSheet';
import { useAuth } from '../hooks/useAuth';
import QRCode from 'react-native-qrcode-svg';
import Icon from '../components/Icon';
import { useBadges } from '../hooks/useBadges';
import TopBar from '../components/TopBar';

export default function ProfileScreen() {
  const { user, userStats, updateProfile, updateStats } = useAuth();
  const { badges, userBadges } = useBadges();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [selectedEdition] = useState(2025);

  const earnedBadges = useMemo(() => {
    return badges.filter(badge => userBadges.includes(badge.id));
  }, [badges, userBadges]);

  const availableBadges = useMemo(() => {
    return badges.filter(badge => !userBadges.includes(badge.id));
  }, [badges, userBadges]);

  const handleSaveProfile = useCallback(async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    try {
      await updateProfile({ name: editName.trim() });
      setShowEditProfile(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  }, [editName, updateProfile]);

  if (!user) {
    return (
      <View style={commonStyles.container}>
        <TopBar
          title="Perfil"
          selectedEdition={selectedEdition}
          onEditionChange={() => {}}
          showAdminButton={false}
        />
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={commonStyles.text}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <TopBar
        title="Perfil"
        selectedEdition={selectedEdition}
        onEditionChange={() => {}}
        showAdminButton={false}
      />
      
      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 20 }}>
          {/* Profile Header */}
          <View style={[commonStyles.card, { alignItems: 'center', marginBottom: 20 }]}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: colors.background,
              }}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            
            <Text style={[commonStyles.title, { marginBottom: 4 }]}>
              {user.name || 'Usuario'}
            </Text>
            <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
              {user.email}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[buttonStyles.secondary, buttonStyles.small]}
                onPress={() => {
                  setEditName(user.name || '');
                  setShowEditProfile(true);
                }}
              >
                <Icon name="pencil" size={16} color={colors.text} />
                <Text style={[buttonStyles.secondaryText, buttonStyles.smallText, { marginLeft: 6 }]}>
                  Editar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[buttonStyles.primary, buttonStyles.small]}
                onPress={() => setShowQRCode(true)}
              >
                <Icon name="qr-code" size={16} color={colors.background} />
                <Text style={[buttonStyles.primaryText, buttonStyles.smallText, { marginLeft: 6 }]}>
                  Mi QR
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats */}
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Estadísticas</Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={[commonStyles.title, { color: colors.primary }]}>
                  {userStats.eventsAttended}
                </Text>
                <Text style={commonStyles.textSecondary}>Eventos</Text>
              </View>
              
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={[commonStyles.title, { color: colors.success }]}>
                  {userStats.ctfsCompleted}
                </Text>
                <Text style={commonStyles.textSecondary}>CTFs</Text>
              </View>
              
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={[commonStyles.title, { color: colors.warning }]}>
                  {userStats.workshopsTaken}
                </Text>
                <Text style={commonStyles.textSecondary}>Talleres</Text>
              </View>
              
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={[commonStyles.title, { color: colors.secondary }]}>
                  {userStats.pointsEarned}
                </Text>
                <Text style={commonStyles.textSecondary}>Puntos</Text>
              </View>
            </View>
          </View>

          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Insignias Obtenidas</Text>
              {earnedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} earned={true} />
              ))}
            </View>
          )}

          {/* Available Badges */}
          {availableBadges.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Insignias Disponibles</Text>
              {availableBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} earned={false} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Profile Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 20, textAlign: 'center' }]}>
            Editar Perfil
          </Text>
          
          <Text style={[commonStyles.label, { marginBottom: 8 }]}>Nombre</Text>
          <TextInput
            style={[commonStyles.input, { marginBottom: 20 }]}
            value={editName}
            onChangeText={setEditName}
            placeholder="Ingresa tu nombre"
            autoCapitalize="words"
          />
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={[buttonStyles.secondary, { flex: 1 }]}
              onPress={() => setShowEditProfile(false)}
            >
              <Text style={buttonStyles.secondaryText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, { flex: 1 }]}
              onPress={handleSaveProfile}
            >
              <Text style={buttonStyles.primaryText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>

      {/* QR Code Modal */}
      <Modal
        visible={showQRCode}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQRCode(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: colors.background,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            maxWidth: 300,
            width: '100%',
          }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
              Mi Código QR
            </Text>
            
            <View style={{
              backgroundColor: colors.background,
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
            }}>
              <QRCode
                value={user.id}
                size={200}
                color={colors.text}
                backgroundColor={colors.background}
              />
            </View>
            
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 20 }]}>
              Comparte este código para que otros puedan agregarte
            </Text>
            
            <TouchableOpacity
              style={buttonStyles.primary}
              onPress={() => setShowQRCode(false)}
            >
              <Text style={buttonStyles.primaryText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
