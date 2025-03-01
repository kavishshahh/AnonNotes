import { View, ViewProps } from 'react-native';
import { darkTheme } from '../_layout';

interface ThemedViewProps extends ViewProps {
  style?: ViewProps['style'];
}

export function ThemedView({ style, ...props }: ThemedViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: darkTheme.background,
        },
        style,
      ]}
      {...props}
    />
  );
} 