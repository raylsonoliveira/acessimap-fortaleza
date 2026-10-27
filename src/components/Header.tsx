import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';

interface HeaderProps {
  onOpenChat: () => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenChat,
  title = 'AcessiMap Fortaleza',
  showBack = false,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.backBtn}
              accessibilityLabel="Voltar"
              accessibilityRole="button"
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.iaBadge}>
              <Text style={styles.iaBadgeText}>IA</Text>
            </View>
          )}
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={onOpenChat}
            accessibilityLabel="Visualizar chat com assistente de inteligência artificial"
            accessibilityRole="button"
          >
            <Text style={styles.chatButtonText}>Visualizar chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1E293B',
    paddingTop: Platform.OS === 'android' ? 28 : 0,
  },
  container: {
    height: 54,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  leftContainer: {
    width: 60,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 110,
    alignItems: 'flex-end',
  },
  iaBadge: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#475569',
  },
  iaBadgeText: {
    color: '#38BDF8',
    fontWeight: 'bold',
    fontSize: 12,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  backIcon: {
    color: COLORS.textWhite,
    fontSize: 22,
    fontWeight: '600',
  },
  title: {
    color: COLORS.textWhite,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  chatButton: {
    backgroundColor: COLORS.chatBlue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  chatButtonText: {
    color: COLORS.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
});
