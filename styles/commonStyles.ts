
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#1a1a1a',      // Dark text color
  secondary: '#666666',    // Gray text
  accent: '#007AFF',       // Blue accent for buttons
  background: '#FFFFFF',   // White background
  backgroundAlt: '#F8F9FA', // Light gray background
  text: '#1a1a1a',        // Dark text
  textSecondary: '#666666', // Gray text
  border: '#E5E5E7',      // Light border
  card: '#FFFFFF',        // White card background
  ctfTag: '#FF6B6B',      // Red for CTF tags
  tallerTag: '#4ECDC4',   // Teal for Taller tags
  charlaTag: '#45B7D1',   // Blue for Charla tags
  yellow: '#FFD93D',      // Yellow for local data indicator
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingBottom: 0,
    paddingTop: 12,
    paddingHorizontal: 8,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  ctfTag: {
    backgroundColor: colors.ctfTag,
  },
  tallerTag: {
    backgroundColor: colors.tallerTag,
  },
  charlaTag: {
    backgroundColor: colors.charlaTag,
  },
  tagText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 8,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  localDataIndicator: {
    backgroundColor: colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
