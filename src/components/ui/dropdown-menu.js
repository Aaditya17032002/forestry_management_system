import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const DropdownMenu = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <View>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        {trigger}
      </TouchableOpacity>
      <Modal
        transparent
        visible={isOpen}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.dropdown, { backgroundColor: theme.cardBackground }]}>
            {children}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export const DropdownMenuItem = ({ onPress, children }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
    >
      <Text style={[styles.menuItemText, { color: theme.textColor }]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    minWidth: 200,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    padding: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default DropdownMenu;