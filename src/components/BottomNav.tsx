import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';

export type TabKey = 'mapa' | 'reportar' | 'rotas' | 'perfil';

interface BottomNavProps {
  currentTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'mapa', label: 'Mapa', icon: '🗺️' },
    { key: 'reportar', label: 'Reportar', icon: '➕' },
    { key: 'rotas', label: 'Rotas', icon: '🔀' },
    { key: 'perfil', label: 'Perfil', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = currentTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => onSelectTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Navegar para ${tab.label}`}
          >
            <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
              <Text style={styles.iconText}>{tab.icon}</Text>
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  activeIconWrapper: {
    backgroundColor: COLORS.primaryLight,
  },
  iconText: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  activeTabLabel: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
