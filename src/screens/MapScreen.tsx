import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';
import { useData } from '../context/DataContext';
import { PontoAcessibilidade, CategoriaPonto } from '../types';
import { Badge } from '../components/Badge';

interface MapScreenProps {
  onSelectPonto: (ponto: PontoAcessibilidade) => void;
  onNavigateToNewPoint: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  onSelectPonto,
  onNavigateToNewPoint,
}) => {
  const { pontos, filtroCategoria, setFiltroCategoria, pontosFiltrados, pontoSelecionado, setPontoSelecionado } = useData();
  const [busca, setBusca] = useState('');

  const displayedPontos = pontosFiltrados.filter(p =>
    p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    p.endereco.toLowerCase().includes(busca.toLowerCase())
  );

  const filterOptions: { key: 'todos' | CategoriaPonto; label: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'rampa', label: 'Rampas' },
    { key: 'calcada', label: 'Calçadas' },
    { key: 'predio', label: 'Locais' },
  ];

  return (
    <View style={styles.container}>
      {/* Barra de Busca do Figma */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pontos em Fortaleza..."
            placeholderTextColor={COLORS.textMuted}
            value={busca}
            onChangeText={setBusca}
          />
          <Text style={styles.buildingIcon}>🏛️</Text>
        </View>
      </View>

      {/* Área do Mapa Visual Interativo de Fortaleza */}
      <View style={styles.mapCanvas}>
        {/* Simulação gráfica das vias e avenidas de Fortaleza */}
        <View style={styles.streetGridHorizontal1} />
        <View style={styles.streetGridHorizontal2} />
        <View style={styles.streetGridVertical1} />
        <View style={styles.streetGridVertical2} />
        <View style={styles.diagonalStreet} />

        <View style={styles.fortalezaWatermark}>
          <Text style={styles.fortalezaLabel}>FORTALEZA - CE</Text>
        </View>

        {/* Marcadores dos Pontos na Tela */}
        {displayedPontos.map((ponto, index) => {
          const isSelected = pontoSelecionado?.id === ponto.id;
          let markerColor = COLORS.accessible;
          let icon = '♿';

          if (ponto.estado === 'parcial') {
            markerColor = COLORS.partial;
            icon = '⚠️';
          } else if (ponto.estado === 'inacessivel') {
            markerColor = COLORS.inaccessible;
            icon = '🚫';
          } else if (ponto.categoria === 'rampa') {
            markerColor = COLORS.accent;
            icon = '📐';
          }

          // Disposição calculada das posições na grade do mapa
          const positions = [
            { top: '22%', left: '46%' }, // UNIFOR
            { top: '15%', left: '74%' }, // Beira-Mar
            { top: '48%', left: '26%' }, // Centro / Pça do Ferreira
            { top: '32%', left: '38%' }, // Dragão do Mar
            { top: '65%', left: '60%' }, // Aldeota
          ];
          const pos = positions[index % positions.length];

          return (
            <TouchableOpacity
              key={ponto.id}
              style={[
                styles.mapMarker,
                { top: pos.top as any, left: pos.left as any, backgroundColor: markerColor },
                isSelected && styles.markerSelected,
              ]}
              onPress={() => setPontoSelecionado(ponto)}
              accessibilityLabel={`Ponto: ${ponto.titulo}`}
              accessibilityRole="button"
            >
              <Text style={styles.markerIcon}>{icon}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Botão Flutuante + Cadastrar Ponto */}
        <TouchableOpacity
          style={styles.fabButton}
          onPress={onNavigateToNewPoint}
          accessibilityLabel="Cadastrar novo ponto de acessibilidade"
          accessibilityRole="button"
        >
          <Text style={styles.fabIcon}>➕</Text>
          <Text style={styles.fabText}>Novo Ponto</Text>
        </TouchableOpacity>
      </View>

      {/* Pílulas de Filtro do Figma */}
      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {filterOptions.map(f => {
            const active = filtroCategoria === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setFiltroCategoria(f.key)}
                accessibilityRole="button"
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Card do Ponto Selecionado / Lista Rápida */}
      <View style={styles.bottomSheet}>
        {pontoSelecionado ? (
          <TouchableOpacity
            style={styles.cardSelected}
            onPress={() => onSelectPonto(pontoSelecionado)}
            accessibilityRole="button"
            accessibilityLabel={`Ver detalhes de ${pontoSelecionado.titulo}`}
          >
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {pontoSelecionado.titulo}
                </Text>
                <Text style={styles.cardAddress} numberOfLines={1}>
                  📍 {pontoSelecionado.endereco}
                </Text>
              </View>
              <Badge status={pontoSelecionado.estado} />
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.ratingText}>⭐ {pontoSelecionado.nota.toFixed(1)} ({pontoSelecionado.avaliacoesCount} avaliações)</Text>
              <Text style={styles.detailsLink}>Ver detalhes →</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noSelectionText}>
            Toque em um marcador no mapa para ver detalhes.
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 42,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  buildingIcon: {
    fontSize: 16,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#E5E7EB', // Fundo de mapa estilo OpenStreetMap / Figma
    position: 'relative',
    overflow: 'hidden',
  },
  streetGridHorizontal1: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
  },
  streetGridHorizontal2: {
    position: 'absolute',
    top: '68%',
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D1D5DB',
  },
  streetGridVertical1: {
    position: 'absolute',
    left: '32%',
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D1D5DB',
  },
  streetGridVertical2: {
    position: 'absolute',
    left: '68%',
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#D1D5DB',
  },
  diagonalStreet: {
    position: 'absolute',
    top: '20%',
    left: '-10%',
    width: '120%',
    height: 10,
    backgroundColor: '#FEF3C7',
    transform: [{ rotate: '25deg' }],
  },
  fortalezaWatermark: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  fortalezaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1,
  },
  mapMarker: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerSelected: {
    borderColor: '#1E293B',
    borderWidth: 3,
    transform: [{ scale: 1.2 }],
  },
  markerIcon: {
    fontSize: 16,
  },
  fabButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  fabText: {
    color: COLORS.textWhite,
    fontWeight: '700',
    fontSize: 13,
  },
  filtersWrapper: {
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filtersScroll: {
    paddingHorizontal: SPACING.md,
    gap: 8,
  },
  filterPill: {
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterPillTextActive: {
    color: COLORS.textWhite,
  },
  bottomSheet: {
    backgroundColor: COLORS.card,
    padding: SPACING.md,
  },
  cardSelected: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primaryLight,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardAddress: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  detailsLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noSelectionText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
