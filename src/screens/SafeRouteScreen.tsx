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
import { Button } from '../components/Button';
import { ROTA_PADRAO } from '../data/mockData';

interface SafeRouteScreenProps {
  onBack: () => void;
}

export const SafeRouteScreen: React.FC<SafeRouteScreenProps> = ({ onBack }) => {
  const [emNavegacao, setEmNavegacao] = useState(false);

  function handleIniciarRota() {
    setEmNavegacao(true);
    Alert.alert(
      'Navegação Ativada! ♿',
      `Rota guiada iniciada com sucesso até ${ROTA_PADRAO.destino}. Siga pela calçada adaptada com piso tátil contínuo.`
    );
  }

  return (
    <View style={styles.container}>
      {/* Header do Figma */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rota segura</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Origem e Destino */}
        <View style={styles.locationCard}>
          <View style={styles.routePoint}>
            <Text style={styles.pointDotGreen}>●</Text>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.pointLabel}>Ponto de Partida</Text>
              <Text style={styles.pointText}>{ROTA_PADRAO.origem}</Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routePoint}>
            <Text style={styles.pointDotRed}>📍</Text>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.pointLabel}>Destino Acessível</Text>
              <Text style={styles.pointText}>{ROTA_PADRAO.destino}</Text>
            </View>
          </View>
        </View>

        {/* Card do Figma: Trajeto acessível 1,2 km · 15 min */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trajeto acessível</Text>
          <Text style={styles.summarySubtitle}>
            {ROTA_PADRAO.distanciaKm} · {ROTA_PADRAO.tempoMin}
          </Text>

          {/* Badges Verdes de Verificação do Figma */}
          <View style={styles.badgesColumn}>
            <View style={styles.checkBadge}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.badgeText}>Rampas</Text>
              <Text style={styles.badgeCount}>{ROTA_PADRAO.rampas}</Text>
            </View>

            <View style={styles.checkBadge}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.badgeText}>Calçadas adaptadas</Text>
              <Text style={styles.badgeCount}>{ROTA_PADRAO.calcadasAdaptadas}</Text>
            </View>

            <View style={styles.checkBadge}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.badgeText}>Sem obstáculos</Text>
              <Text style={styles.badgeCount}>{ROTA_PADRAO.semObstaculos}</Text>
            </View>
          </View>
        </View>

        {/* Passos da Rota Acessível */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsHeader}>Instruções Passo a Passo</Text>

          <View style={styles.stepItem}>
            <Text style={styles.stepNum}>1</Text>
            <Text style={styles.stepDesc}>
              Saia pelo portão principal da UNIFOR com rampa rebaixada e piso tátil.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNum}>2</Text>
            <Text style={styles.stepDesc}>
              Siga pela calçada leste da Av. Washington Soares (350m com guia rebaixada).
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNum}>3</Text>
            <Text style={styles.stepDesc}>
              Atravesse na faixa de pedestres com semáforo sonoro em frente ao shopping.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNum}>4</Text>
            <Text style={styles.stepDesc}>
              Acesso nivelado à entrada sul do Parque do Cocó.
            </Text>
          </View>
        </View>

        {/* Botão Verde Iniciar Rota do Figma */}
        <Button
          title={emNavegacao ? '✓ Rota em Andamento' : 'Iniciar rota'}
          onPress={handleIniciarRota}
          style={styles.startBtn}
          icon={emNavegacao ? '♿' : '🚀'}
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
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  locationCard: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointDotGreen: {
    fontSize: 18,
    color: COLORS.accessible,
  },
  pointDotRed: {
    fontSize: 16,
  },
  pointLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  pointText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  routeLine: {
    width: 2,
    height: 18,
    backgroundColor: COLORS.border,
    marginLeft: 6,
    marginVertical: 4,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: SPACING.lg,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  summarySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  badgesColumn: {
    gap: 10,
  },
  checkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.accessible,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkIcon: {
    color: COLORS.textWhite,
    fontSize: 14,
    fontWeight: '900',
  },
  badgeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  badgeCount: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  stepsSection: {
    marginBottom: SPACING.xl,
  },
  stepsHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    marginRight: 10,
  },
  stepDesc: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    marginBottom: SPACING.xl,
  },
});
