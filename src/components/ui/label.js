import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Label = ({ children, style, ...props }) => {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        styles.label,
        { color: theme.textColor },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
});

export default Label;