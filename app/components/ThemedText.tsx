import { Text, TextProps } from 'react-native';
import { darkTheme } from '../_layout';

interface ThemedTextProps extends TextProps {
  style?: TextProps['style'];
}

export function ThemedText({ style, ...props }: ThemedTextProps) {
  return (
    <Text
      style={[
        {
          color: darkTheme.text,
          fontSize: 16,
        },
        style,
      ]}
      {...props}
    />
  );
} 