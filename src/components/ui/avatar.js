import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Avatar = ({ children, style, ...props }) => (
  <View style={[styles.avatar, style]} {...props}>
    {children}
  </View>
);

export const AvatarImage = ({ src, alt, style, ...props }) => (
  <Image
    source={{ uri: src }}
    style={[styles.avatarImage, style]}
    {...props}
  />
);

export const AvatarFallback = ({ children, style, ...props }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.avatarFallback, { backgroundColor: theme.primaryColor }, style]} {...props}>
      <Text style={styles.avatarFallbackText}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Avatar;