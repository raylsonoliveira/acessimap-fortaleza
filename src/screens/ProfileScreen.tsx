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
import { Ocorrencia, PontoAcessibilidade } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

interface ProfileScreenProps {
  onLogout: () => void;
  onNavigateToRotas: () => void;
  onEditPonto: (ponto: PontoAcessibilidade) => void;
  onEditOcorrencia: (ocorrencia: Ocorrencia) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onLogout,
  onNavigateToRotas,
  onEditPonto,
  onEditOcorrencia,
}) => {
  const { user, updateUserProfile, logout } = useAuth();
  const { ocorrencias, excluirOcorrencia, pontos, excluirPonto } = useData();

  const [showMeusPontos, setShowMeusPontos] = useState(false);
  const [showMeusReportes, setShowMeusReportes] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(false);

  const [nomeInput, setNomeInput] = useState(user?.nome || '');
  const [telefoneInput, setTelefoneInput] = useState(user?.telefone || '');
  const [handleInput, setHandleInput] = useState(user?.handle || '');
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const meusPontos = pontos.filter(
    p =>
      user &&
      (p.criadoPorId === user.id ||
        p.criadoPor.trim().toLowerCase() === user.nome.trim().toLowerCase())
  );

  const minhasOcorrencias = ocorrencias.filter(
    o =>
      user &&
      (o.criadoPorId === user.id ||
        o.criadoPor.trim().toLowerCase() === user.nome.trim().toLowerCase())
  );

  async function handleSalvarPerfil() {
    if (!nomeInput.trim()) {
      Alert.alert('Atenção', 'O nome não pode ficar vazio.');
      return;
    }
    setSalvandoPerfil(true);
    try {
      await updateUserProfile({
        nome: nomeInput.trim(),
        telefone: telefoneInput.trim(),
        handle: handleInput.trim(),
      });
      setEditandoPerfil(false);
      Alert.alert('Perfil Atualizado (RF04)', 'Seus dados de perfil foram salvos com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setSalvandoPerfil(false);
    }
  }

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
        {user?.telefone ? (
          <Text style={styles.userPhone}>📞 {user.telefone}</Text>
        ) : null}
      </View>

      {/* Estatísticas Rápidas do Colaborador */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{meusPontos.length}</Text>
          <Text style={styles.statLabel}>Meus Pontos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{minhasOcorrencias.length}</Text>
          <Text style={styles.statLabel}>Meus Reportes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{pontos.length}</Text>
          <Text style={styles.statLabel}>Total Fortaleza</Text>
        </View>
      </View>

      {/* Menu com Setas do Figma (Tela 8) */}
      <View style={styles.menuSection}>
        {/* 1. Editar Perfil (RF04) */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => {
            setNomeInput(user?.nome || '');
            setTelefoneInput(user?.telefone || '');
            setHandleInput(user?.handle || '');
            setEditandoPerfil(!editandoPerfil);
          }}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={styles.menuText}>Editar perfil (RF04)</Text>
          </View>
          <Text style={styles.chevron}>{editandoPerfil ? '▼' : '›'}</Text>
        </TouchableOpacity>

        {editandoPerfil && (
          <View style={styles.editProfileBox}>
            <Input
              label="Nome completo"
              value={nomeInput}
              onChangeText={setNomeInput}
              placeholder="Seu nome completo"
            />
            <Input
              label="Identificador (@handle)"
              value={handleInput}
              onChangeText={setHandleInput}
              placeholder="@seu_usuario"
            />
            <Input
              label="Telefone"
              value={telefoneInput}
              onChangeText={setTelefoneInput}
              placeholder="(85) 99999-9999"
            />
            <Button
              title="Salvar Dados do Perfil"
              onPress={handleSalvarPerfil}
              loading={salvandoPerfil}
              style={{ marginTop: 8 }}
            />
          </View>
        )}

        {/* 2. Meus Pontos Cadastrados (RF04, RF07, RF08) */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setShowMeusPontos(!showMeusPontos)}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>📍</Text>
            <Text style={styles.menuText}>Meus pontos cadastrados ({meusPontos.length})</Text>
          </View>
          <Text style={styles.chevron}>{showMeusPontos ? '▼' : '›'}</Text>
        </TouchableOpacity>

        {showMeusPontos && (
          <View style={styles.reportesSubList}>
            {meusPontos.length === 0 ? (
              <Text style={styles.emptyText}>Você ainda não cadastrou pontos.</Text>
            ) : (
              meusPontos.map(pt => (
                <View key={pt.id} style={styles.reportItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reportType}>{pt.categoria.toUpperCase()} • ★ {pt.nota}</Text>
                    <Text style={styles.reportDesc} numberOfLines={1}>
                      {pt.titulo}
                    </Text>
                    <Text style={styles.reportAddress}>📍 {pt.endereco}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => onEditPonto(pt)}
                    style={styles.actionSmallBtn}
                    accessibilityLabel={`Editar ponto ${pt.titulo}`}
                  >
                    <Text style={styles.actionSmallText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert('Excluir Ponto', `Remover "${pt.titulo}"?`, [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Excluir',
                          style: 'destructive',
                          onPress: () => excluirPonto(pt.id),
                        },
                      ]);
                    }}
                    style={styles.actionSmallBtn}
                    accessibilityLabel={`Excluir ponto ${pt.titulo}`}
                  >
                    <Text style={styles.actionSmallText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* 3. Minhas Ocorrências / Meus Reportes (RF17) */}
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setShowMeusReportes(!showMeusReportes)}
        >
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>⚠️</Text>
            <Text style={styles.menuText}>Minhas ocorrências ({ocorrencias.length})</Text>
          </View>
          <Text style={styles.chevron}>{showMeusReportes ? '▼' : '›'}</Text>
        </TouchableOpacity>

        {showMeusReportes ? (
          <View style={styles.reportesSubList}>
            {ocorrencias.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma ocorrência registrada ainda.</Text>
            ) : (
              ocorrencias.map(oco => {
                const isOcoOwner = Boolean(
                  user &&
                    (oco.criadoPorId === user.id ||
                      oco.criadoPor.trim().toLowerCase() === user.nome.trim().toLowerCase())
                );
                return (
                  <View key={oco.id} style={styles.reportItem}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.reportType}>{oco.tipo.toUpperCase()}</Text>
                        <Badge status={oco.status} />
                      </View>
                      <Text style={styles.reportDesc} numberOfLines={2}>
                        {oco.descricao}
                      </Text>
                      <Text style={styles.reportAddress}>
                        📍 {oco.endereco} • Por {oco.criadoPor}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => onEditOcorrencia(oco)}
                      style={styles.actionSmallBtn}
                      accessibilityLabel="Editar ocorrência"
                    >
                      <Text style={styles.actionSmallText}>✏️</Text>
                    </TouchableOpacity>
                    {isOcoOwner && (
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
                        style={styles.actionSmallBtn}
                        accessibilityLabel="Excluir ocorrência"
                      >
                        <Text style={styles.actionSmallText}>🗑️</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}
          </View>
        ) : null}

        {/* 4. Minhas Rotas */}
        <TouchableOpacity style={styles.menuRow} onPress={onNavigateToRotas}>
          <View style={styles.menuLeft}>
            <Text style={styles.menuIcon}>🔀</Text>
            <Text style={styles.menuText}>Minhas rotas seguras</Text>
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
        <Text style={styles.logoutText}>Sair da Conta</Text>
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
  userPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
  editProfileBox: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  actionSmallBtn: {
    padding: 8,
  },
  actionSmallText: {
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
