
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#EC4899',
  accent: '#6366F1',
  background: '#FFFFFF',
  backgroundAlt: '#F1F5F9',
  surface: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Event type colors
  ctfTag: '#EF4444',
  tallerTag: '#10B981',
  charlaTag: '#3B82F6',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  text: {
    fontSize: 16,
    color: colors.text,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shadow: {
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContainer: {
    paddingVertical: 16,
  },
});

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  smallText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tabInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  ctfTag: {
    backgroundColor: colors.ctfTag + '20',
  },
  tallerTag: {
    backgroundColor: colors.tallerTag + '20',
  },
  charlaTag: {
    backgroundColor: colors.charlaTag + '20',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  favoriteButton: {
    padding: 4,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});
