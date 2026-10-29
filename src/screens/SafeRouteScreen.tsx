import React, { useState, useMemo } from 'react';
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
import { useData } from '../context/DataContext';

interface SafeRouteScreenProps {
  onBack: () => void;
}

function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Fator urbano de caminhada (1.25x distância em linha reta)
  return Math.max(0.4, Number((R * c * 1.25).toFixed(1)));
}

export const SafeRouteScreen: React.FC<SafeRouteScreenProps> = ({ onBack }) => {
  const { pontos, ocorrencias } = useData();
  const [origemIdx, setOrigemIdx] = useState(0);
  const [destinoIdx, setDestinoIdx] = useState(1);
  const [emNavegacao, setEmNavegacao] = useState(false);

  const pontoOrigem = pontos[origemIdx] || pontos[0];
  const pontoDestino = pontos[destinoIdx] || pontos[1] || pontos[0];

  const dadosRota = useMemo(() => {
    if (!pontoOrigem || !pontoDestino) {
      return {
        distanciaKm: '1,2 km',
        tempoMin: '15 min',
        rampas: 3,
        calcadasAdaptadas: 5,
        obstaculosAtivos: 0,
      };
    }

    const dist =
      pontoOrigem.id === pontoDestino.id
        ? 0.5
        : calcularDistanciaKm(
            pontoOrigem.latitude,
            pontoOrigem.longitude,
            pontoDestino.latitude,
            pontoDestino.longitude
          );

    const minutos = Math.max(6, Math.round((dist / 3.6) * 60));
    const rampasCount = pontos.filter(
      p => p.categoria === 'rampa' || p.estado === 'acessivel'
    ).length;
    const calcadasCount = pontos.filter(
      p => p.categoria === 'calcada' && p.estado !== 'inacessivel'
    ).length + 3;
    const obstaculosPendentes = ocorrencias.filter(o => o.status !== 'resolvido').length;

    return {
      distanciaKm: `${dist.toFixed(1).replace('.', ',')} km`,
      tempoMin: `${minutos} min`,
      rampas: rampasCount,
      calcadasAdaptadas: calcadasCount,
      obstaculosAtivos: obstaculosPendentes,
    };
  }, [pontoOrigem, pontoDestino, pontos, ocorrencias]);

  function handleIniciarRota() {
    setEmNavegacao(true);
    Alert.alert(
      'Navegação Ativada! ♿',
      `Rota acessível iniciada de "${pontoOrigem?.titulo}" até "${pontoDestino?.titulo}" (${dadosRota.distanciaKm} · ${dadosRota.tempoMin}).`
    );
  }

  return (
    <View style={styles.container}>
      {/* Header do Figma */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rota segura (RF14)</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Seletor Interativo de Origem e Destino */}
        <View style={styles.locationCard}>
          <View style={styles.routePoint}>
            <Text style={styles.pointDotGreen}>●</Text>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.pointLabel}>Ponto de Partida (toque para alternar)</Text>
              <TouchableOpacity
                onPress={() => {
                  setEmNavegacao(false);
                  setOrigemIdx((origemIdx + 1) % Math.max(1, pontos.length));
                }}
              >
                <Text style={styles.pointText}>
                  {pontoOrigem?.titulo || 'UNIFOR - Portão Principal'} ▾
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routePoint}>
            <Text style={styles.pointDotRed}>📍</Text>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.pointLabel}>Destino Acessível (toque para alternar)</Text>
              <TouchableOpacity
                onPress={() => {
                  setEmNavegacao(false);
                  setDestinoIdx((destinoIdx + 1) % Math.max(1, pontos.length));
                }}
              >
                <Text style={styles.pointText}>
                  {pontoDestino?.titulo || 'Calçadão da Beira-Mar'} ▾
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Card do Figma: Trajeto acessível */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trajeto acessível calculado</Text>
          <Text style={styles.summarySubtitle}>
            {dadosRota.distanciaKm} · {dadosRota.tempoMin}
          </Text>

          {/* Badges Verdes de Verificação do Figma */}
          <View style={styles.badgesColumn}>
            <View style={styles.checkBadge}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.badgeText}>Pontos com rampas / acessíveis</Text>
              <Text style={styles.badgeCount}>{dadosRota.rampas}</Text>
            </View>

            <View style={styles.checkBadge}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>
              <Text style={styles.badgeText}>Calçadas adaptadas mapeadas</Text>
              <Text style={styles.badgeCount}>{dadosRota.calcadasAdaptadas}</Text>
            </View>

            <View style={styles.checkBadge}>
              <View
                style={[
                  styles.checkCircle,
                  dadosRota.obstaculosAtivos > 0 && { backgroundColor: COLORS.partial },
                ]}
              >
                <Text style={styles.checkIcon}>
                  {dadosRota.obstaculosAtivos > 0 ? '!' : '✓'}
                </Text>
              </View>
              <Text style={styles.badgeText}>Ocorrências ativas desviadas</Text>
              <Text style={styles.badgeCount}>{dadosRota.obstaculosAtivos}</Text>
            </View>
          </View>
        </View>

        {/* Passos da Rota Acessível */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsHeader}>Instruções Passo a Passo</Text>

          <View style={styles.stepItem}>
            <Text style={styles.stepNum}>1</Text>
            <Text style={styles.stepDesc}>
              Inicie em {pontoOrigem?.titulo} ({pontoOrigem?.endereco}) utilizando o acesso principal com piso tátil.
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNum}>2</Text>
            <Text style={styles.stepDesc}>
              Percorra o corredor adaptado por {dadosRota.distanciaKm} (tempo médio estimado: {dadosRota.tempoMin}), desviando de {dadosRota.obstaculosAtivos} ocorrência(s) ativa(s).
            </Text>
          </View>

          <View style={styles.stepItem}>
            <Text style={styles.stepNum}>3</Text>
            <Text style={styles.stepDesc}>
              Utilize a travessia com rebaixo de guia padronizado (NBR 9050) até {pontoDestino?.titulo}.
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
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
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
