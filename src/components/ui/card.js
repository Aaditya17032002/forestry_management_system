import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Card = ({ children, style, ...props }) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.cardBackground },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardHeader = ({ children, style, ...props }) => (
  <View style={[styles.cardHeader, style]} {...props}>
    {children}
  </View>
);

export const CardContent = ({ children, style, ...props }) => (
  <View style={[styles.cardContent, style]} {...props}>
    {children}
  </View>
);

export const CardFooter = ({ children, style, ...props }) => (
  <View style={[styles.cardFooter, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default Card;