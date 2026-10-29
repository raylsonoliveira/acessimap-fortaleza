import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { PontoAcessibilidade } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface PointDetailScreenProps {
  ponto: PontoAcessibilidade;
  onBack: () => void;
  onEditPonto: (ponto: PontoAcessibilidade) => void;
  onReportProblem: (ponto: PontoAcessibilidade) => void;
}

export const PointDetailScreen: React.FC<PointDetailScreenProps> = ({
  ponto,
  onBack,
  onEditPonto,
  onReportProblem,
}) => {
  const { excluirPonto, editarPonto } = useData();
  const { user } = useAuth();
  const [novaNota, setNovaNota] = useState<number>(5);
  const [avaliando, setAvaliando] = useState(false);

  const isOwner = Boolean(
    user &&
      (ponto.criadoPorId === user.id ||
        ponto.criadoPor.trim().toLowerCase() === user.nome.trim().toLowerCase())
  );

  function handleExcluir() {
    if (!isOwner) {
      Alert.alert(
        'Acesso Restrito (RF08)',
        `Apenas o autor do registro (${ponto.criadoPor}) possui permissão para excluir este ponto.`
      );
      return;
    }

    Alert.alert(
      'Excluir Ponto',
      `Deseja realmente remover o registro "${ponto.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await excluirPonto(ponto.id);
            Alert.alert('Removido', 'Ponto excluído com sucesso.');
            onBack();
          },
        },
      ]
    );
  }

  function handleEditar() {
    if (!isOwner) {
      Alert.alert(
        'Acesso Restrito (RF07)',
        `Apenas o autor do registro (${ponto.criadoPor}) pode editar os dados principais deste ponto.`
      );
      return;
    }
    onEditPonto(ponto);
  }

  async function handleRegistrarAvaliacao() {
    setAvaliando(true);
    try {
      const totalAnterior = ponto.nota * ponto.avaliacoesCount;
      const novoCount = ponto.avaliacoesCount + 1;
      const mediaAtualizada = Number(((totalAnterior + novaNota) / novoCount).toFixed(1));

      const pontoAvaliado: PontoAcessibilidade = {
        ...ponto,
        nota: mediaAtualizada,
        avaliacoesCount: novoCount,
      };
      await editarPonto(pontoAvaliado);
      Alert.alert(
        'Avaliação Registrada (RF09)',
        `Sua nota (${novaNota} ★) foi computada! Nova média do local: ${mediaAtualizada} ★.`
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível registrar sua avaliação.');
    } finally {
      setAvaliando(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes e Status</Text>
        <View style={styles.headerActions}>
          {isOwner && (
            <>
              <TouchableOpacity
                onPress={handleEditar}
                style={styles.iconBtn}
                accessibilityLabel="Editar ponto"
              >
                <Text style={styles.actionIcon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleExcluir}
                style={styles.iconBtn}
                accessibilityLabel="Excluir ponto"
              >
                <Text style={styles.actionIcon}>🗑️</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner com Foto Real (se anexada) ou Ilustração */}
        {ponto.fotoUrl ? (
          <Image source={{ uri: ponto.fotoUrl }} style={styles.photoBanner} />
        ) : (
          <View style={styles.imageBanner}>
            <Text style={styles.bannerIcon}>♿</Text>
            <Text style={styles.bannerText}>Registro de Acessibilidade</Text>
          </View>
        )}

        {/* Título e Endereço */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{ponto.titulo}</Text>
          <Text style={styles.address}>📍 {ponto.endereco}</Text>
          <Text style={styles.coordsText}>
            🌐 Coordenadas: {ponto.latitude.toFixed(4)}, {ponto.longitude.toFixed(4)}
          </Text>
          <View style={styles.badgeRow}>
            <Badge status={ponto.estado} />
            <View style={styles.ratingBox}>
              <Text style={styles.ratingText}>⭐ {ponto.nota.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({ponto.avaliacoesCount} avaliações)</Text>
            </View>
          </View>
        </View>

        {/* Recursos Disponíveis */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Recursos de Acessibilidade</Text>
          <View style={styles.resourceGrid}>
            {ponto.recursos.map((rec, i) => (
              <View key={i} style={styles.resourceChip}>
                <Text style={styles.resourceChipIcon}>✓</Text>
                <Text style={styles.resourceChipText}>{rec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Avaliações Recentes da Comunidade */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Relato do Autor</Text>
          <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>
                👤 {ponto.criadoPor} {isOwner ? '(Você)' : ''}
              </Text>
              <Text style={styles.commentDate}>{ponto.criadoEm}</Text>
            </View>
            <Text style={styles.commentBody}>{ponto.comentario}</Text>
          </View>
        </View>

        {/* Avaliar este Local (RF09 & RF13) */}
        <View style={styles.rateSection}>
          <Text style={styles.sectionHeader}>Avaliar Condições deste Local (RF09)</Text>
          <View style={styles.rateRow}>
            <View style={styles.starsSelect}>
              {[1, 2, 3, 4, 5].map(st => (
                <TouchableOpacity key={st} onPress={() => setNovaNota(st)}>
                  <Text style={[styles.starIcon, st <= novaNota && styles.starIconActive]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button
              title="Enviar Nota"
              onPress={handleRegistrarAvaliacao}
              loading={avaliando}
              style={styles.sendRateBtn}
            />
          </View>
        </View>

        {/* Ações do Autor (Editar / Excluir - RF07, RF08, RF16) */}
        {isOwner ? (
          <View style={styles.ownerActionsRow}>
            <Button
              title="Editar Ponto"
              variant="secondary"
              onPress={handleEditar}
              style={{ flex: 1 }}
              icon="✏️"
            />
            <Button
              title="Excluir Ponto"
              variant="danger"
              onPress={handleExcluir}
              style={{ flex: 1 }}
              icon="🗑️"
            />
          </View>
        ) : (
          <Text style={styles.ownerHint}>
            🔒 Cadastrado por {ponto.criadoPor}. Apenas o autor pode editar ou excluir este ponto (RF07/RF08).
          </Text>
        )}

        {/* Botão Reportar Problema do Figma */}
        <Button
          title="Reportar Problema neste Local"
          variant="outline"
          onPress={() => onReportProblem(ponto)}
          style={styles.reportBtn}
          icon="⚠️"
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.card,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: SPACING.xs,
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: SPACING.xs,
  },
  actionIcon: {
    fontSize: 18,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  photoBanner: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
  },
  imageBanner: {
    height: 130,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bannerIcon: {
    fontSize: 44,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  titleSection: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  address: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  coordsText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  resourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  resourceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resourceChipIcon: {
    color: COLORS.accessible,
    fontWeight: '800',
    marginRight: 6,
    fontSize: 12,
  },
  resourceChipText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  commentCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  commentDate: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  commentBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  rateSection: {
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  starsSelect: {
    flexDirection: 'row',
    gap: 6,
  },
  starIcon: {
    fontSize: 28,
    color: '#CBD5E1',
  },
  starIconActive: {
    color: '#F59E0B',
  },
  sendRateBtn: {
    height: 40,
    paddingHorizontal: 14,
  },
  ownerActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.sm,
  },
  ownerHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  reportBtn: {
    marginTop: SPACING.xs,
    borderColor: COLORS.inaccessible,
    marginBottom: SPACING.xl,
  },
});
