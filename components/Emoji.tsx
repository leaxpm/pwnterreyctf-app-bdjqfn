
import React from 'react';
import { Text, TextStyle, Platform } from 'react-native';
import { colors } from '../styles/commonStyles';

interface EmojiProps {
  emoji: string;
  size?: number;
  style?: TextStyle;
}

export default function Emoji({ emoji, size = 24, style }: EmojiProps) {
  return (
    <Text
      style={[
        {
          fontSize: size,
          textAlign: 'center',
          includeFontPadding: false,
          textAlignVertical: 'center',
          lineHeight: Platform.OS === 'android' ? size + 2 : size + 4,
          // Use platform-specific font families for better emoji support
          fontFamily: Platform.select({
            ios: 'Apple Color Emoji',
            android: 'Noto Color Emoji',
            default: 'System',
          }),
          // Ensure proper color inheritance
          color: colors.text,
          // Remove font variants that might interfere with emoji rendering
          fontVariant: undefined,
          // Ensure proper text rendering
          fontWeight: 'normal',
          fontStyle: 'normal',
        },
        style,
      ]}
      // Add accessibility label for screen readers
      accessibilityLabel={`Emoji: ${emoji}`}
      // Prevent text selection issues
      selectable={false}
    >
      {emoji}
    </Text>
  );
}
