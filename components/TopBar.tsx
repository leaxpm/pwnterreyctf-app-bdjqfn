
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';
import SimpleBottomSheet from './BottomSheet';
import { useAuth } from '../hooks/useAuth';

interface TopBarProps {
  title: string;
  selectedEdition: number;
  onEditionChange: (edition: number) => void;
  showAdminButton?: boolean;
  onAdminPress?: () => void;
}

const AVAILABLE_EDITIONS = [2025, 2026, 2027];

export default function TopBar({ 
  title, 
  selectedEdition, 
  onEditionChange, 
  showAdminButton = false,
  onAdminPress 
}: TopBarProps) {
  const [showEditionPicker, setShowEditionPicker] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const handleAdminPress = () => {
    console.log('TopBar - Admin button pressed');
    console.log('TopBar - User:', user ? { email: user.email, role: user.role } : 'No user');
    console.log('TopBar - onAdminPress callback exists:', !!onAdminPress);
    
    if (!user) {
      console.log('TopBar - No user found, showing alert');
      Alert.alert('Error', 'Debes iniciar sesión para acceder al panel de administración');
      return;
    }
    
    if (user.role !== 'admin') {
      console.log('TopBar - User is not admin, showing alert');
      Alert.alert('Acceso Denegado', 'No tienes permisos para acceder al panel de administración');
      return;
    }

    console.log('TopBar - User is admin, calling callback');
    if (onAdminPress) {
      console.log('TopBar - Calling onAdminPress callback');
      onAdminPress();
    } else {
      console.log('TopBar - ERROR: No onAdminPress callback provided');
      Alert.alert('Error', 'Función de administración no disponible');
    }
  };

  // Show admin button if explicitly requested OR if user is admin (for testing)
  const shouldShowAdminButton = showAdminButton || (user && user.role === 'admin');

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.rightSection}>
          {/* Edition Dropdown */}
          <TouchableOpacity 
            style={styles.editionButton}
            onPress={() => setShowEditionPicker(true)}
          >
            <Text style={styles.editionText}>{selectedEdition}</Text>
            <Icon name="chevron-down" size={16} color={colors.text} />
          </TouchableOpacity>

          {/* Admin Button */}
          {shouldShowAdminButton && (
            <TouchableOpacity 
              style={[styles.adminButton, { backgroundColor: isAdmin ? colors.primary : colors.warning }]}
              onPress={handleAdminPress}
            >
              <Icon name="settings" size={20} color={colors.background} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Edition Picker Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showEditionPicker}
        onClose={() => setShowEditionPicker(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Seleccionar Edición</Text>
          
          {AVAILABLE_EDITIONS.map((edition) => (
            <TouchableOpacity
              key={edition}
              style={[
                styles.editionOption,
                selectedEdition === edition && styles.selectedEditionOption
              ]}
              onPress={() => {
                onEditionChange(edition);
                setShowEditionPicker(false);
              }}
            >
              <Text style={[
                styles.editionOptionText,
                selectedEdition === edition && styles.selectedEditionOptionText
              ]}>
                {edition}
              </Text>
              {selectedEdition === edition && (
                <Icon name="check" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SimpleBottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 12 : 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    // Remove any additional top padding on iOS since we're already in SafeAreaView
    paddingTop: Platform.OS === 'ios' ? 8 : 16,
  },
  title: {
    ...commonStyles.title,
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  editionText: {
    ...commonStyles.text,
    fontWeight: '600',
  },
  adminButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetTitle: {
    ...commonStyles.subtitle,
    marginBottom: 20,
    textAlign: 'center',
  },
  editionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  selectedEditionOption: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editionOptionText: {
    ...commonStyles.text,
    fontSize: 16,
    fontWeight: '500',
  },
  selectedEditionOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
