import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface ProfileScreenProps {
  onLogout: () => void;
  onNavigateToRotas: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onLogout,
  onNavigateToRotas,
}) => {
  const { user, logout } = useAuth();
  const { ocorrencias, excluirOcorrencia, pontos } = useData();
  const [showMeusReportes, setShowMeusReportes] = useState(false);

  async function handleLogout() {
    Alert.alert('Sair da Conta', 'Deseja realmente encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
          onLogout();
        },
      },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Seção Avatar do Figma */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <Text style={styles.userName}>{user?.nome || 'Usuário AcessiMap'}</Text>
        <Text style={styles.userHandle}>{user?.handle || '@usuario123'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>
      </View>

      {/* Estatísticas Rápidas do Colaborador */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{pontos.length}</Text>
          <Text style={styles.statLabel}>Pontos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{ocorrencias.length}</Text>
          <Text style={styles.statLabel}>Reportes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Rotas Feitas</Text>
        </View>
      </View>

      {/* Menu com Setas do Figma */}
      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setShowMeusReportes(!showMeusReportes)}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>⚠️</Text>
            <Text style={styles.menuText}>Meus reportes ({ocorrencias.length})</Text>
          </View>
          <Text style={styles.chevron}>{showMeusReportes ? '▼' : '›'}</Text>
        </TouchableOpacity>

        {showMeusReportes ? (
          <View style={styles.reportesSubList}>
            {ocorrencias.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma ocorrência registrada ainda.</Text>
            ) : (
              ocorrencias.map(oco => (
                <View key={oco.id} style={styles.reportItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reportType}>{oco.tipo.toUpperCase()}</Text>
                    <Text style={styles.reportDesc} numberOfLines={2}>
                      {oco.descricao}
                    </Text>
                    <Text style={styles.reportAddress}>📍 {oco.endereco}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Excluir', 'Remover esta ocorrência?', [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Excluir',
                          style: 'destructive',
                          onPress: () => excluirOcorrencia(oco.id),
                        },
                      ]);
                    }}
                    style={styles.deleteOcoBtn}
                  >
                    <Text style={styles.deleteOcoText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        ) : null}

        <TouchableOpacity style={styles.menuRow} onPress={onNavigateToRotas}>
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🔀</Text>
            <Text style={styles.menuText}>Minhas rotas</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => Alert.alert('Favoritos', 'Você ainda não salvou rotas ou locais favoritos.')}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>❤️</Text>
            <Text style={styles.menuText}>Favoritos</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => Alert.alert('Configurações', 'Preferências de acessibilidade: Alto contraste ativado e leitor de tela habilitado.')}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Configurações</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Botão Sair do Figma */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        accessibilityRole="button"
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarIcon: {
    fontSize: 44,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userHandle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  menuSection: {
    marginVertical: SPACING.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  chevron: {
    fontSize: 18,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  reportesSubList: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.xs,
    gap: 8,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reportType: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  reportDesc: {
    fontSize: 12,
    color: COLORS.textPrimary,
    marginVertical: 2,
  },
  reportAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  deleteOcoBtn: {
    padding: 8,
  },
  deleteOcoText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingVertical: 8,
  },
  logoutBtn: {
    marginTop: SPACING.xl,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.inaccessible,
    fontWeight: '700',
  },
});
