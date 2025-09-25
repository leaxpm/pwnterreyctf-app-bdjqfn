
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

          {/* Admin Button - Only show if user is admin */}
          {isAdmin && showAdminButton && (
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={onAdminPress}
            >
              <Icon name="settings" size={20} color={colors.text} />
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
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: colors.surface,
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
