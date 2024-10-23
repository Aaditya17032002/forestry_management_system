import React, { createContext, useContext, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const SidebarContext = createContext();

export const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <View style={styles.container}>
        <View
          style={[
            styles.sidebar,
            { backgroundColor: theme.sidebarBackground },
            isOpen ? styles.sidebarOpen : styles.sidebarClosed,
          ]}
        >
          <ScrollView>{children}</ScrollView>
        </View>
      </View>
    </SidebarContext.Provider>
  );

};

export const SidebarTrigger = ({ children }) => {
  const { setIsOpen } = useContext(SidebarContext);
  return (
    <TouchableOpacity onPress={() => setIsOpen(prev => !prev)}>
      {children}
    </TouchableOpacity>
  );
};

export const SidebarContent = ({ children }) => {
  return <View style={styles.content}>{children}</View>;
};

export const SidebarItem = ({ icon, label, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.itemLabel, { color: theme.textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    zIndex: 100,
  },
  sidebarOpen: {
    transform: [{ translateX: 0 }],
  },
  sidebarClosed: {
    transform: [{ translateX: -250 }],
  },
  content: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemLabel: {
    marginLeft: 12,
    fontSize: 16,
  },
});

export default Sidebar;