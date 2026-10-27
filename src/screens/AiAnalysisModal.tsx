import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { SugestaoIA } from '../types';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

interface AiAnalysisModalProps {
  visible: boolean;
  sugestao: SugestaoIA | null;
  onConfirm: (sugestao: SugestaoIA) => void;
  onEdit: () => void;
  onClose: () => void;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({
  visible,
  sugestao,
  onConfirm,
  onEdit,
  onClose,
}) => {
  if (!sugestao) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header da Tela 5 */}
          <View style={styles.modalHeader}>
            <View style={styles.iaPill}>
              <Text style={styles.iaPillText}>✨ Google Gemini AI</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Auxílio por Inteligência Artificial</Text>
            <Text style={styles.modalSubtitle}>
              O Gemini analisou seu relato e sugeriu a classificação técnica abaixo segundo a NBR 9050:
            </Text>

            {/* Resumo do Relato */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>Resumo da Análise</Text>
              <Text style={styles.resumoText}>{sugestao.resumo}</Text>
            </View>

            {/* Categoria e Classificação Sugerida */}
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Categoria Sugerida</Text>
                <Text style={styles.metricValue}>
                  {sugestao.categoriaSugerida.toUpperCase()}
                </Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Gravidade</Text>
                <Badge
                  status={
                    sugestao.gravidade === 'Alta'
                      ? 'inacessivel'
                      : sugestao.gravidade === 'Média'
                      ? 'parcial'
                      : 'acessivel'
                  }
                  label={sugestao.gravidade}
                />
              </View>
            </View>

            {/* Classificação de Acessibilidade */}
            <View style={styles.sectionBox}>
              <Text style={styles.sectionLabel}>Estado de Acessibilidade Sugerido</Text>
              <Badge status={sugestao.classificacaoSugerida} style={{ marginTop: 4 }} />
            </View>

            {/* Recomendação Prática */}
            <View style={[styles.sectionBox, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
              <Text style={[styles.sectionLabel, { color: '#166534' }]}>Recomendação Técnica</Text>
              <Text style={[styles.resumoText, { color: '#15803D' }]}>{sugestao.recomendacao}</Text>
            </View>

            {/* Botões do Figma: Confirmar e Editar */}
            <View style={styles.actions}>
              <Button
                title="Confirmar e Aplicar Sugestão"
                onPress={() => onConfirm(sugestao)}
                style={styles.confirmBtn}
              />
              <Button
                title="Editar Manualmente"
                variant="outline"
                onPress={onEdit}
                style={styles.editBtn}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  iaPill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  iaPillText: {
    color: '#4338CA',
    fontSize: 12,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: SPACING.md,
  },
  sectionBox: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resumoText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  actions: {
    marginTop: SPACING.md,
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
  },
  editBtn: {
    marginTop: SPACING.xs,
  },
});
