import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const Sheet = ({ children, isOpen, onClose }) => {
  const { theme } = useTheme();

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.backgroundColor }]}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export const SheetTrigger = ({ children, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    {children}
  </TouchableOpacity>
);

export const SheetContent = ({ children, style, ...props }) => (
  <View style={[styles.content, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    minHeight: 200,
  },
  content: {
    flex: 1,
  },
});

export default Sheet;