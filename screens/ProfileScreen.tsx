
import { SafeAreaView } from 'react-native-safe-area-context';
import SimpleBottomSheet from '../components/BottomSheet';
import Icon from '../components/Icon';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, commonStyles, buttonStyles } from '../styles/commonStyles';
import { useBadges } from '../hooks/useBadges';
import { useAuth } from '../hooks/useAuth';
import BadgeCard from '../components/BadgeCard';
import { UserStats } from '../types/Badge';
import React, { useState, useMemo } from 'react';

export default function ProfileScreen() {
  const { user, userStats, updateProfile, updateStats, signIn, signUp, signOut, loading: authLoading } = useAuth();
  const { badges, getUnlockedBadges, getLockedBadges, getBadgeProgress, loading: badgesLoading } = useBadges(userStats);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  
  // Auth form states
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  const unlockedBadges = useMemo(() => getUnlockedBadges(), [badges]);
  const lockedBadges = useMemo(() => getLockedBadges(), [badges]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    const success = await updateProfile({
      name: editedName,
      email: editedEmail,
    });
    
    if (success) {
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      
      // Update profile complete status
      const newStats = {
        ...userStats,
        profileComplete: editedName.trim() !== '' && editedEmail.trim() !== '',
      };
      await updateStats(newStats);
    } else {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setEditedEmail(user?.email || '');
    setIsEditing(false);
  };

  const handleAuth = async () => {
    if (authMode === 'signin') {
      const result = await signIn(authEmail, authPassword);
      if (result.success) {
        setShowBottomSheet(false);
        setAuthEmail('');
        setAuthPassword('');
        Alert.alert('Éxito', result.message);
      } else {
        Alert.alert('Error', result.message);
      }
    } else {
      const result = await signUp(authEmail, authPassword, authName);
      if (result.success) {
        setShowBottomSheet(false);
        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
        Alert.alert('Éxito', result.message);
        if (result.needsVerification) {
          Alert.alert(
            'Verificación requerida', 
            'Hemos enviado un enlace de verificación a tu email. Por favor verifica tu cuenta antes de iniciar sesión.'
          );
        }
      } else {
        Alert.alert('Error', result.message);
      }
    }
  };

  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      Alert.alert('Éxito', 'Sesión cerrada correctamente');
    }
  };

  if (authLoading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={commonStyles.text}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.header}>
          <Text style={commonStyles.title}>Perfil</Text>
        </View>
        
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
          <Icon name="user" size={80} color={colors.textSecondary} />
          <Text style={[commonStyles.title, { marginTop: 20, marginBottom: 10 }]}>
            Inicia Sesión
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginBottom: 30 }]}>
            Inicia sesión para guardar tus favoritos y desbloquear badges
          </Text>
          
          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={() => setShowBottomSheet(true)}
          >
            <Text style={buttonStyles.primaryText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>

        <SimpleBottomSheet
          isVisible={showBottomSheet}
          onClose={() => setShowBottomSheet(false)}
        >
          <View style={{ padding: 20 }}>
            <Text style={[commonStyles.title, { marginBottom: 20 }]}>
              {authMode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Text>
            
            {authMode === 'signup' && (
              <TextInput
                style={[commonStyles.input, { marginBottom: 15 }]}
                placeholder="Nombre"
                value={authName}
                onChangeText={setAuthName}
                placeholderTextColor={colors.textSecondary}
              />
            )}
            
            <TextInput
              style={[commonStyles.input, { marginBottom: 15 }]}
              placeholder="Email"
              value={authEmail}
              onChangeText={setAuthEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />
            
            <TextInput
              style={[commonStyles.input, { marginBottom: 20 }]}
              placeholder="Contraseña"
              value={authPassword}
              onChangeText={setAuthPassword}
              secureTextEntry
              placeholderTextColor={colors.textSecondary}
            />
            
            <TouchableOpacity
              style={buttonStyles.primary}
              onPress={handleAuth}
            >
              <Text style={buttonStyles.primaryText}>
                {authMode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.secondary, { marginTop: 10 }]}
              onPress={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            >
              <Text style={buttonStyles.secondaryText}>
                {authMode === 'signin' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </Text>
            </TouchableOpacity>
          </View>
        </SimpleBottomSheet>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Perfil</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Icon name="log-out" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={commonStyles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={{
          backgroundColor: colors.surface,
          margin: 20,
          padding: 20,
          borderRadius: 16,
          alignItems: 'center',
        }}>
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

          {isEditing ? (
            <View style={{ width: '100%' }}>
              <TextInput
                style={[commonStyles.input, { marginBottom: 12 }]}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Nombre"
                placeholderTextColor={colors.textSecondary}
              />
              <TextInput
                style={[commonStyles.input, { marginBottom: 16 }]}
                value={editedEmail}
                onChangeText={setEditedEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={[buttonStyles.primary, { flex: 1 }]}
                  onPress={handleSaveProfile}
                >
                  <Text style={buttonStyles.primaryText}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[buttonStyles.secondary, { flex: 1 }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={buttonStyles.secondaryText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text style={[commonStyles.title, { marginBottom: 4 }]}>
                {user.name || 'Usuario'}
              </Text>
              <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
                {user.email}
              </Text>
              <TouchableOpacity
                style={buttonStyles.secondary}
                onPress={() => {
                  setEditedName(user.name || '');
                  setEditedEmail(user.email || '');
                  setIsEditing(true);
                }}
              >
                <Icon name="edit-2" size={16} color={colors.text} />
                <Text style={[buttonStyles.secondaryText, { marginLeft: 8 }]}>
                  Editar Perfil
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={{
          backgroundColor: colors.surface,
          margin: 20,
          marginTop: 0,
          padding: 20,
          borderRadius: 16,
        }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Estadísticas
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <View style={{ flex: 1, minWidth: '45%' }}>
              <Text style={commonStyles.textSecondary}>Eventos</Text>
              <Text style={[commonStyles.title, { fontSize: 24 }]}>
                {userStats.eventsAttended}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: '45%' }}>
              <Text style={commonStyles.textSecondary}>CTFs</Text>
              <Text style={[commonStyles.title, { fontSize: 24 }]}>
                {userStats.ctfsCompleted}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: '45%' }}>
              <Text style={commonStyles.textSecondary}>Talleres</Text>
              <Text style={[commonStyles.title, { fontSize: 24 }]}>
                {userStats.workshopsTaken}
              </Text>
            </View>
            <View style={{ flex: 1, minWidth: '45%' }}>
              <Text style={commonStyles.textSecondary}>Puntos</Text>
              <Text style={[commonStyles.title, { fontSize: 24 }]}>
                {userStats.pointsEarned}
              </Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={{
          backgroundColor: colors.surface,
          margin: 20,
          marginTop: 0,
          padding: 20,
          borderRadius: 16,
        }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Badges Desbloqueados ({unlockedBadges.length})
          </Text>
          
          {badgesLoading ? (
            <Text style={commonStyles.textSecondary}>Cargando badges...</Text>
          ) : unlockedBadges.length > 0 ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {unlockedBadges.map((badge) => (
                <View key={badge.id} style={{ width: '48%' }}>
                  <BadgeCard badge={badge} />
                </View>
              ))}
            </View>
          ) : (
            <Text style={commonStyles.textSecondary}>
              Aún no has desbloqueado ningún badge
            </Text>
          )}
        </View>

        {/* Progress Badges */}
        {lockedBadges.length > 0 && (
          <View style={{
            backgroundColor: colors.surface,
            margin: 20,
            marginTop: 0,
            marginBottom: 40,
            padding: 20,
            borderRadius: 16,
          }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              Próximos Badges
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {lockedBadges.slice(0, 4).map((badge) => (
                <View key={badge.id} style={{ width: '48%' }}>
                  <BadgeCard 
                    badge={badge} 
                    progress={getBadgeProgress(badge)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
