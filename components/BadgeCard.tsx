
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from '../types/Badge';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface BadgeCardProps {
  badge: Badge;
  progress?: number;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, progress = 0 }) => {
  const isUnlocked = badge.isUnlocked;
  
  return (
    <View style={[
      styles.badgeCard,
      { 
        backgroundColor: isUnlocked ? badge.color : colors.backgroundAlt,
        opacity: isUnlocked ? 1 : 0.6
      }
    ]}>
      <View style={[
        styles.iconContainer,
        { 
          backgroundColor: isUnlocked ? 'rgba(255,255,255,0.2)' : colors.border
        }
      ]}>
        <Icon 
          name={badge.icon} 
          size={24} 
          color={isUnlocked ? colors.background : colors.textSecondary} 
        />
      </View>
      
      <View style={styles.badgeContent}>
        <Text style={[
          styles.badgeName,
          { color: isUnlocked ? colors.background : colors.text }
        ]}>
          {badge.name}
        </Text>
        
        <Text style={[
          styles.badgeDescription,
          { color: isUnlocked ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
        ]}>
          {badge.description}
        </Text>
        
        {!isUnlocked && progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progress}%`,
                    backgroundColor: badge.color
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progress)}%
            </Text>
          </View>
        )}
        
        {!isUnlocked && badge.requirements.length > 0 && (
          <Text style={styles.requirementText}>
            {badge.requirements[0].description}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeContent: {
    flex: 1,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  badgeDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  requirementText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default BadgeCard;
