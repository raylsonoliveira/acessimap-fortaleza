import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { PontoAcessibilidade } from '../types';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useData } from '../context/DataContext';

interface PointDetailScreenProps {
  ponto: PontoAcessibilidade;
  onBack: () => void;
  onReportProblem: (ponto: PontoAcessibilidade) => void;
}

export const PointDetailScreen: React.FC<PointDetailScreenProps> = ({
  ponto,
  onBack,
  onReportProblem,
}) => {
  const { excluirPonto } = useData();

  function handleExcluir() {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes e Status</Text>
        <TouchableOpacity onPress={handleExcluir} style={styles.deleteBtn}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner com Foto Simulada / Placeholder */}
        <View style={styles.imageBanner}>
          <Text style={styles.bannerIcon}>♿</Text>
          <Text style={styles.bannerText}>Registro de Acessibilidade</Text>
        </View>

        {/* Título e Endereço */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{ponto.titulo}</Text>
          <Text style={styles.address}>📍 {ponto.endereco}</Text>
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
          <Text style={styles.sectionHeader}>Avaliação da Comunidade</Text>
          <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>👤 {ponto.criadoPor}</Text>
              <Text style={styles.commentDate}>{ponto.criadoEm}</Text>
            </View>
            <Text style={styles.commentBody}>{ponto.comentario}</Text>
          </View>
        </View>

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
  deleteBtn: {
    padding: SPACING.xs,
  },
  deleteIcon: {
    fontSize: 18,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  imageBanner: {
    height: 140,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  bannerIcon: {
    fontSize: 48,
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
    marginBottom: SPACING.lg,
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
  reportBtn: {
    marginTop: SPACING.sm,
    borderColor: COLORS.inaccessible,
  },
});
