
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';
import BadgeCard from '../components/BadgeCard';
import { useBadges } from '../hooks/useBadges';
import { UserStats } from '../types/Badge';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState({
    name: 'Usuario Anónimo',
    email: '',
    team: '',
    experience: 'Principiante',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempUser, setTempUser] = useState(user);

  // Mock user stats - in a real app, these would come from the database
  const [userStats] = useState<UserStats>({
    eventsAttended: 0,
    ctfsCompleted: 0,
    workshopsTaken: 0,
    pointsEarned: 0,
    profileComplete: false,
  });

  // Update profile completion status based on user data
  const updatedUserStats = useMemo<UserStats>(() => {
    const isProfileComplete = !!(user.name && user.name !== 'Usuario Anónimo' && user.email && user.team);
    return {
      ...userStats,
      profileComplete: isProfileComplete,
    };
  }, [user, userStats]);

  const { badges, getUnlockedBadges, getLockedBadges, getBadgeProgress } = useBadges(updatedUserStats);

  const handleSaveProfile = () => {
    console.log('Saving profile:', tempUser);
    setUser(tempUser);
    setIsEditingProfile(false);
    Alert.alert('Perfil actualizado', 'Tu perfil ha sido guardado exitosamente');
  };

  const handleCancelEdit = () => {
    setTempUser(user);
    setIsEditingProfile(false);
  };

  const stats = [
    { label: 'Eventos asistidos', value: updatedUserStats.eventsAttended.toString() },
    { label: 'CTFs completados', value: updatedUserStats.ctfsCompleted.toString() },
    { label: 'Talleres tomados', value: updatedUserStats.workshopsTaken.toString() },
    { label: 'Puntos totales', value: updatedUserStats.pointsEarned.toString() },
  ];

  const unlockedBadges = getUnlockedBadges();
  const lockedBadges = getLockedBadges();

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="person" size={24} color={colors.accent} />
          <Text style={[commonStyles.title, { marginLeft: 8 }]}>Perfil</Text>
        </View>
        <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
          <Icon name="create-outline" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.card, { alignItems: 'center', marginBottom: 16 }]}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.accent,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Icon name="person" size={40} color={colors.background} />
          </View>
          <Text style={[commonStyles.title, { fontSize: 20, marginBottom: 4 }]}>
            {user.name}
          </Text>
          {user.email && (
            <Text style={commonStyles.textSecondary}>{user.email}</Text>
          )}
          {user.team && (
            <Text style={[commonStyles.textSecondary, { marginTop: 4 }]}>
              Equipo: {user.team}
            </Text>
          )}
          <View style={[commonStyles.tag, { backgroundColor: colors.accent, marginTop: 8 }]}>
            <Text style={commonStyles.tagText}>{user.experience}</Text>
          </View>
        </View>

        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Estadísticas</Text>
          {stats.map((stat, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 8,
              borderBottomWidth: index < stats.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}>
              <Text style={commonStyles.text}>{stat.label}</Text>
              <Text style={[commonStyles.text, { fontWeight: '600' }]}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* Badges Section */}
        <View style={commonStyles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Icon name="medal" size={20} color={colors.accent} />
            <Text style={[commonStyles.subtitle, { marginLeft: 8 }]}>
              Insignias ({unlockedBadges.length}/{badges.length})
            </Text>
          </View>
          
          {unlockedBadges.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                Desbloqueadas
              </Text>
              {unlockedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </View>
          )}
          
          {lockedBadges.length > 0 && (
            <View>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 8 }]}>
                Por desbloquear
              </Text>
              {lockedBadges.slice(0, 4).map((badge) => (
                <BadgeCard 
                  key={badge.id} 
                  badge={badge} 
                  progress={getBadgeProgress(badge)}
                />
              ))}
              {lockedBadges.length > 4 && (
                <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
                  +{lockedBadges.length - 4} insignias más por desbloquear
                </Text>
              )}
            </View>
          )}
          
          {badges.length === 0 && (
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', fontStyle: 'italic' }]}>
              No hay insignias disponibles
            </Text>
          )}
        </View>

        <View style={commonStyles.card}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Configuración</Text>
          
          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
            <Icon name="notifications-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12, flex: 1 }]}>
              Notificaciones
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}>
            <Icon name="shield-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12, flex: 1 }]}>
              Privacidad
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
          }}>
            <Icon name="help-circle-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12, flex: 1 }]}>
              Ayuda y soporte
            </Text>
            <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SimpleBottomSheet
        isVisible={isEditingProfile}
        onClose={handleCancelEdit}
      >
        <View style={{ padding: 20 }}>
          <Text style={[commonStyles.title, { marginBottom: 20 }]}>Editar Perfil</Text>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Nombre</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: colors.text,
              }}
              value={tempUser.name}
              onChangeText={(text) => setTempUser({ ...tempUser, name: text })}
              placeholder="Tu nombre"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Email</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: colors.text,
              }}
              value={tempUser.email}
              onChangeText={(text) => setTempUser({ ...tempUser, email: text })}
              placeholder="tu@email.com"
              keyboardType="email-address"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8 }]}>Equipo</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
                color: colors.text,
              }}
              value={tempUser.team}
              onChangeText={(text) => setTempUser({ ...tempUser, team: text })}
              placeholder="Nombre de tu equipo"
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
            <TouchableOpacity
              style={[buttonStyles.secondary, { flex: 1 }]}
              onPress={handleCancelEdit}
            >
              <Text style={[commonStyles.text, { textAlign: 'center' }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[buttonStyles.primary, { flex: 1 }]}
              onPress={handleSaveProfile}
            >
              <Text style={[commonStyles.text, { color: colors.background, textAlign: 'center' }]}>
                Guardar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SimpleBottomSheet>
    </SafeAreaView>
  );
};

export default ProfileScreen;
