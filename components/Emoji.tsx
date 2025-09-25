
import React from 'react';
import { Text, TextStyle } from 'react-native';
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
          fontFamily: 'System',
          lineHeight: size + 4,
          color: colors.text,
          fontVariant: ['tabular-nums'],
        },
        style,
      ]}
    >
      {emoji}
    </Text>
  );
}
