import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const Input = (props) => {
  const { theme } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        { 
          backgroundColor: theme.inputBackground,
          color: theme.textColor,
          borderColor: theme.borderColor,
        },
        props.style,
      ]}
      placeholderTextColor={theme.placeholderColor}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
});

export default Input;