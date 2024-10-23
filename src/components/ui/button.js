import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Button = ({ children, variant = 'default', size = 'medium', style, ...props }) => {
  const { theme } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primaryColor,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: theme.primaryColor,
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        style,
      ]}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text style={[
          styles.text,
          { color: variant === 'default' ? '#fff' : theme.textColor },
        ]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;