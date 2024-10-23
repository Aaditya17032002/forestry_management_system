import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Separator = ({ orientation = 'horizontal', style, ...props }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.separator,
        orientation === 'vertical' ? styles.vertical : styles.horizontal,
        { backgroundColor: theme.borderColor },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  separator: {
    backgroundColor: '#e0e0e0',
  },
  horizontal: {
    height: 1,
    width: '100%',
  },
  vertical: {
    width: 1,
    height: '100%',
  },
});

export default Separator;